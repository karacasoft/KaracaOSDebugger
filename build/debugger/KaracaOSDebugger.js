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
const BASE_DIR = "/home/karacasoft/KaracaOS";
function serveOnSocketIo() {
    return (socket) => __awaiter(this, void 0, void 0, function* () {
        const kaosBuilder = new KaracaOSBuildManager_1.default({
            baseDir: "/home/karacasoft/KaracaOS"
        });
        const gdbConnection = yield GdbConnector_1.default.start();
        yield gdbConnection.loadSymbols(`${BASE_DIR}/kernel/karacaos.kernel`);
        socket.on('build', (callback) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield kaosBuilder.buildAll();
                yield kaosBuilder.generateIso();
                callback({ success: true });
            }
            catch (err) {
                console.error(err);
                callback({ success: false });
            }
        }));
        socket.on('debug', (callback) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield kaosBuilder.debug();
                yield gdbConnection.target('localhost', 1234);
                callback({ success: true });
            }
            catch (err) {
                console.error(err);
                callback({ success: false });
            }
        }));
        socket.on('debugStart', (callback) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield gdbConnection.continue();
                callback({ success: true });
            }
            catch (err) {
                console.error(err);
                callback({ success: false });
            }
        }));
        socket.on('addBreakpoint', (fileName, lineNumber, callback) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield gdbConnection.addBreakpoint(fileName, lineNumber);
                callback({ success: true });
            }
            catch (err) {
                console.error(err);
                callback({ success: false });
            }
        }));
        socket.on('getFiles', (dir, callback) => __awaiter(this, void 0, void 0, function* () {
            try {
                const files = yield kaosBuilder.getFiles(dir);
                callback({ success: true, files });
            }
            catch (err) {
                console.error(err);
                callback({ success: false });
            }
        }));
        socket.on('getFileContents', (file, callback) => __awaiter(this, void 0, void 0, function* () {
            try {
                const fileContents = yield kaosBuilder.getFileContents(file);
                callback({ success: true, fileContents });
            }
            catch (err) {
                console.error(err);
                callback({ success: false });
            }
        }));
    });
}
exports.serveOnSocketIo = serveOnSocketIo;
;
//# sourceMappingURL=KaracaOSDebugger.js.map