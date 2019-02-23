import { observable, runInAction } from "mobx";
import { addToWatch, removeFromWatch, editItemOnWatch, watchUpdate } from "../Service/debugService";

export interface WatchItemDef {
  has_more?: string;
  name?: string;
  expression: string;
  value: string;
  type?: string;
}

export interface WatchState {
  watchItems: WatchItemDef[],
  newWatchItem: WatchItemDef,
}

export const watchState = observable<WatchState>({
  watchItems: [],
  newWatchItem: {
    expression: "",
    value: "",
  },
});

export function addWatchItem(expr: string) {
  addToWatch(expr).then(res => {
    runInAction(() => {
      watchState.watchItems.push({
        ...res.results,
          expression: expr,
      });
      watchState.newWatchItem = {
        expression: "",
        value: "",
      };
    });
  }).catch(console.error);
}

export function editWatchItem(i: number, expr: string) {
  if(expr === "") {
    removeFromWatch(watchState.watchItems[i].name).then(res => {
      runInAction(() => watchState.watchItems = watchState.watchItems.filter((_, idx) => idx !== i));
    }).catch(console.error);
  } else {
    removeFromWatch(watchState.watchItems[i].name).then(res => {
      addToWatch(expr).then(res => {
        console.log(res);
        runInAction(() => watchState.watchItems = watchState.watchItems.map((item, idx) => ({
          ...item,
          ...res.results,
          expression: (idx === i) ? expr : item.expression,
        })));
      })
    });
  }
}

export function updateValues() {
  watchUpdate().then(res => {
    const changeList = res.results.changelist;
    let lastList = [ ...watchState.watchItems ];
    changeList.forEach(change => {
      if(lastList.find(el => el.name === change.name)) {
        lastList = lastList.map(val => {
          if(change.name === val.name) {
            return {
              ...val,
              ...change,
            }
          } else return val;
        });
      } else {
        removeFromWatch(change.name);
      }
    });
    runInAction(() => watchState.watchItems = lastList);
  }).catch(console.error);
}