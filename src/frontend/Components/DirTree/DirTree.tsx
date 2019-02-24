import * as React from 'react';
import CollapsableListItem from './CollapsableListItem';
import { withStyles, createStyles, Theme } from '@material-ui/core/styles';
import * as FilesStateManager from '../../StateManagers/FilesState';

const styles = (theme: Theme) => createStyles({
  dirTree: {
  }
});

interface Props {
  classes: any;
  filesState: FilesStateManager.FilesState;
}

class DirTree extends React.Component<Props> {

  constructor(props: Props) {
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

  handleLoad(itemIndex: number) {
    const item = this.props.filesState.dirTree[itemIndex];
    if(item.isDir) {
      FilesStateManager.loadDirectory(itemIndex);
    } else {
      FilesStateManager.loadFileByIndex(itemIndex);
    }
  }

  render() {
    return (<div className={this.props.classes.dirTree}>
      <CollapsableListItem
        filesState={this.props.filesState}
        rootItem={this.props.filesState.dirTree[0]}
        onLoad={this.handleLoad}/>
    </div>);
  }
}

export default withStyles(styles)(DirTree);
