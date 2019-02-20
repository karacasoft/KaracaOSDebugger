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
    socket.emit("debug", ({ success }) => {
      if(success) {
        resolve();
      } else {
        reject();
      }
    });
  });
}

export function debugContinue(): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    socket.emit("debugStart", ({ success }) => {
      if(success) {
        resolve();
      } else {
        reject();
      }
    });
  })
}

export function debugNext(): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    socket.emit("debugNext", ({ success }) => {
      if(success) {
        resolve();
      } else {
        reject();
      }
    })
  });
}

export function debugStep(reverse?: boolean): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    socket.emit("debugStep", ({ success }) => {
      if(success) {
        resolve();
      } else {
        reject();
      }
    }, reverse);
  })
}

export function debugFinish(): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    socket.emit("debugFinish", ({ success }) => {
      if(success) {
        resolve();
      } else {
        reject();
      }
    });
  })
}

export function getFiles(dir?: string) {
  return new Promise((resolve, reject) => {
    socket.emit("getFiles", dir, ({ success, files }) => {
      if(success) {
        resolve(files);
      } else {
        reject();
      }
    })
  });
}

export function getFileContents(file: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    socket.emit("getFileContents", file, ({ success, fileContents }) => {
      if(success) {
        resolve(fileContents);
      } else {
        reject();
      }
    })
  });
}

export function addBreakpoint(filename: string, lineNum: number): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    socket.emit("addBreakpoint", filename, lineNum, ({ success }) => {
      if(success) {
        resolve();
      } else {
        reject();
      }
    })
  });
}

export function removeBreakpoint(bpNum: number): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    socket.emit("removeBreakpoint", bpNum, ({ success }) => {
      if(success) {
        resolve();
      } else {
        reject();
      }
    });
  });
}

export function getBreakpoints(): Promise<BreakpointListResponse> {
  return new Promise<BreakpointListResponse>((resolve, reject) => {
    socket.emit("getBreakpoints", ({ success, results }) => {
      if(success) {
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
        reject();
      }
    });
  });
}

export function getStackInfo(): Promise<StackFrameList> {
  return new Promise<StackFrameList>((resolve, reject) => socket.emit('getStackInfo', ({ success, ...other }) => {
    if(success) {
      resolve(other.results.results.stack);
    } else {
      reject(other.error);
    }
  }));
}
