import * as React from 'react';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import DebugButtons from '../DebugButtons/DebugButtons';

const styles = {
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

export interface ButtonAppBarProps extends WithStyles<typeof styles> {
  onDebug: () => void;
  onContinue: () => void;
  onStepOver: () => void;
  onStepInto: () => void;
  onStepOut: () => void;
}

function ButtonAppBar(props: ButtonAppBarProps) {
  const { classes, onDebug, onContinue, onStepOver, onStepInto, onStepOut } = props;
  return (
    <div className={classes.root}>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" color="inherit" className={classes.grow}>
            KaracaOS Debugger
          </Typography>

          <DebugButtons onDebug={onDebug} onContinue={onContinue}
            onStepOver={onStepOver} onStepInto={onStepInto}
            onStepOut={onStepOut} />
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default withStyles(styles)(ButtonAppBar);
