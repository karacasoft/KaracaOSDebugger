import * as React from 'react';
import { Paper, Table, TableHead, TableCell, TableRow, TableBody } from '@material-ui/core';
import WatchItem from './WatchItem';
import { addToWatch, editItemOnWatch, removeFromWatch, watchUpdate } from '../../Service/debugService';

export interface WatchItemDef {
  has_more?: string;
  name?: string;
  expression: string;
  value: string;
  type?: string;
}

interface WatchProps {
  
}

interface WatchState {
  watchItems: WatchItemDef[];
  newWatchItem: WatchItemDef;
}

class Watch extends React.Component<WatchProps, WatchState> {
  
  constructor(props) {
    super(props);
    this.state = {
      watchItems: [],
      newWatchItem: {
        expression: "",
        value: "",
      }
    };
  }
  
  componentDidMount() {
    this.updateVars();
  }
  
  private resetNewWatchItem() {
    this.setState({
      newWatchItem: {
        expression: "",
        value: "",
      },
    });
  }
  
  handleAddWatchItem = (expr: string) => {
    addToWatch(expr).then(res => {
      this.state.watchItems.push({
        ...res.results,
        expression: expr,
      });
      this.setState({
        watchItems: this.state.watchItems,
      });
      this.resetNewWatchItem();
    }).catch(err => {
      console.log("err");
      console.error(err);
    });
  }
  
  handleEditWatchItem = (i: number, expr: string) => {
    if(expr === "") {
      removeFromWatch(this.state.watchItems[i].name).then(res => {
        console.log(res);
        this.setState({
          watchItems: this.state.watchItems.filter((_, idx) => idx !== i),
        });
      }).catch(err => {
        console.error(err);
      });
    } else {
      editItemOnWatch(this.state.watchItems[i].name, expr).then(res => {
        console.log(res);
        this.setState({
          watchItems: this.state.watchItems.map((item, idx) => ({
            ...item,
            expression: (idx === i) ? expr : item.expression,
          })),
        });
      }).catch(err => {
        console.error(err);
      });
    }
  }
  
  updateVars() {
    watchUpdate().then(res => {
      const changeList = res.results.changelist;
      let lastList = [ ...this.state.watchItems ];
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
      this.setState({
        watchItems: lastList,
      });
    }).catch(console.error);
  }
  
  render() {
    const { newWatchItem } = this.state;
    return <Paper>
      <Table padding="dense">
        <TableHead>
          <TableRow>
            <TableCell>Expression</TableCell>
            <TableCell>Value</TableCell>
          </TableRow> 
        </TableHead>
        <TableBody>
          {this.state.watchItems.map((item, idx) => (<WatchItem
            key={idx}
            watchItem={item}
            onChange={(val) => this.handleEditWatchItem(idx, val)} />))}
          <WatchItem
            watchItem={newWatchItem}
            onChange={this.handleAddWatchItem}
            addNew
            />
        </TableBody>
      </Table>
    </Paper>;
  }
}

export default Watch;