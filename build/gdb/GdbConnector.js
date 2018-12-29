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
const child_process_1 = require("child_process");
const BufferUntilReadable_1 = require("./BufferUntilReadable");
const events_1 = require("events");
const Errors_1 = require("./Errors");
class GdbConnection extends events_1.EventEmitter {
    constructor(process) {
        super();
        this.consoleOutRegex = /~(.*)/;
        this.targetOutRegex = /@(.*)/;
        this.logOutRegex = /&(.*)/;
        this.execOutRegex = /(\d*)\*(stopped)(.*)/;
        this.statusOutRegex = /(\d*)\+(stopped)(.*)/;
        this.notifyOutRegex = /(\d*)=(stopped)(.*)/;
        this.resultOutRegex = /(\d*)\^(done|running|connected|error|exit)(.*)/;
        this.messageId = 0;
        this.awaitingRequests = [];
        this.process = process;
        this.stdout = new BufferUntilReadable_1.default(this.process.stdout, '\n');
        this.stderr = new BufferUntilReadable_1.default(this.process.stderr, '\n');
        this.stdout.on('data', text => {
            let result;
            if ((result = this.consoleOutRegex.exec(text)) !== null) {
                const r = { text: result[1] };
                this.emit('console', r);
            }
            else if ((result = this.targetOutRegex.exec(text)) !== null) {
                const r = { text: result[1] };
                this.emit('target', r);
            }
            else if ((result = this.logOutRegex.exec(text)) !== null) {
                const r = { text: result[1] };
                this.emit('log', r);
            }
            else if ((result = this.execOutRegex.exec(text)) !== null) {
                const r = {
                    token: parseInt(result[1]),
                    class: result[2],
                    results: result[3]
                };
                this.emit('exec-result', r);
            }
            else if ((result = this.statusOutRegex.exec(text)) !== null) {
                const r = {
                    token: parseInt(result[1]),
                    class: result[2],
                    results: result[3]
                };
                this.emit('status', r);
            }
            else if ((result = this.notifyOutRegex.exec(text)) !== null) {
                const r = {
                    token: parseInt(result[1]),
                    class: result[2],
                    results: result[3]
                };
                this.emit('notify', r);
            }
            else if ((result = this.resultOutRegex.exec(text)) !== null) {
                const r = {
                    token: parseInt(result[1]),
                    class: result[2],
                    results: result[3]
                };
                this.emit('result', r);
            }
            else {
                console.log("No Match");
                console.log(text);
            }
        });
        this.stderr.on('data', text => {
            console.log(`ERROR ${text}`);
        });
    }
    static start() {
        return new Promise((resolve) => {
            let childProcess;
            childProcess = child_process_1.exec('/usr/bin/gdb --interpreter=mi2');
            let conn = new GdbConnection(childProcess);
            resolve(conn);
        });
    }
    static target(host, port) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let childProcess;
            childProcess = child_process_1.exec('/usr/bin/gdb --interpreter=mi2');
            let conn = new GdbConnection(childProcess);
            try {
                const data = yield conn.target(host, port);
                if (data.class === 'connected') {
                    resolve(conn);
                }
                else {
                    reject(new Errors_1.ConnectionError(host, port));
                }
            }
            catch (err) {
                reject(err);
            }
        }));
    }
    kill() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.sendCommand(`-exec-abort`);
        });
    }
    loadSymbols(file) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.sendCommand(`-file-symbol-file ${file}`);
        });
    }
    addBreakpoint(funcOrFilename, line) {
        return __awaiter(this, void 0, void 0, function* () {
            if (line === undefined || line === null) {
                return this.sendCommand('-break-insert', funcOrFilename);
            }
            else {
                return this.sendCommand('-break-insert', `${funcOrFilename}:${line}`);
            }
        });
    }
    step(reverse) {
        return __awaiter(this, void 0, void 0, function* () {
            if (reverse) {
                return this.sendCommand('-exec-step', '--reverse');
            }
            else {
                return this.sendCommand('-exec-step');
            }
        });
    }
    continue() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.sendCommand('-exec-continue');
        });
    }
    target(host, port) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.sendCommand(`-target-select`, `remote`, `${host}:${port}`);
        });
    }
    sendCommand(command, ...args) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = ++this.messageId;
            return new Promise((resolve, reject) => {
                const request = {
                    token, receivedResult: false
                };
                this.awaitingRequests.push(request);
                const commandStr = `${token}${command} ${args.join(' ')}\n`;
                this.process.stdin.write(commandStr);
                const resultAwaiter = (res) => {
                    if (res.token === token) {
                        request.result = res;
                        this.removeListener('result', resultAwaiter);
                        if (res.class === 'error') {
                            reject(new Errors_1.CommandError(token, commandStr, res));
                        }
                        else {
                            resolve(res);
                        }
                    }
                };
                this.on('result', resultAwaiter);
            });
        });
    }
}
exports.default = GdbConnection;
//# sourceMappingURL=GdbConnector.js.map