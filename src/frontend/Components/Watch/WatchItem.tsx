import * as React from 'react';
import { WatchItemDef } from './Watch';
import { TableRow, TableCell, Typography } from '@material-ui/core';
import EditableText from '../EditableText/EditableText';

interface WatchItemProps {
  watchItem: WatchItemDef;
  onChange: (expression: string) => void;
  
  addNew?: boolean;
}

interface WatchItemState {
  
}

class WatchItem extends React.Component<WatchItemProps, WatchItemState> {
  
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  
  handleOnChange = (value: string) => {
    this.props.onChange(value);
  }
  
  render() {
    const { watchItem } = this.props;
    return <TableRow>
      <TableCell>
        <EditableText
          alwaysEditing={this.props.addNew}
          label="Expression"
          value={watchItem.expression}
          onChange={this.handleOnChange}
        />
      </TableCell>
      <TableCell><Typography>{watchItem.value}</Typography></TableCell>
    </TableRow>;
  }
}

export default WatchItem;