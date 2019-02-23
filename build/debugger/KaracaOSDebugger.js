"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const GdbConnector_1 = require("../gdb/GdbConnector");
const KaracaOSBuildManager_1 = require("../karacaos_builder/KaracaOSBuildManager");
const BASE_DIR = "/home/karacasoft/Documents/KaracaOS";
const kaosBuilder = new KaracaOSBuildManager_1.default({
    baseDir: BASE_DIR
});
let gdbConnection = null;
function serveOnSocketIo() {
    return (socket) => __awaiter(this, void 0, void 0, function* () {
        if (gdbConnection === null) {
            gdbConnection = yield GdbConnector_1.default.start();
        }
        yield gdbConnection.loadSymbols(`${BASE_DIR}/kernel/karacaos.kernel`);
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
        function errorHandledOnEvent(event, handler) {
            socket.on(event, (params, callback) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const results = yield handler(params);
                    callback({ success: true, results: results });
                }
                catch (err) {
                    console.error(err);
                    callback({ success: false, error: err });
                }
            }));
        }
        errorHandledOnEvent('build', () => __awaiter(this, void 0, void 0, function* () {
            yield kaosBuilder.buildAll();
            yield kaosBuilder.generateIso();
        }));
        errorHandledOnEvent('debug', () => __awaiter(this, void 0, void 0, function* () {
            yield kaosBuilder.debug();
            yield gdbConnection.target('localhost', 1234);
        }));
        errorHandledOnEvent('debugStart', () => __awaiter(this, void 0, void 0, function* () {
            yield gdbConnection.continue();
        }));
        errorHandledOnEvent('debugNext', () => __awaiter(this, void 0, void 0, function* () {
            yield gdbConnection.next();
        }));
        errorHandledOnEvent('debugStep', (params) => __awaiter(this, void 0, void 0, function* () {
            yield gdbConnection.step(params.reverse);
        }));
        errorHandledOnEvent('debugFinish', () => __awaiter(this, void 0, void 0, function* () {
            yield gdbConnection.finish();
        }));
        errorHandledOnEvent('addBreakpoint', (params) => __awaiter(this, void 0, void 0, function* () {
            yield gdbConnection.addBreakpoint(params.fileName, params.lineNumber);
        }));
        errorHandledOnEvent('removeBreakpoint', (params) => __awaiter(this, void 0, void 0, function* () {
            yield gdbConnection.removeBreakpoint(params.bpNum);
        }));
        errorHandledOnEvent('getBreakpoints', () => __awaiter(this, void 0, void 0, function* () {
            return yield gdbConnection.listBreakpoints();
        }));
        errorHandledOnEvent('getStackInfo', () => __awaiter(this, void 0, void 0, function* () {
            return yield gdbConnection.stackListFrames();
        }));
        errorHandledOnEvent('addToWatch', (params) => __awaiter(this, void 0, void 0, function* () {
            return yield gdbConnection.varCreate(params.expression, params.name, '@');
        }));
        errorHandledOnEvent('removeFromWatch', (params) => __awaiter(this, void 0, void 0, function* () {
            return yield gdbConnection.varDelete(params.name);
        }));
        errorHandledOnEvent('watchUpdate', () => __awaiter(this, void 0, void 0, function* () {
            return yield gdbConnection.varUpdate(false);
        }));
        errorHandledOnEvent('editItemOnWatch', (params) => __awaiter(this, void 0, void 0, function* () {
            return yield gdbConnection.varAssign(params.name, params.expression);
        }));
        errorHandledOnEvent('getRegisterValues', (params) => __awaiter(this, void 0, void 0, function* () {
            const results = yield gdbConnection.dataListRegisterValues(true, params.format, ...params.registers);
            return results;
        }));
        errorHandledOnEvent('getRegisterNames', () => __awaiter(this, void 0, void 0, function* () {
            return yield gdbConnection.dataListRegisterNames();
        }));
        errorHandledOnEvent('getFiles', (params) => __awaiter(this, void 0, void 0, function* () {
            return yield kaosBuilder.getFiles(params.dir);
        }));
        errorHandledOnEvent('getFileContents', (params) => __awaiter(this, void 0, void 0, function* () {
            return yield kaosBuilder.getFileContents(params.file);
        }));
    });
}
exports.serveOnSocketIo = serveOnSocketIo;
;
//# sourceMappingURL=KaracaOSDebugger.js.map