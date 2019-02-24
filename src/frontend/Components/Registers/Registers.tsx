import * as React from 'react';
import { Paper, Table, TableHead, TableRow, TableCell, TableBody, Typography } from '@material-ui/core';
import RegistersItem from './RegistersItem';
import { observer } from 'mobx-react';
import { RegistersState, updateRegisterValues } from '../../StateManagers/RegistersState';
import { IObservableObject } from 'mobx';

interface RegistersProps {
  registersData: RegistersState & IObservableObject;
}

@observer class Registers extends React.Component<RegistersProps> {
  
  constructor(props: RegistersProps) {
    super(props);
    this.state = {
    };
  }
  
  componentDidMount() {
    updateRegisterValues();
  }
  
  render() {
    const { registerNames, registerValues } = this.props.registersData;
    
    if(!registerNames || !registerValues) {
      return <Typography>Retrieving information...</Typography>;
    }
    
    return <Paper>
      <Table padding="dense">
        <TableHead>
          <TableRow>
            <TableCell>Register</TableCell>
            <TableCell>Value</TableCell>
          </TableRow> 
        </TableHead>
        <TableBody>
          {registerValues.map((item, idx) => (<RegistersItem
            key={idx}
            registerNameValue={{
              number: item.number,
              name: registerNames[parseInt(item.number)],
              value: item.value,
            }} />))}
        </TableBody>
      </Table>
    </Paper>;;
  }
}

export default Registers;