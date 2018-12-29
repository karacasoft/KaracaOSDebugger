import * as React from 'react';
import { Table, Paper, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';
import BreakpointListItem from './BreakpointListItem';

export interface Breakpoint {
  num: number;
  type: string;
  disp: string;
  enabled: boolean;
  addr: string;
  file: string;
  lineNum: number;
  deleted?: boolean;
}

interface Props {
  loading: boolean;
  breakpoints: Breakpoint[];
  onClickBreakpoint: (bp: Breakpoint) => void;
}

interface State {

}

class BreakpointList extends React.Component<Props, State> {

  constructor(props) {
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
          {this.props.breakpoints.map(br => <BreakpointListItem
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
