import GdbConnection from "../gdb/GdbConnector";

import KaracaOSBuildManager from '../karacaos_builder/KaracaOSBuildManager';

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

    socket.on('build', async (callback) => {
      try {
        await kaosBuilder.buildAll();
        await kaosBuilder.generateIso();
        callback({ success: true });
      } catch(err) {
        console.error(err);
        callback({ success: false });
      }
    });

    socket.on('debug', async (callback) => {
      try {
        await kaosBuilder.debug();
        await gdbConnection.target('localhost', 1234);
        callback({ success: true });
      } catch(err) {
        console.error(err);
        callback({ success: false });
      }
    });

    socket.on('debugStart', async (callback) => {
      try {
        await gdbConnection.continue();
        callback({ success: true });
      } catch(err) {
        console.error(err);
        callback({ success: false });
      }
    });

    socket.on('debugNext', async (callback) => {
      try {
        await gdbConnection.next();
        callback({ success: true });
      } catch(err) {
        console.error(err);
        callback({ success: false });
      }
    });
    
    socket.on('debugStep', async (callback, reverse?: boolean) => {
      try {
        await gdbConnection.step(reverse);
        callback({ success: true });
      } catch(err) {
        console.error(err);
        callback({ success: false });
      }
    });

    socket.on('debugFinish', async (callback) => {
      try {
        await gdbConnection.finish();
        callback({ success: true });
      } catch(err) {
        console.error(err);
        callback({ success: false });
      }
    });

    socket.on('addBreakpoint', async (fileName, lineNumber, callback) => {
      try {
        await gdbConnection.addBreakpoint(fileName, lineNumber);
        callback({ success: true });
      } catch(err) {
        console.error(err);
        callback({ success: false });
      }
    });

    socket.on('removeBreakpoint', async (bpNum, callback) => {
      try {
        await gdbConnection.removeBreakpoint(bpNum);
        callback({ success: true });
      } catch(err) {
        console.error(err);
        callback({ success: false });
      }
    });

    socket.on('getBreakpoints', async (callback) => {
      try {
        const results = await gdbConnection.listBreakpoints();
        callback({ success: true, results });
      } catch(err) {
        console.error(err);
        callback({ success: false });
      }
    });

    socket.on('getStackInfo', async (callback) => {
      try {
        const results = await gdbConnection.stackListFrames();
        callback({ success: true, results });
      } catch(err) {
        console.error(err);
        callback({ success: false, error: err });
      }
    });

    socket.on('getFiles', async (dir, callback) => {
      try {
        const files = await kaosBuilder.getFiles(dir);
        callback({ success: true, files });
      } catch(err) {
        console.error(err);
        callback({ success: false });
      }
    });

    socket.on('getFileContents', async (file, callback) => {
      try {
        const fileContents = await kaosBuilder.getFileContents(file);
        callback({ success: true, fileContents });
      } catch(err) {
        console.error(err);
        callback({ success: false });
      }
    });


  }
};
