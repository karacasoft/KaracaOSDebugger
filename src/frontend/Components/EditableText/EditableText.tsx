import * as React from 'react';
import { Typography, TextField } from '@material-ui/core';

interface EditableTextProps {
  label?: string;
  value: string;
  onChange: (value) => void;
}

interface EditableTextState {
  editing: boolean;
}

class EditableText extends React.Component<EditableTextProps, EditableTextState> {
  
  private textFieldRef: React.RefObject<HTMLInputElement>;
  
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
    };
    this.textFieldRef = React.createRef();
  }
  
  handleKeyDown = (ev) => {
    if(ev.keyCode === 13) {
      this.setState({
        editing: false,
      });
      this.props.onChange(this.textFieldRef.current.value);
    }
  }
  
  handleClick = () => {
    this.setState({
      editing: true,
    });
  }
  
  render() {
    const { label } = this.props;
    const { editing } = this.state;
    if(editing) {
      return <TextField
        inputProps={{
          ref: this.textFieldRef,
        }}
        label={label}
        onKeyDown={this.handleKeyDown}
        defaultValue={this.props.value}
      />
    } else {
      return <Typography onClick={this.handleClick}>{this.props.value}</Typography>
    }
  }
}

export default EditableText;