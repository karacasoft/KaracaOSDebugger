import * as React from 'react';

import CodeDisplay from './Components/CodeDisplay/CodeDisplay';

import { Grid, Theme } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import AppBar from './Components/AppBar/AppBar';

import './global.css';
import DirTree from './Components/DirTree/DirTree';
import { socket, getFileContents, removeBreakpoint, debugStart, debugContinue, onExecResultFunction, debugNext, debugStep, debugFinish, getStackInfo } from './Service/debugService';
import BreakpointList from './Components/BreakpointList/BreakpointList';
import EventLog from './Components/EventLog/EventLog';
import RightSideBar from './Components/RightSideBar/RightSideBar';
import Watch from './Components/Watch/Watch';
import Registers from './Components/Registers/Registers';
import * as RegistersStateManager from './StateManagers/RegistersState';
import * as WatchStateManager from './StateManagers/WatchState';
import * as BreakpointsStateManager from './StateManagers/BreakpointsState';
import * as FilesStateManager from './StateManagers/FilesState';
import { observer } from 'mobx-react';

const styles = (_: Theme) => ({
  marginTop: {
    marginTop: 64,
  },
  dirTreeGrid: {
    height: window.innerHeight - 364,
    "overflow-y": "auto"
  },
  codeDisplayGrid: {
    height: window.innerHeight - 364,
    "overflow-y": "auto"
  }
});


interface Props {
  classes: any;
}

interface ExecState {
  state: "paused" | "running" | "stopped";
  line?: number;
  file?: string;
  func?: string;
}

interface State {
  execState: ExecState;
}

@observer class App extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      execState: {
        state: "stopped"
      }
    };
  }

  componentDidMount() {
    BreakpointsStateManager.refreshBreakpoints();
    RegistersStateManager.updateRegisterNames();
    socket.on("reconnect", () => {
      BreakpointsStateManager.refreshBreakpoints();
    });
    onExecResultFunction(ev => {
      const onPaused = (ev: any) => {
        this.setState({
          execState: {
            state: "paused",
            file: ev.results.frame.file,
            func: ev.results.frame.func,
            line: parseInt(ev.results.frame.line),
          },
        });
        FilesStateManager.loadFile(ev.results.frame.file);
        getStackInfo().then(res => { console.log(res); })
          .catch(err => console.error(err));
        RegistersStateManager.updateRegisterValues();
        WatchStateManager.updateValues();
      };
      
      if(ev.results.reason && ev.results.reason === "exited-normally") {
        this.setState({
          execState: {
            state: "stopped",
          },
        });
      } else if(ev.results.reason && ev.results.reason === "breakpoint-hit") {
        onPaused(ev);
      } else if(ev.results.reason && ev.results.reason === "end-stepping-range") {
        onPaused(ev);
      } else if(ev.results.reason && ev.results.reason === "function-finished") {
        onPaused(ev);
      } else {
        this.setState({
          execState: {
            state: "stopped",
          }
        });
      }
    })
  }

  handleLineClick = (lineNum: number) => {
    if(FilesStateManager.filesState.selectedFileName) BreakpointsStateManager.addBreakpoint(FilesStateManager.filesState.selectedFileName, lineNum);
  }

  handleRemoveBreakpoint = (bpNum: number) => {
    BreakpointsStateManager.removeBreakpoint(bpNum);
  }

  handleBreakpointClick = (bp: BreakpointsStateManager.Breakpoint) => {
    FilesStateManager.loadFile(bp.file);
  }

  handleDebugPressed = () => {
    debugStart().catch(err => {
      console.error(err);
    });
  }

  handleContinuePressed = () => {
    debugContinue().catch(err => {
      console.error(err);
    });
    this.setState({
      execState: {
        state: "running",
      }
    });
  }
  
  handleStepOverPressed = () => {
    debugNext().catch(err => {
      console.error(err);
    });
  }

  handleStepIntoPressed = () => {
    debugStep(false).catch(err => {
      console.error(err);
    });
  }

  handleStepOutPressed = () => {
    debugFinish().catch(err => {
      console.error(err);
    });
  }

  render() {
    return <div>
      <AppBar onDebug={this.handleDebugPressed}
              onContinue={this.handleContinuePressed}
              onStepOver={this.handleStepOverPressed}
              onStepInto={this.handleStepIntoPressed}
              onStepOut={this.handleStepOutPressed} />
      <Grid container>
        <Grid item
          xs={3}
          className={this.props.classes.marginTop + " " + this.props.classes.dirTreeGrid}>
          <DirTree filesState={FilesStateManager.filesState} />
        </Grid>
        <Grid item
          xs={6}
          className={this.props.classes.marginTop + " " + this.props.classes.codeDisplayGrid}>
          <CodeDisplay
            onAddBreakpoint={this.handleLineClick}
            onRemoveBreakpoint={this.handleRemoveBreakpoint}
            mode="text/x-csrc"
            breakpointsState={BreakpointsStateManager.breakpointsState}
            execLine={this.state.execState.line}
            value={FilesStateManager.filesState.editorContents}
          />
        </Grid>
        <Grid item
          xs={3}
          className={this.props.classes.marginTop + " " + this.props.classes.codeDisplayGrid}>
          <RightSideBar tabHeaders={["Breakpoints", "Watch", "Registers"]}>
            <BreakpointList
              breakpointsState={BreakpointsStateManager.breakpointsState}
              onClickBreakpoint={this.handleBreakpointClick}
            />
            <Watch watchState={WatchStateManager.watchState}/>
            <Registers registersData={RegistersStateManager.registersState} />
          </RightSideBar>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item
          xs={12}>
          <EventLog state={this.state.execState.state}
            file={this.state.execState.file}
            line={this.state.execState.line} />
        </Grid>
      </Grid>
      
    </div>;
  }
}

export default withStyles(styles)(App);
