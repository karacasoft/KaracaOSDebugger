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
const client = require("socket.io-client");
exports.socket = client.connect('http://localhost:5000');
function getFiles(dir) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            exports.socket.emit("getFiles", dir, ({ success, files }) => {
                if (success) {
                    resolve(files);
                }
                else {
                    reject();
                }
            });
        });
    });
}
exports.getFiles = getFiles;
function getFileContents(file) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            exports.socket.emit("getFileContents", file, ({ success, fileContents }) => {
                if (success) {
                    resolve(fileContents);
                }
                else {
                    reject();
                }
            });
        });
    });
}
exports.getFileContents = getFileContents;
//# sourceMappingURL=debugService.js.map