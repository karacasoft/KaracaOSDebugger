export type StackFrame = {
  addr: string;
  file: string;
  fullname: string;
  func: string;
  level: string;
  line: string;
}

export type StackFrameList = { frame: StackFrame }[];

type APISuccesfulResponse = {
  success: true;
  results: any;
  error?: Error;
}

type APIErrorResponse = {
  success: false;
  results?: any;
  error: Error;
}

export type APIResponse = APISuccesfulResponse | APIErrorResponse;