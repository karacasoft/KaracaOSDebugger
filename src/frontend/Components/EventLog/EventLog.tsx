import * as React from 'react';
import { createStyles, withStyles, Paper, WithStyles, Typography } from '@material-ui/core';

const styles = _ => createStyles({
  "root": {
    width: "100%",
    color: "white",
    height: 260
  }
});

interface EventLogProps extends WithStyles<typeof styles> {
  state: string;
  addr?: string;
  file?: string;
  line?: number;
}

interface EventLogState {
  
}

class EventLog extends React.Component<EventLogProps, EventLogState> {
  
  render() {
    return <Paper className={this.props.classes.root}>
      <Typography>Exec State: {this.props.state}</Typography>
      <Typography>Address: {this.props.addr || "??"}</Typography>
      <Typography>File: {this.props.file || "??"}</Typography>
      <Typography>Line: {this.props.line || "??"}</Typography>
    </Paper>;
  }
}

export default withStyles(styles)(EventLog);