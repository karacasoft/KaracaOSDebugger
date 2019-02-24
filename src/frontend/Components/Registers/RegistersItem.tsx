import * as React from 'react';
import { TableRow, TableCell, Typography } from '@material-ui/core';
import { observer } from 'mobx-react';

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

@observer
class RegistersItem extends React.Component<RegistersItemProps, RegistersItemState> {
  
  constructor(props: RegistersItemProps) {
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