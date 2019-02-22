import { exec, ChildProcess } from 'child_process';
import BufferUntilReadable from './BufferUntilReadable';

import { EventEmitter } from 'events';
import { CommandError, ConnectionError } from './Errors';

import { parseResult } from './GdbResultParser';

interface TextResult {
  text: string
}

export interface Result {
  token: number;
  class: string;
  results: any;
}

interface ExecResult extends Result {}

interface StatusResult extends Result {}

interface NotifyResult extends Result {}

interface RequestIdentifier {
  token: number;
  result?: Result;
  receivedResult: boolean;
}

class GdbConnection extends EventEmitter {
  private process: ChildProcess;
  private stdout: BufferUntilReadable;
  private stderr: BufferUntilReadable;

  private consoleOutRegex: RegExp = /~(.*)/;
  private targetOutRegex: RegExp = /@(.*)/;
  private logOutRegex: RegExp = /&(.*)/;

  private execOutRegex: RegExp = /(\d*)\*(stopped)(.*)/;
  private statusOutRegex: RegExp = /(\d*)\+(stopped)(.*)/;
  private notifyOutRegex: RegExp = /(\d*)=(stopped)(.*)/;

  private resultOutRegex: RegExp = /(\d*)\^(done|running|connected|error|exit)(.*)/;

  private messageId: number = 0;

  private awaitingRequests: RequestIdentifier[] = [];

  constructor(process: ChildProcess) {
    super();
    this.process = process;

    this.stdout = new BufferUntilReadable(this.process.stdout, '\n');
    this.stderr = new BufferUntilReadable(this.process.stderr, '\n');

    this.stdout.on('data', text => {
      let result: RegExpExecArray;
      if((result = this.consoleOutRegex.exec(text)) !== null) {
        const r: TextResult = { text: result[1] };
        this.emit('console', r);
      } else if((result = this.targetOutRegex.exec(text)) !== null) {
        const r: TextResult = { text: result[1] };
        this.emit('target', r);
      } else if((result = this.logOutRegex.exec(text)) !== null) {
        const r: TextResult = { text: result[1] };
        this.emit('log', r);
      } else if((result = this.execOutRegex.exec(text)) !== null) {
        const r: ExecResult = {
          token: parseInt(result[1]),
          class: result[2],
          results: parseResult(result[3])
        };
        this.emit('exec-result', r);
      } else if((result = this.statusOutRegex.exec(text)) !== null) {
        const r: StatusResult = {
          token: parseInt(result[1]),
          class: result[2],
          results: parseResult(result[3])
        };
        this.emit('status', r);
      } else if((result = this.notifyOutRegex.exec(text)) !== null) {
        const r: NotifyResult = {
          token: parseInt(result[1]),
          class: result[2],
          results: parseResult(result[3])
        };
        this.emit('notify', r);
      } else if((result = this.resultOutRegex.exec(text)) !== null) {
        const r: Result = {
          token: parseInt(result[1]),
          class: result[2],
          results: parseResult(result[3])
        };
        this.emit('result', r);
      } else {
        console.log("No Match");
        console.log(text);
      }
    });

    this.stderr.on('data', text => {
      console.log(`ERROR ${text}`);
    });
  }

  static start() : Promise<GdbConnection> {
    return new Promise<GdbConnection>((resolve) => {
      let childProcess: ChildProcess;
      childProcess = exec('/usr/bin/gdb --interpreter=mi2');
      let conn = new GdbConnection(childProcess);
      resolve(conn);
    });
  }

  static target(host: string, port: number) : Promise<GdbConnection> {
    return new Promise<GdbConnection>(async (resolve, reject) => {
      let childProcess: ChildProcess;
      childProcess = exec('/usr/bin/gdb --interpreter=mi2');
      let conn = new GdbConnection(childProcess);
      try {
        const data = await conn.target(host, port);
        if (data.class === 'connected') {
          resolve(conn);
        }
        else {
          reject(new ConnectionError(host, port));
        }
      }
      catch (err) {
        reject(err);
      }
    });
  }

  async kill() {
    return this.sendCommand(`-exec-abort`);
  }

  async listBreakpoints() {
    return this.sendCommand(`-break-info`)
      .then(res => {
        return res.results;
      });
  }

  async loadSymbols(file: string) {
    return this.sendCommand(`-file-symbol-file ${file}`);
  }

  async addBreakpoint(funcOrFilename: string, line?: number): Promise<Result> {
    if(line === undefined || line === null) {
      return this.sendCommand('-break-insert', funcOrFilename);
    } else {
      return this.sendCommand('-break-insert', `${funcOrFilename}:${line}`);
    }
  }

  async removeBreakpoint(bpNum: number): Promise<Result> {
    return this.sendCommand('-break-delete', `${bpNum}`);
  }

  async stackInfoFrame(): Promise<Result> {
    return this.sendCommand('-stack-info-frame');
  }

  async stackListFrames(): Promise<Result> {
    return this.sendCommand('-stack-list-frames');
  }

  async varCreate(expr: string, name?: string, frameAddr?: string): Promise<Result> {
    return this.sendCommand('-var-create', name ? name : '-', frameAddr ? frameAddr : '*', expr);
  }
  
  async varDelete(name: string): Promise<Result> {
    return this.sendCommand('-var-delete', name);
  }
  
  async varAssign(name: string, expr: string): Promise<Result> {
    return this.sendCommand('-var-assign', name, expr);
  }
  
  async varUpdate(simpleValues: boolean, name?: string): Promise<Result> {
    return this.sendCommand('-var-update', simpleValues ? '--simple-values' : '--all-values', name ? name : '*');
  }

  async dataListRegisterValues(skipUnavailable?: boolean,
      format?: 'x' | 'o' | 't' | 'd' | 'r' | 'N', ...regs: number[]): Promise<Result> {
    return this.sendCommand('-data-list-register-values',
      (skipUnavailable) ? '--skip-unavailable' : '',
      (format) ? format : 'x',
      ...regs.map(reg => reg.toString())
    );
  }

  async dataListRegisterNames(...regs: number[]): Promise<Result> {
    return this.sendCommand('-data-list-register-names', ...regs.map(reg => reg.toString()));
  }

  async step(reverse?: boolean): Promise<Result> {
    if(reverse) {
      return this.sendCommand('-exec-step', '--reverse');
    } else {
      return this.sendCommand('-exec-step');
    }
  }

  async continue(): Promise<Result> {
    return this.sendCommand('-exec-continue');
  }

  async next(): Promise<Result> {
    return this.sendCommand('-exec-next');
  }

  async finish(): Promise<Result> {
    return this.sendCommand('-exec-finish');
  }

  async target(host: string, port: number): Promise<Result> {
    return this.sendCommand(`-target-select`, `remote`, `${host}:${port}`);
  }

  async sendCommand(command: string, ...args: string[]): Promise<Result> {
    const token = ++this.messageId;
    return new Promise<Result>((resolve, reject) => {
      const request: RequestIdentifier = {
         token, receivedResult: false
      }
      this.awaitingRequests.push(request);
      const commandStr = `${token}${command} ${args.join(' ')}\n`;
      this.process.stdin.write(commandStr);

      const resultAwaiter = (res: Result) => {
        if(res.token === token) {
          request.result = res;
          this.removeListener('result', resultAwaiter);
          if(res.class === 'error') {
            reject(new CommandError(token, commandStr, res));
          } else {
            resolve(res);
          }
        }
      };

      this.on('result', resultAwaiter);
    });
  }

}

export default GdbConnection;
