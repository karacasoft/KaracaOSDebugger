import * as React from 'react';
import { TableRow, TableCell, Typography } from '@material-ui/core';

export type RegisterNameValue = {
  number: string;
  name: string;
  value: string;
};

interface RegistersItemProps {
  registerNameValue: RegisterNameValue;
}

interface RegistersItemState {
  
}

class RegistersItem extends React.Component<RegistersItemProps, RegistersItemState> {
  
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  
  render() {
    const { registerNameValue } = this.props;
    return <TableRow>
      <TableCell><Typography>{registerNameValue.name}</Typography></TableCell>
      <TableCell><Typography>{registerNameValue.value}</Typography></TableCell>
    </TableRow>;
  }
}

export default RegistersItem;