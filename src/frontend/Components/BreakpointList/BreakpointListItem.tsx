import * as React from 'react';
import { Breakpoint } from './BreakpointList';
import { TableRow, TableCell } from '@material-ui/core';

interface Props {
  breakpoint: Breakpoint;
  onClick: (bp: Breakpoint) => void;
}

interface State {

}

class BreakpointListItem extends React.Component<Props, State> {
  constructor(props) {
    super(props);
  }

  render() {
    return <TableRow onClick={_ => this.props.onClick(this.props.breakpoint)}>
      <TableCell>{this.props.breakpoint.num}</TableCell>
      <TableCell>{this.props.breakpoint.type}</TableCell>
      <TableCell>{this.props.breakpoint.enabled ? "Yes" : "No"}</TableCell>
      <TableCell>{this.props.breakpoint.file}</TableCell>
      <TableCell>{this.props.breakpoint.lineNum}</TableCell>
    </TableRow>;
  }
}

export default BreakpointListItem;
