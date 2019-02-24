import * as React from 'react';
import { Table, Paper, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';
import BreakpointListItem from './BreakpointListItem';
import * as BreakpointsStateManager from '../../StateManagers/BreakpointsState';


interface Props {
  breakpointsState: BreakpointsStateManager.BreakpointsState;
  onClickBreakpoint: (bp: BreakpointsStateManager.Breakpoint) => void;
}

interface State {

}

class BreakpointList extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
  }

  render() {
    return <Paper>
      <Table padding="dense">
        <TableHead>
          <TableRow>
            <TableCell numeric>#</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Enabled</TableCell>
            <TableCell>File</TableCell>
            <TableCell>Line</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {this.props.breakpointsState.list.map(br => <BreakpointListItem
            key={br.num}
            breakpoint={br}
            onClick={this.props.onClickBreakpoint}
          />)}
        </TableBody>
      </Table>
    </Paper>
  }

}

export default BreakpointList;
