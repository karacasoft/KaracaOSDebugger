import { observable, runInAction, action } from "mobx";
import { getFileContents, getFiles } from "../Service/debugService";
import { join } from "path";
import { pathToFileURL } from "url";
import { FilledInput } from "@material-ui/core";

export interface DirTreeItem {
  index: number;
  name: string;
  title: string;
  depth: number;
  loaded: boolean;
  isDir: boolean;
  children?: number[];
  parentIndex?: number;
  disabled?: boolean;

  open: boolean;
  error: boolean;
  loading: boolean;
}

export interface FilesState {
  dirTree: DirTreeItem[];
  selectedFileName?: string;
  editorContents: string;
}

export const filesState = observable<FilesState>({
  dirTree: [{
    index: 0,
    name: '',
    title: "<root>",
    loaded: false,
    isDir: true,
    depth: 0,
    open: false,
    error: false,
    loading: false,
  }],
  editorContents: "Select a file from file explorer...",
});



function getFullPath(item: DirTreeItem, items: DirTreeItem[]): string {
  if(item.depth === 0) {
    return '';
  } else if(item.depth === 1) {
    return item.name;
  } else {
    if(item.parentIndex) return join(getFullPath(items[item.parentIndex], items), item.name);
    else                 return '';
  }
}

export const loadDirectory = async (itemIndex: number) => {
  const dirTree = filesState.dirTree;
  const item = dirTree[itemIndex];
  let itemCount = dirTree.length;
  const initialCount = itemCount;
  if(!item.loaded) {
    try {
      const dirDesc: any = await getFiles(getFullPath(item, dirTree));
      const newItems: DirTreeItem[] = [
        ...dirTree,
        ...dirDesc.files
          .filter((val: any) => (val.isDir && !val.name.match(/(^\.|^sysroot$)/)) || val.name.match(/\.(c|S|h)$/))
          .map((val: any): DirTreeItem => {
            return ({
              index: itemCount++,
              name: val.name,
              title: val.name,
              loaded: !val.isDir,
              isDir: val.isDir,
              depth: item.depth + 1,
              parentIndex: item.index,
              open: false,
              error: false,
              loading: false,
            });
          })
      ];

      runInAction(() => {
        item.open = true;
        item.loaded = true;
        let children: number[] = Array(itemCount - initialCount).fill(0).map((_, idx) => initialCount + idx);
        item.children = children;
        filesState.dirTree = newItems
      });
    } catch (err) {
      console.error(err);
    }
  }
};

export function loadFile(filename: string) {
  getFileContents(filename).then(res => {
    runInAction(() => {
      filesState.selectedFileName = filename;
      filesState.editorContents = res;
    });
  }).catch(err => {
    console.error(err);
    runInAction(() => {
      filesState.selectedFileName = undefined;
      filesState.editorContents = `Error while opening file: ${filename}
${err.stack}`;
    });
  });
}

export function loadFileByIndex(fileIndex: number) {
  const filename = getFullPath(filesState.dirTree[fileIndex], filesState.dirTree);
  loadFile(filename);
}


export const openDirectory = action((fileIndex: number) => {
  filesState.dirTree[fileIndex].open = true;
});

export const closeDirectory = action((fileIndex: number) => {
  filesState.dirTree[fileIndex].open = false;
});