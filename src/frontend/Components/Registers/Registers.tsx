import * as React from 'react';
import { getRegisterValues } from '../../Service/debugService';
import { Paper, Table, TableHead, TableRow, TableCell, TableBody, Typography } from '@material-ui/core';
import RegistersItem from './RegistersItem';

export type RegisterValueState = {
  number: string;
  value: string;
}

interface RegistersProps {
  registerNames?: string[];
}

interface RegistersState {
  registerValues?: RegisterValueState[];
}

class Registers extends React.Component<RegistersProps, RegistersState> {
  
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  
  componentDidMount() {
    this.updateRegisterValues();
  }
  
  updateRegisterValues() {
    getRegisterValues().then(res => {
      this.setState({
        registerValues: res.results['register-values'],
      });
    }).catch(console.error);
  }
  
  render() {
    const { registerNames } = this.props;
    const { registerValues } = this.state;
    
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
          {this.state.registerValues.map((item, idx) => (<RegistersItem
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