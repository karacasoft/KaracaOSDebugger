import * as React from 'react';

import Collapse from '@material-ui/core/Collapse';
import { TreeItem } from './DirTree';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import CircularProgress from '@material-ui/core/CircularProgress';

interface Props {
  items: TreeItem[];
  rootItem: TreeItem;
  children: number[];
  onLoad: (itemIndex: number) => Promise<boolean>;
}

interface State {
  open: boolean;
  error: boolean;
  loading: boolean;
}

class CollapsableListItem extends React.Component<Props, State> {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      error: false,
      loading: false
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    if(!this.props.children) {
      this.props.onLoad(this.props.rootItem.index)
        .then(res => {
          if(res) {
            this.setState({
              open: true,
              error: false,
              loading: false
            });
          }
        })
        .catch(err => {
          console.error(err);
          this.setState({
            open: false,
            error: true,
            loading: false
          });
        });
    }
    this.setState({
      open: !this.state.open
    });
  }

  render() {
    return ([
        <ListItem key="collapseItem" button onClick={this.handleClick} style={{paddingLeft: (this.props.rootItem.depth - 1) * 8}}>
          <ListItemText inset primary={this.props.rootItem.title} />
          {this.state.open ? <ExpandLess color="action" /> : <ExpandMore color="action" />}
        </ListItem>,
        <Collapse key="collapse" in={this.state.open}>
          <List component="div">
            {this.props.children ?
              this.props.children
              .map(cIndex => this.props.items[cIndex])
              .map(val => {
                if(val.isDir)
                  return (<CollapsableListItem
                    key={val.index}
                    items={this.props.items}
                    children={val.children}
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
