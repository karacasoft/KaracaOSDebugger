import * as React from 'react';

import Collapse from '@material-ui/core/Collapse';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import CircularProgress from '@material-ui/core/CircularProgress';
import * as FilesStateManager from '../../StateManagers/FilesState';
import { observer } from 'mobx-react';

interface Props {
  filesState: FilesStateManager.FilesState;
  rootItem: FilesStateManager.DirTreeItem;
  onLoad: (index: number) => void;
}

@observer class CollapsableListItem extends React.Component<Props> {

  constructor(props: Props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const dirTree = this.props.filesState.dirTree;
    const rootItem = this.props.rootItem;
    if(dirTree[rootItem.index].loading) {
      return;
    }
    if(!dirTree[rootItem.index].loaded) {
      this.props.onLoad(rootItem.index);
      FilesStateManager.openDirectory(rootItem.index);
      return;
    }
    if(dirTree[rootItem.index].open) {
      FilesStateManager.closeDirectory(rootItem.index);
    } else {
      FilesStateManager.openDirectory(rootItem.index);
    }
  }

  render() {
    const { rootItem, filesState } = this.props;
    return ([
        <ListItem key="collapseItem" button onClick={this.handleClick} style={{paddingLeft: (this.props.rootItem.depth - 1) * 8}}>
          <ListItemText inset primary={this.props.rootItem.title} />
          {rootItem.open ? <ExpandLess color="action" /> : <ExpandMore color="action" />}
        </ListItem>,
        <Collapse key="collapse" in={rootItem.open}>
          <List component="div">
            {rootItem.children ?
              rootItem.children
              .map(cIndex => filesState.dirTree[cIndex])
              .map(val => {
                if(val.isDir)
                  return (<CollapsableListItem
                    key={val.index}
                    filesState={filesState}
                    rootItem={val}
                    onLoad={this.props.onLoad}
                  />);
                else
                  return (<ListItem button key={val.index}
                    style={{paddingLeft: this.props.rootItem.depth * 8}}
                    onClick={() => this.props.onLoad(val.index)}>
                    <ListItemText inset primary={val.title} />
                  </ListItem>);
                }) : <ListItem style={{paddingLeft: this.props.rootItem.depth * 8}}>
              <CircularProgress /><ListItemText inset primary="Loading..." />
            </ListItem>}
          </List>
        </Collapse>]);
  }
}

export default CollapsableListItem;
