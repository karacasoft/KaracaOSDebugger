import { exec } from 'child_process';
import { readdir, statSync, readFile } from 'fs';

interface BuildManagerParams {
  baseDir: string
};

interface FileDesc {
  name: string;
  isDir: boolean;
}

interface DirectoryDesc {
  name: string;
  files?: (FileDesc)[];
}

class KaracaOSBuildManager {
  baseDir: string;

  constructor(params: BuildManagerParams) {
    this.baseDir = params.baseDir;
  }

  buildAll(): Promise<void> {
    return new Promise((resolve, reject) => {
      exec(`${this.baseDir}/build.sh all`, { cwd: this.baseDir }, (err) => {
        if(err) reject();
        else resolve();
      });
    });
  }

  generateIso(): Promise<void> {
    return new Promise((resolve, reject) => {
      exec(`${this.baseDir}/iso.sh`, { cwd: this.baseDir }, (err) => {
        if(err) reject();
        else resolve();
      });
    });
  }

  debug(): Promise<void> {
    return new Promise((resolve, reject) => {
      exec(`${this.baseDir}/qemu.sh`, { cwd: this.baseDir }, (err) => {
        if(err) reject(err);
        else resolve();
      });
    });
  }

  getFiles(dir?: string): Promise<DirectoryDesc> {
    return new Promise((resolve, reject) => {
      readdir(`${this.baseDir}/${dir}`, (err, files) => {
        if(err) {
          reject(err);
        } else {
          const dirList: DirectoryDesc = {
            name: dir ? dir : 'root',
            files: files.map(val => {
              const stat = statSync(`${this.baseDir}/${dir}/${val}`)
              if(stat.isDirectory()) {
                return {
                  name: val,
                  isDir: true
                };
              } else {
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

  getFileContents(file: string): Promise<string> {
    return new Promise((resolve, reject) => {
      readFile(`${this.baseDir}/${file}`, 'utf8', (err, data) => {
        if(err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }
}

export default KaracaOSBuildManager;
