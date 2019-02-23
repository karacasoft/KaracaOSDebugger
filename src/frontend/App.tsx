import * as React from 'react';

import CodeDisplay from './Components/CodeDisplay/CodeDisplay';

import { Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import AppBar from './Components/AppBar/AppBar';

import './global.css';
import DirTree from './Components/DirTree/DirTree';
import { socket, getFileContents, getBreakpoints, addBreakpoint, removeBreakpoint, debugStart, debugContinue, onExecResultFunction, debugNext, debugStep, debugFinish, getStackInfo } from './Service/debugService';
import BreakpointList, { Breakpoint } from './Components/BreakpointList/BreakpointList';
import EventLog from './Components/EventLog/EventLog';
import RightSideBar from './Components/RightSideBar/RightSideBar';
import Watch from './Components/Watch/Watch';
import Registers from './Components/Registers/Registers';
import * as RegistersStateManager from './StateManagers/RegistersState';
import * as WatchStateManager from './StateManagers/WatchState';

const styles = (_) => ({
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

interface BreakpointsState {
  list: Breakpoint[],
  loading: boolean
}

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
  editorContents: string;
  breakpoint: BreakpointsState;
  selectedFile: string | undefined;
  execState: ExecState;
}

class App extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      editorContents: "Select a file from file explorer...",
      breakpoint: {
        list: [],
        loading: false
      },
      selectedFile: undefined,
      execState: {
        state: "stopped"
      }
    };

    this.handleLoadFile = this.handleLoadFile.bind(this);
  }

  componentDidMount() {
    this.refreshBreakpoints();
    RegistersStateManager.updateRegisterNames();
    socket.on("reconnect", () => {
      this.refreshBreakpoints();
    });
    onExecResultFunction(ev => {
      const onPaused = (ev) => {
        this.setState({
          execState: {
            state: "paused",
            file: ev.results.frame.file,
            func: ev.results.frame.func,
            line: parseInt(ev.results.frame.line),
          },
        });
        this.handleLoadFile(ev.results.frame.file);
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

  refreshBreakpoints() {
    this.setState({
      breakpoint: {
        list: this.state.breakpoint.list,
        loading: true
      }
    });
    getBreakpoints()
      .then(res => {
        this.setState({
          breakpoint: {
            list: res.body.map((br): Breakpoint => ({
              num: br.bkpt.number,
              type: br.bkpt.type,
              enabled: br.bkpt.enabled,
              disp: br.bkpt.disp,
              addr: br.bkpt.addr,
              file: br.bkpt.file,
              lineNum: br.bkpt.line
            })),
            loading: false
          }
        });

      })
      .catch(err => {
        this.setState({
          breakpoint: {
            list: this.state.breakpoint.list,
            loading: false
          }
        });
        console.error(err);
      })
  }

  handleLoadFile(filename: string) {
    getFileContents(filename)
      .then(res => {
        this.setState({
          editorContents: res,
          selectedFile: filename
        });
      })
      .catch(err => {
        console.error(err);
        this.setState({
          editorContents: `Error while opening file: ${filename}
${err.stack}`,
          selectedFile: undefined
        });
      });
  }

  handleLineClick = (lineNum: number) => {
    this.setState({
      breakpoint: {
        list: this.state.breakpoint.list,
        loading: true
      }
    });
    addBreakpoint(this.state.selectedFile, lineNum).then(_ => {
      this.refreshBreakpoints();
    }).catch(err => {
      console.error(err);
      this.setState({
        breakpoint: {
          list: this.state.breakpoint.list,
          loading: false
        }
      });
    });
  }

  handleRemoveBreakpoint = (bpNum: number) => {
    this.setState({
      breakpoint: {
        list: this.state.breakpoint.list,
        loading: true
      }
    });
    removeBreakpoint(bpNum).then(_ => {
      this.refreshBreakpoints();
    }).catch(err => {
      console.error(err);
      this.setState({
        breakpoint: {
          list: this.state.breakpoint.list,
          loading: false
        }
      });
    });
  }

  handleBreakpointClick = (bp: Breakpoint) => {
    this.handleLoadFile(bp.file);
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
          <DirTree onLoadFile={this.handleLoadFile} />
        </Grid>
        <Grid item
          xs={6}
          className={this.props.classes.marginTop + " " + this.props.classes.codeDisplayGrid}>
          <CodeDisplay
            onAddBreakpoint={this.handleLineClick}
            onRemoveBreakpoint={this.handleRemoveBreakpoint}
            mode="text/x-csrc"
            breakpoints={this.state.breakpoint.list.filter(br => `${br.file}` === this.state.selectedFile)}
            execLine={this.state.execState.line}
            value={this.state.editorContents}
          />
        </Grid>
        <Grid item
          xs={3}
          className={this.props.classes.marginTop + " " + this.props.classes.codeDisplayGrid}>
          <RightSideBar tabHeaders={["Breakpoints", "Watch", "Registers"]}>
            <BreakpointList
              loading={this.state.breakpoint.loading}
              breakpoints={this.state.breakpoint.list}
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
