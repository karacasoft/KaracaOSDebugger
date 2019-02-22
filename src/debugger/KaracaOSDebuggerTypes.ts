

export type SocketEventCallbackNormalResponse = {
  success: true,
  results: any,
}

export type SocketEventCallbackErrorResponse = {
  success: false,
  error: Error,
}

export type SocketEventCallbackResponse = SocketEventCallbackNormalResponse | SocketEventCallbackErrorResponse;

export interface SocketEventHandlerParams {
  
}

export interface DebugStepParams extends SocketEventHandlerParams {
  reverse?: boolean;
}

export interface AddBreakpointParams extends SocketEventHandlerParams {
  fileName: string;
  lineNumber: number;
}

export interface RemoveBreakpointParams extends SocketEventHandlerParams {
  bpNum: number;
}

export interface GetFilesParams extends SocketEventHandlerParams {
  dir?: string;
}

export interface GetFileContentsParams extends SocketEventHandlerParams {
  file: string;
}

export interface AddToWatchParams extends SocketEventHandlerParams {
  name?: string;
  expression: string;
}

export interface RemoveFromWatchParams extends SocketEventHandlerParams {
  name: string;
}

export interface EditItemOnWatchParams extends SocketEventHandlerParams {
  name: string;
  expression: string;
}

export interface GetRegisterValuesParams extends SocketEventHandlerParams {
  format: 'x' | 'o' | 't' | 'd' | 'r' | 'N';
  registers: number[];
}
