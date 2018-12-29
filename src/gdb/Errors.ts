import { Result } from './GdbConnector';

export class CommandTimeoutError extends Error {
  token: number;
  command: string;
  constructor(token: number, cmd: string) {
    super("Command timed out");
    this.token = token;
    this.command = cmd;
  }
}

export class CommandError extends Error {
  token: number;
  command: string;
  result: Result;
  constructor(token: number, cmd: string, cmdResult: Result) {
    super();
    this.token = token;
    this.command = cmd;
    this.result = cmdResult;
  }
}

export class ConnectionError extends Error {
  host: string;
  port: number;
  constructor(host: string, port: number) {
    super(`Failed connection to: ${host}:${port}`);
    this.host = host;
    this.port = port;
  }
}
