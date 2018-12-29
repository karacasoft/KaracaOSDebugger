"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket = require("socket.io");
const KaracaOSDebugger_1 = require("./debugger/KaracaOSDebugger");
const io = socket(5000);
io.on('connection', KaracaOSDebugger_1.serveOnSocketIo());
//# sourceMappingURL=index.js.map