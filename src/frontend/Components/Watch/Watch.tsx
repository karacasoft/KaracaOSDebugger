import * as React from 'react';
import { Paper, Table, TableHead, TableCell, TableRow, TableBody } from '@material-ui/core';
import WatchItem from './WatchItem';
import { addWatchItem, editWatchItem, updateValues, WatchState } from '../../StateManagers/WatchState';
import { observer } from 'mobx-react';

export interface WatchItemDef {
  has_more?: string;
  name?: string;
  expression: string;
  value: string;
  type?: string;
}

interface WatchProps {
  watchState: WatchState;
}


@observer class Watch extends React.Component<WatchProps> {
  
  constructor(props: WatchProps) {
    super(props);
  }
  
  componentDidMount() {
    this.updateVars();
  }
  
  handleAddWatchItem = (expr: string) => {
    addWatchItem(expr);
  }
  
  handleEditWatchItem = (i: number, expr: string) => {
    editWatchItem(i, expr);
  }
  
  updateVars() {
    updateValues();
  }
  
  render() {
    const { newWatchItem, watchItems } = this.props.watchState;
    return <Paper>
      <Table padding="dense">
        <TableHead>
          <TableRow>
            <TableCell>Expression</TableCell>
            <TableCell>Value</TableCell>
          </TableRow> 
        </TableHead>
        <TableBody>
          {watchItems.map((item, idx) => (<WatchItem
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