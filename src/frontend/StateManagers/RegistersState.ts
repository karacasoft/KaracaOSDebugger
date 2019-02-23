import { observable, action, runInAction } from "mobx";
import * as DebugService from "../Service/debugService";

export type RegisterValueState = {
  number: string;
  value: string;
}

export interface RegistersState {
  registerNames?: string[];
  registerValues?: RegisterValueState[];
}

export const registersState = observable<RegistersState>({});

export function updateRegisterNames() {
  DebugService.getRegisterNames().then(res => {
    runInAction(() => registersState.registerNames = res.results['register-names']);
  }).catch(console.error);
}

export function updateRegisterValues() {
  DebugService.getRegisterValues().then(res => {
    runInAction(() => registersState.registerValues = res.results['register-values']);
  }).catch(console.error);
}