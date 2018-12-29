"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CommandTimeoutError extends Error {
    constructor(token, cmd) {
        super("Command timed out");
        this.token = token;
        this.command = cmd;
    }
}
exports.CommandTimeoutError = CommandTimeoutError;
class CommandError extends Error {
    constructor(token, cmd, cmdResult) {
        super();
        this.token = token;
        this.command = cmd;
        this.result = cmdResult;
    }
}
exports.CommandError = CommandError;
class ConnectionError extends Error {
    constructor(host, port) {
        super(`Failed connection to: ${host}:${port}`);
        this.host = host;
        this.port = port;
    }
}
exports.ConnectionError = ConnectionError;
//# sourceMappingURL=Errors.js.map