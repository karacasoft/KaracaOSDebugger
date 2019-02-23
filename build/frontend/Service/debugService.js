"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const client = require("socket.io-client");
exports.socket = client.connect('http://localhost:5000');
let globalExecResultFunction = null;
exports.socket.on("exec-result", (ev) => {
    if (globalExecResultFunction !== null) {
        globalExecResultFunction(ev);
    }
});
function onExecResultFunction(execResultFunction) {
    return __awaiter(this, void 0, void 0, function* () {
        globalExecResultFunction = execResultFunction;
    });
}
exports.onExecResultFunction = onExecResultFunction;
function debugStart() {
    return new Promise((resolve, reject) => {
        exports.socket.emit("debug", {}, (_a) => {
            var { success } = _a, other = __rest(_a, ["success"]);
            if (success) {
                resolve(other.results);
            }
            else {
                reject(other.error);
            }
        });
    });
}
exports.debugStart = debugStart;
function debugContinue() {
    return new Promise((resolve, reject) => {
        exports.socket.emit("debugStart", {}, (_a) => {
            var { success } = _a, other = __rest(_a, ["success"]);
            if (success) {
                resolve(other.results);
            }
            else {
                reject(other.error);
            }
        });
    });
}
exports.debugContinue = debugContinue;
function debugNext() {
    return new Promise((resolve, reject) => {
        exports.socket.emit("debugNext", {}, (_a) => {
            var { success } = _a, other = __rest(_a, ["success"]);
            if (success) {
                resolve(other.results);
            }
            else {
                reject(other.error);
            }
        });
    });
}
exports.debugNext = debugNext;
function debugStep(reverse) {
    return new Promise((resolve, reject) => {
        exports.socket.emit("debugStep", {
            reverse: reverse
        }, (_a) => {
            var { success } = _a, other = __rest(_a, ["success"]);
            if (success) {
                resolve(other.results);
            }
            else {
                reject(other.error);
            }
        });
    });
}
exports.debugStep = debugStep;
function debugFinish() {
    return new Promise((resolve, reject) => {
        exports.socket.emit("debugFinish", {}, (_a) => {
            var { success } = _a, other = __rest(_a, ["success"]);
            if (success) {
                resolve(other.results);
            }
            else {
                reject(other.error);
            }
        });
    });
}
exports.debugFinish = debugFinish;
function getFiles(dir) {
    return new Promise((resolve, reject) => {
        exports.socket.emit("getFiles", {
            dir: dir
        }, (_a) => {
            var { success } = _a, other = __rest(_a, ["success"]);
            if (success) {
                resolve(other.results);
            }
            else {
                reject(other.error);
            }
        });
    });
}
exports.getFiles = getFiles;
function getFileContents(file) {
    return new Promise((resolve, reject) => {
        exports.socket.emit("getFileContents", {
            file: file,
        }, (_a) => {
            var { success } = _a, other = __rest(_a, ["success"]);
            if (success) {
                resolve(other.results);
            }
            else {
                reject(other.error);
            }
        });
    });
}
exports.getFileContents = getFileContents;
function addBreakpoint(filename, lineNum) {
    return new Promise((resolve, reject) => {
        exports.socket.emit("addBreakpoint", {
            fileName: filename,
            lineNumber: lineNum,
        }, (_a) => {
            var { success } = _a, other = __rest(_a, ["success"]);
            if (success) {
                resolve();
            }
            else {
                reject(other.error);
            }
        });
    });
}
exports.addBreakpoint = addBreakpoint;
function removeBreakpoint(bpNum) {
    return new Promise((resolve, reject) => {
        exports.socket.emit("removeBreakpoint", {
            bpNum: bpNum,
        }, (_a) => {
            var { success } = _a, other = __rest(_a, ["success"]);
            if (success) {
                resolve();
            }
            else {
                reject(other.error);
            }
        });
    });
}
exports.removeBreakpoint = removeBreakpoint;
function getBreakpoints() {
    return new Promise((resolve, reject) => {
        exports.socket.emit("getBreakpoints", {}, (_a) => {
            var { success } = _a, other = __rest(_a, ["success"]);
            if (success) {
                const results = other.results;
                const table = {
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
            }
            else {
                reject(other.error);
            }
        });
    });
}
exports.getBreakpoints = getBreakpoints;
function getStackInfo() {
    return new Promise((resolve, reject) => exports.socket.emit('getStackInfo', {}, (_a) => {
        var { success } = _a, other = __rest(_a, ["success"]);
        if (success) {
            resolve(other.results.results.stack);
        }
        else {
            reject(other.error);
        }
    }));
}
exports.getStackInfo = getStackInfo;
function addToWatch(expression) {
    return new Promise((resolve, reject) => {
        exports.socket.emit('addToWatch', {
            expression,
        }, (_a) => {
            var { success } = _a, other = __rest(_a, ["success"]);
            if (success) {
                resolve(other.results);
            }
            else {
                reject(other.error);
            }
        });
    });
}
exports.addToWatch = addToWatch;
function removeFromWatch(name) {
    return new Promise((resolve, reject) => {
        exports.socket.emit('removeFromWatch', {
            name,
        }, (_a) => {
            var { success } = _a, other = __rest(_a, ["success"]);
            if (success) {
                resolve(other.results);
            }
            else {
                reject(other.error);
            }
        });
    });
}
exports.removeFromWatch = removeFromWatch;
function watchUpdate() {
    return new Promise((resolve, reject) => {
        exports.socket.emit('watchUpdate', {}, (_a) => {
            var { success } = _a, other = __rest(_a, ["success"]);
            if (success) {
                resolve(other.results);
            }
            else {
                reject(other.error);
            }
        });
    });
}
exports.watchUpdate = watchUpdate;
function editItemOnWatch(name, expression) {
    return new Promise((resolve, reject) => {
        exports.socket.emit('watchUpdate', {
            name,
            expression,
        }, (_a) => {
            var { success } = _a, other = __rest(_a, ["success"]);
            if (success) {
                resolve(other.results);
            }
            else {
                reject(other.error);
            }
        });
    });
}
exports.editItemOnWatch = editItemOnWatch;
function getRegisterValues() {
    return new Promise((resolve, reject) => {
        exports.socket.emit('getRegisterValues', {
            format: 'x',
            registers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
        }, (_a) => {
            var { success } = _a, other = __rest(_a, ["success"]);
            if (success) {
                console.log(other.results);
                resolve(other.results);
            }
            else {
                reject(other.error);
            }
        });
    });
}
exports.getRegisterValues = getRegisterValues;
function getRegisterNames() {
    return new Promise((resolve, reject) => {
        exports.socket.emit('getRegisterNames', {}, (_a) => {
            var { success } = _a, other = __rest(_a, ["success"]);
            if (success) {
                resolve(other.results);
            }
            else {
                reject(other.error);
            }
        });
    });
}
exports.getRegisterNames = getRegisterNames;
//# sourceMappingURL=debugService.js.map