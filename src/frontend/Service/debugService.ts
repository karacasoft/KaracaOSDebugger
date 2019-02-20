import * as client from 'socket.io-client';
import { StackFrameList } from './debugServiceTypes';

export const socket = client.connect('http://localhost:5000');

interface BreakpointEntry {
  number: number;
  type: string;
  disp: string;
  enabled: boolean;
  addr: string;
  func: string;
  file: string;
  fullname: string;
  line: number;
  "thread-groups": string[];
  times: number;
  "original-location": string;
}

interface BreakpointTableItem {
  bkpt: BreakpointEntry;
}

interface BreakpointTableColumn {
  width: number;
  alignment: number;
  col_name: string;
  colhdr: string;
}

export interface BreakpointListResponse {
  nr_rows: number;
  nr_cols: number;
  hdr: BreakpointTableColumn[];
  body: BreakpointTableItem[];
}

export interface ExecResultEventResultsFrame {
  addr: string;
  args: string[];
  func: string;
  file?: string;
  fullname?: string;
  line: string; // TODO convert to number
}

export interface ExecResultEventResults {
  frame?: ExecResultEventResultsFrame;
  "stopped-threads"?: "all";
  "thread-id"?: string;
  "bkptno"?: string;
  "disp"?: "keep";
  "reason"?: "breakpoint-hit" | "exited-normally" | "end-stepping-range" | "function-finished";
}

export interface ExecResultEvent {
  class: "stopped"; // TODO and probably other strings
  results: ExecResultEventResults;
}

let globalExecResultFunction: ((event: ExecResultEvent) => void) | null = null;

socket.on("exec-result", (ev: ExecResultEvent) => {
  if(globalExecResultFunction !== null) {
    globalExecResultFunction(ev);
  }
});

export async function onExecResultFunction(execResultFunction: (event: ExecResultEvent) => void) {
  globalExecResultFunction = execResultFunction;
}

export function debugStart(): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    socket.emit("debug", 
    {}, ({ success, ...other }) => {
      if(success) {
        resolve(other.results);
      } else {
        reject(other.error);
      }
    });
  });
}

export function debugContinue(): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    socket.emit("debugStart",
    {}, ({ success, ...other }) => {
      if(success) {
        resolve(other.results);
      } else {
        reject(other.error);
      }
    });
  })
}

export function debugNext(): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    socket.emit("debugNext",
    {}, ({ success, ...other }) => {
      if(success) {
        resolve(other.results);
      } else {
        reject(other.error);
      }
    });
  });
}

export function debugStep(reverse?: boolean): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    socket.emit("debugStep", {
      reverse: reverse
    }, ({ success, ...other }) => {
      if(success) {
        resolve(other.results);
      } else {
        reject(other.error);
      }
    });
  })
}

export function debugFinish(): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    socket.emit("debugFinish",
    {}, ({ success, ...other }) => {
      if(success) {
        resolve(other.results);
      } else {
        reject(other.error);
      }
    });
  })
}

export function getFiles(dir?: string) {
  return new Promise((resolve, reject) => {
    socket.emit("getFiles",
    {
      dir: dir
    }, ({ success, ...other }) => {
      if(success) {
        resolve(other.results);
      } else {
        reject(other.error);
      }
    });
  });
}

export function getFileContents(file: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    socket.emit("getFileContents",
    {
      file: file,
    }, ({ success, ...other }) => {
      if(success) {
        resolve(other.results);
      } else {
        reject(other.error);
      }
    });
  });
}

export function addBreakpoint(filename: string, lineNum: number): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    socket.emit("addBreakpoint",
    {
      fileName: filename,
      lineNumber: lineNum,
    }, ({ success, ...other }) => {
      if(success) {
        resolve();
      } else {
        reject(other.error);
      }
    });
  });
}

export function removeBreakpoint(bpNum: number): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    socket.emit("removeBreakpoint",
    {
      bpNum: bpNum,
    }, ({ success, ...other }) => {
      if(success) {
        resolve();
      } else {
        reject(other.error);
      }
    });
  });
}

export function getBreakpoints(): Promise<BreakpointListResponse> {
  return new Promise<BreakpointListResponse>((resolve, reject) => {
    socket.emit("getBreakpoints", {}, ({ success, ...other }) => {
      if(success) {
        const results = other.results;
        const table: BreakpointListResponse = {
          nr_rows: parseInt(results.BreakpointTable.nr_rows),
          nr_cols: parseInt(results.BreakpointTable.nr_cols),
          hdr: results.BreakpointTable.hdr.map(col => ({
            width: parseInt(col.width),
            alignment: parseInt(col.alignment),
            col_name: col.col_name,
            colhdr: col.colhdr
          })),
          body: results.BreakpointTable.body.map(br => ({
            bkpt: {
              number: parseInt(br.bkpt.number),
              type: br.bkpt.type,
              disp: br.bkpt.disp,
              enabled: br.bkpt.enabled === "y" ? true : false,
              addr: br.bkpt.addr,
              func: br.bkpt.func,
              file: br.bkpt.file,
              fullname: br.bkpt.fullname,
              line: parseInt(br.bkpt.line),
              "thread-groups": br.bkpt["thread-groups"],
              times: parseInt(br.bkpt.times),
              "original-location": br.bkpt["original-location"]
            }
          }))
        };
        resolve(table);
      } else {
        reject(other.error);
      }
    });
  });
}

export function getStackInfo(): Promise<StackFrameList> {
  return new Promise<StackFrameList>((resolve, reject) => socket.emit('getStackInfo',
    {}, ({ success, ...other }) => {
      if(success) {
        resolve(other.results.results.stack);
      } else {
        reject(other.error);
      }
    })
  );
}

export function addToWatch(expression: string): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    socket.emit('addToWatch', {
      expression,
    }, ({ success, ...other}) => {
      if(success) {
        console.log(other.results);
        resolve(other.results);
      } else {
        reject(other.error);
      }
    });
  })
}

export function removeFromWatch(name: string): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    socket.emit('removeFromWatch', {
      name,
    }, ({ success, ...other }) => {
      if(success) {
        console.log(other.results);
        resolve(other.results);
      } else {
        reject(other.error);
      }
    });
  });
}

export function watchUpdate(): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    socket.emit('watchUpdate', {}, ({ success, ...other }) => {
      if(success) {
        console.log(other.results);
        resolve(other.results);
      } else {
        reject(other.error);
      }
    });
  });
}

export function editItemOnWatch(name: string, expression: string): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    socket.emit('watchUpdate', {
      name,
      expression,
    }, ({ success, ...other }) => {
      if(success) {
        console.log(other.results);
        resolve(other.results);
      } else {
        reject(other.error);
      }
    });
  });
}
