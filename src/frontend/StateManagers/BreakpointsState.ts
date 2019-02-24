import { observable, action, runInAction } from "mobx";
import * as DebugService from "../Service/debugService";

export interface Breakpoint {
  num: number;
  type: string;
  disp: string;
  enabled: boolean;
  addr: string;
  file: string;
  lineNum: number;
  deleted?: boolean;
}

export interface BreakpointsState {
  list: Breakpoint[];
  refreshing: boolean;
}

export const breakpointsState = observable<BreakpointsState>({
  list: [],
  refreshing: false,
});

export const refreshBreakpoints = action(() => {
  breakpointsState.refreshing = true;
  DebugService.getBreakpoints().then(res => {
    runInAction(() => {
      breakpointsState.list = res.body.map((br): Breakpoint => ({
        num: br.bkpt.number,
        type: br.bkpt.type,
        enabled: br.bkpt.enabled,
        disp: br.bkpt.disp,
        addr: br.bkpt.addr,
        file: br.bkpt.file,
        lineNum: br.bkpt.line
      }));
      breakpointsState.refreshing = false;
    });
  }).catch(err => {
    console.error(err);
    runInAction(() => breakpointsState.refreshing = false);
  });
});

export const addBreakpoint = action((filename: string, lineNum: number) => {
  breakpointsState.refreshing = true;
  DebugService.addBreakpoint(filename, lineNum).then(_ => {
    refreshBreakpoints();
  }).catch(err => {
    console.error(err);
    runInAction(() => breakpointsState.refreshing = false);
  });
});

export const removeBreakpoint = action((bpNum: number) => {
  breakpointsState.refreshing = true;
  DebugService.removeBreakpoint(bpNum).then(_ => {
    refreshBreakpoints();
  }).catch(err => {
    console.error(err);
    runInAction(() => breakpointsState.refreshing = false);
  });
});