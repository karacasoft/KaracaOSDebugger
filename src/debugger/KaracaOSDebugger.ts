import GdbConnection from "../gdb/GdbConnector";

import KaracaOSBuildManager from '../karacaos_builder/KaracaOSBuildManager';
import { AddToWatchParams, SocketEventHandlerParams, DebugStepParams, AddBreakpointParams, RemoveBreakpointParams, GetFilesParams, GetFileContentsParams, SocketEventCallbackResponse, RemoveFromWatchParams, EditItemOnWatchParams, GetRegisterValuesParams } from "./KaracaOSDebuggerTypes";

const BASE_DIR = "/home/karacasoft/Documents/KaracaOS";

const kaosBuilder: KaracaOSBuildManager = new KaracaOSBuildManager({
  baseDir: BASE_DIR
});
let gdbConnection: GdbConnection = null;

export function serveOnSocketIo() {
  return async (socket) => {
    if(gdbConnection === null) {
      gdbConnection = await GdbConnection.start();
    }

    await gdbConnection.loadSymbols(`${BASE_DIR}/kernel/karacaos.kernel`);

    gdbConnection.on("exec-result", ev => {
      socket.emit('exec-result', ev);
      console.log("exec-result");
      console.log(ev);
    });

    gdbConnection.on("status", ev => {
      console.log("status");
      console.log(ev);
    });

    gdbConnection.on("notify", ev => {
      console.log("notify");
      console.log(ev);
    });
    
    gdbConnection.on("console", ev => {
      console.log("console");
      console.log(ev);
    });
    
    gdbConnection.on("target", ev => {
      console.log("target");
      console.log(ev);
    });
    
    gdbConnection.on("log", ev => {
      console.log("log");
      console.log(ev);
    });

    function errorHandledOnEvent<T extends SocketEventHandlerParams>(event: string, handler: (params: T) => any) {
      socket.on(event, async (params: T, callback: (resp: SocketEventCallbackResponse) => void) => {
        try {
          const results = await handler(params);
          callback({ success: true, results: results });
        } catch(err) {
          console.error(err);
          callback({ success: false, error: err });
        }
      })
    }

    errorHandledOnEvent('build', async () => {
      await kaosBuilder.buildAll();
      await kaosBuilder.generateIso();
    });
    
    errorHandledOnEvent('debug', async () => {
      await kaosBuilder.debug();
      await gdbConnection.target('localhost', 1234);
    });

    errorHandledOnEvent('debugStart', async () => {
      await gdbConnection.continue();
    });
    
    errorHandledOnEvent('debugNext', async () => {
      await gdbConnection.next();
    });
    
    errorHandledOnEvent('debugStep', async (params: DebugStepParams) => {
      await gdbConnection.step(params.reverse);
    });
    
    errorHandledOnEvent('debugFinish', async () => {
      await gdbConnection.finish();
    });
    
    errorHandledOnEvent('addBreakpoint', async (params: AddBreakpointParams) => {
      await gdbConnection.addBreakpoint(params.fileName, params.lineNumber);
    });
    
    errorHandledOnEvent('removeBreakpoint', async (params: RemoveBreakpointParams) => {
      await gdbConnection.removeBreakpoint(params.bpNum);
    });

    errorHandledOnEvent('getBreakpoints', async () => {
      return await gdbConnection.listBreakpoints();
    });

    errorHandledOnEvent('getStackInfo', async () => {
      return await gdbConnection.stackListFrames();
    });
    
    errorHandledOnEvent('addToWatch', async (params: AddToWatchParams) => {
      return await gdbConnection.varCreate(params.expression, params.name, '@');
    });
    
    errorHandledOnEvent('removeFromWatch', async (params: RemoveFromWatchParams) => {
      return await gdbConnection.varDelete(params.name);
    });

    errorHandledOnEvent('watchUpdate', async () => {
      return await gdbConnection.varUpdate(false);
    });

    errorHandledOnEvent('editItemOnWatch', async (params: EditItemOnWatchParams) => {
      return await gdbConnection.varAssign(params.name, params.expression);
    });

    errorHandledOnEvent('getRegisterValues', async (params: GetRegisterValuesParams) => {
      const results = await gdbConnection.dataListRegisterValues(true, params.format, ...params.registers);
      return results;
    });

    errorHandledOnEvent('getRegisterNames', async () => {
      return await gdbConnection.dataListRegisterNames();
    })

    errorHandledOnEvent('getFiles', async (params: GetFilesParams) => {
      return await kaosBuilder.getFiles(params.dir);
    });

    errorHandledOnEvent('getFileContents', async (params: GetFileContentsParams) => {
      return await kaosBuilder.getFileContents(params.file);
    });
  }
};
