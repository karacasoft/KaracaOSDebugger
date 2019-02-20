export type StackFrame = {
  addr: string;
  file: string;
  fullname: string;
  func: string;
  level: string;
  line: string;
}

export type StackFrameList = { frame: StackFrame }[];
