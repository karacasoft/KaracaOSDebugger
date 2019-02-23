"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const fs_1 = require("fs");
;
class KaracaOSBuildManager {
    constructor(params) {
        this.baseDir = params.baseDir;
    }
    buildAll() {
        return new Promise((resolve, reject) => {
            child_process_1.exec(`${this.baseDir}/build.sh all`, { cwd: this.baseDir }, (err) => {
                if (err)
                    reject();
                else
                    resolve();
            });
        });
    }
    generateIso() {
        return new Promise((resolve, reject) => {
            child_process_1.exec(`${this.baseDir}/iso.sh`, { cwd: this.baseDir }, (err) => {
                if (err)
                    reject();
                else
                    resolve();
            });
        });
    }
    debug() {
        return new Promise((resolve, reject) => {
            child_process_1.exec(`${this.baseDir}/qemu.sh`, { cwd: this.baseDir }, (err) => {
                if (err)
                    reject(err);
                else
                    resolve();
            });
        });
    }
    getFiles(dir) {
        return new Promise((resolve, reject) => {
            fs_1.readdir(`${this.baseDir}/${dir}`, (err, files) => {
                if (err) {
                    reject(err);
                }
                else {
                    const dirList = {
                        name: dir ? dir : 'root',
                        files: files.map(val => {
                            const stat = fs_1.statSync(`${this.baseDir}/${dir}/${val}`);
                            if (stat.isDirectory()) {
                                return {
                                    name: val,
                                    isDir: true
                                };
                            }
                            else {
                                return {
                                    name: val,
                                    isDir: false
                                };
                            }
                        })
                    };
                    resolve(dirList);
                }
            });
        });
    }
    getFileContents(file) {
        return new Promise((resolve, reject) => {
            fs_1.readFile(`${this.baseDir}/${file}`, 'utf8', (err, data) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(data);
                }
            });
        });
    }
}
exports.default = KaracaOSBuildManager;
//# sourceMappingURL=KaracaOSBuildManager.js.map