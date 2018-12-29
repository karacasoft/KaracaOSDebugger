import * as React from 'react';
import CollapsableListItem from './CollapsableListItem';
import { withStyles } from '@material-ui/core/styles';
import { getFiles } from '../../Service/debugService';

const styles = theme => ({
  dirTree: {
  }
});

export interface TreeItem {
  index: number;
  name: string;
  title: string;
  depth: number;
  loaded: boolean;
  isDir: boolean;
  children?: number[];
  parentIndex?: number;
  disabled?: boolean;
}

interface Props {
  classes: any;
  onLoadFile: (filename: string) => void;
}

interface State {
  treeItems: TreeItem[];
}

const getFullPath = (item: TreeItem, items: TreeItem[]) => {
  if(item.depth === 0) {
    return '';
  } else if(item.depth === 1) {
    return item.name;
  } else {
    return `${getFullPath(items[item.parentIndex], items)}/${item.name}`;
  }
}

class DirTree extends React.Component<Props, State> {

  constructor(props) {
    super(props);
    this.state = {
      treeItems: [{
        index: 0,
        name: '',
        title: "<root>",
        loaded: false,
        isDir: true,
        depth: 0
      }]
    }
    this.handleLoad = this.handleLoad.bind(this);
  }

  async handleDirLoad(itemIndex: number): Promise<boolean> {

    const item = this.state.treeItems[itemIndex];
    let itemCount = this.state.treeItems.length;
    const initialCount = itemCount;
    if(!item.loaded) {
      try {
        const dirDesc: any = await getFiles(getFullPath(item, this.state.treeItems));
        const newItems: TreeItem[] = [
          ...this.state.treeItems,
          ...dirDesc.files
            .filter(val => (val.isDir && !val.name.match(/(^\.|^sysroot$)/)) || val.name.match(/\.(c|S|h)$/))
            .map((val): TreeItem => {
              return ({
                index: itemCount++,
                name: val.name,
                title: val.name,
                loaded: !val.isDir,
                isDir: val.isDir,
                depth: item.depth + 1,
                parentIndex: item.index
              });
            })
        ];

        item.loaded = true;
        let children: number[] = Array(itemCount - initialCount).fill(0).map((_, idx) => initialCount + idx);
        item.children = children;
        this.setState({
          treeItems: newItems
        });

        return true;
      } catch (err) {
        console.error(err);
        return false;
      }

    }
    return true;
  }

  async handleLoad(itemIndex: number): Promise<boolean> {
    const item = this.state.treeItems[itemIndex];
    if(item.isDir) {
      return this.handleDirLoad(itemIndex);
    } else {
      this.props.onLoadFile(getFullPath(item, this.state.treeItems))
    }
  }

  render() {
    return (<div className={this.props.classes.dirTree}>
      <CollapsableListItem
        items={this.state.treeItems}
        rootItem={this.state.treeItems[0]}
        children={this.state.treeItems[0].children}
        onLoad={this.handleLoad}/>
    </div>);
  }
}

export default withStyles(styles)(DirTree);
