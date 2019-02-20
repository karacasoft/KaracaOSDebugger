import * as React from 'react';
import { WatchItemDef } from './Watch';
import { TableRow, TableCell, Typography } from '@material-ui/core';
import EditableText from '../EditableText/EditableText';

interface WatchItemProps {
  watchItem: WatchItemDef;
  onChange: (expression: string) => void;
}

interface WatchItemState {
  currentExpr?: string;
  editing: boolean;
}

class WatchItem extends React.Component<WatchItemProps, WatchItemState> {
  
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
    };
  }
  
  handleOnClickExpression = () => {
    this.setState({
      editing: true,
      currentExpr: this.props.watchItem.expression,
    });
  }
  
  handleOnChange = (value: string) => {
    this.props.onChange(value);
  }
  
  render() {
    const { watchItem } = this.props;
    return <TableRow>
      <TableCell>
        <EditableText
          label="Expression"
          value={watchItem.expression}
          onChange={this.handleOnChange}
        />
      </TableCell>
      <TableCell><Typography>{watchItem.result}</Typography></TableCell>
    </TableRow>;
  }
}

export default WatchItem;