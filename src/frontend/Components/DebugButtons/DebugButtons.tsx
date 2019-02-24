import * as React from 'react';

import Button from '@material-ui/core/Button';

import { withStyles, Theme } from '@material-ui/core/styles';

interface Props {
  onDebug: () => void;
  onContinue: () => void;
  onStepOver: () => void;
  onStepInto: () => void;
  onStepOut: () => void;

  classes: any;
}

interface State {
  waitingResult: boolean;
}

const styles = (theme: Theme) => ({
  button: {
    margin: theme.spacing.unit
  }
});

class DebugButtons extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      waitingResult: false
    };
  }

  render() {
    return <div>
      <Button variant="contained" color="secondary" className={this.props.classes.button} onClick={this.props.onDebug}>Debug</Button>
      <Button variant="contained" className={this.props.classes.button} onClick={this.props.onContinue}>Continue</Button>
      <Button variant="contained" className={this.props.classes.button} onClick={this.props.onStepOver}>Step Over</Button>
      <Button variant="contained" className={this.props.classes.button} onClick={this.props.onStepInto}>Step Into</Button>
      <Button variant="contained" className={this.props.classes.button} onClick={this.props.onStepOut}>Step Out</Button>
      <Button variant="contained" className={this.props.classes.button}>Build All</Button>
      <Button variant="contained" className={this.props.classes.button}>Stop</Button>
    </div>;
  }
}

export default withStyles(styles)(DebugButtons);
