import * as React from 'react';
import { Paper, Table, TableHead, TableCell, TableRow, TableBody } from '@material-ui/core';
import WatchItem from './WatchItem';

export interface WatchItemDef {
  expression: string;
  result: string;
}

interface WatchProps {
  
}

interface WatchState {
  watchItems: WatchItemDef[];
}

class Watch extends React.Component<WatchProps, WatchState> {
  
  constructor(props) {
    super(props);
    this.state = {
      watchItems: [{
        expression: "wow",
        result: "hm"
      }],
    };
  }
  
  render() {
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
            onChange={(val) => { item.expression = val; this.setState({ watchItems: this.state.watchItems, }) }} />))}
        </TableBody>
      </Table>
    </Paper>;
  }
}

export default Watch;