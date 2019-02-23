"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const CodeDisplay_1 = require("./Components/CodeDisplay/CodeDisplay");
const core_1 = require("@material-ui/core");
const styles_1 = require("@material-ui/core/styles");
const AppBar_1 = require("./Components/AppBar/AppBar");
require("./global.css");
const DirTree_1 = require("./Components/DirTree/DirTree");
const debugService_1 = require("./Service/debugService");
const BreakpointList_1 = require("./Components/BreakpointList/BreakpointList");
const EventLog_1 = require("./Components/EventLog/EventLog");
const RightSideBar_1 = require("./Components/RightSideBar/RightSideBar");
const Watch_1 = require("./Components/Watch/Watch");
const Registers_1 = require("./Components/Registers/Registers");
const RegistersStateManager_1 = require("./StateManagers/RegistersStateManager");
const StateManager_1 = require("./StateManagers/StateManager");
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
class App extends React.Component {
    constructor(props) {
        super(props);
        this.handleLineClick = (lineNum) => {
            this.setState({
                breakpoint: {
                    list: this.state.breakpoint.list,
                    loading: true
                }
            });
            debugService_1.addBreakpoint(this.state.selectedFile, lineNum).then(_ => {
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
        };
        this.handleRemoveBreakpoint = (bpNum) => {
            this.setState({
                breakpoint: {
                    list: this.state.breakpoint.list,
                    loading: true
                }
            });
            debugService_1.removeBreakpoint(bpNum).then(_ => {
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
        };
        this.handleBreakpointClick = (bp) => {
            this.handleLoadFile(bp.file);
        };
        this.handleDebugPressed = () => {
            debugService_1.debugStart().catch(err => {
                console.error(err);
            });
        };
        this.handleContinuePressed = () => {
            debugService_1.debugContinue().catch(err => {
                console.error(err);
            });
            this.setState({
                execState: {
                    state: "running",
                }
            });
        };
        this.handleStepOverPressed = () => {
            debugService_1.debugNext().catch(err => {
                console.error(err);
            });
        };
        this.handleStepIntoPressed = () => {
            debugService_1.debugStep(false).catch(err => {
                console.error(err);
            });
        };
        this.handleStepOutPressed = () => {
            debugService_1.debugFinish().catch(err => {
                console.error(err);
            });
        };
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
        this.watchRef = React.createRef();
        this.registersRef = React.createRef();
    }
    componentDidMount() {
        this.refreshBreakpoints();
        debugService_1.socket.on("reconnect", () => {
            this.refreshBreakpoints();
        });
        debugService_1.onExecResultFunction(ev => {
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
                debugService_1.getStackInfo().then(res => { console.log(res); })
                    .catch(err => console.error(err));
                if (this.registersRef.current)
                    this.registersRef.current.updateRegisterValues();
                if (this.watchRef.current)
                    this.watchRef.current.updateVars();
            };
            if (ev.results.reason && ev.results.reason === "exited-normally") {
                this.setState({
                    execState: {
                        state: "stopped",
                    },
                });
            }
            else if (ev.results.reason && ev.results.reason === "breakpoint-hit") {
                onPaused(ev);
            }
            else if (ev.results.reason && ev.results.reason === "end-stepping-range") {
                onPaused(ev);
            }
            else if (ev.results.reason && ev.results.reason === "function-finished") {
                onPaused(ev);
            }
            else {
                this.setState({
                    execState: {
                        state: "stopped",
                    }
                });
            }
        });
    }
    refreshBreakpoints() {
        this.setState({
            breakpoint: {
                list: this.state.breakpoint.list,
                loading: true
            }
        });
        debugService_1.getBreakpoints()
            .then(res => {
            this.setState({
                breakpoint: {
                    list: res.body.map((br) => ({
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
        });
    }
    handleLoadFile(filename) {
        debugService_1.getFileContents(filename)
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
    render() {
        return React.createElement("div", null,
            React.createElement(AppBar_1.default, { onDebug: this.handleDebugPressed, onContinue: this.handleContinuePressed, onStepOver: this.handleStepOverPressed, onStepInto: this.handleStepIntoPressed, onStepOut: this.handleStepOutPressed }),
            React.createElement(core_1.Grid, { container: true },
                React.createElement(core_1.Grid, { item: true, xs: 3, className: this.props.classes.marginTop + " " + this.props.classes.dirTreeGrid },
                    React.createElement(DirTree_1.default, { onLoadFile: this.handleLoadFile })),
                React.createElement(core_1.Grid, { item: true, xs: 6, className: this.props.classes.marginTop + " " + this.props.classes.codeDisplayGrid },
                    React.createElement(CodeDisplay_1.default, { onAddBreakpoint: this.handleLineClick, onRemoveBreakpoint: this.handleRemoveBreakpoint, mode: "text/x-csrc", breakpoints: this.state.breakpoint.list.filter(br => `${br.file}` === this.state.selectedFile), execLine: this.state.execState.line, value: this.state.editorContents })),
                React.createElement(core_1.Grid, { item: true, xs: 3, className: this.props.classes.marginTop + " " + this.props.classes.codeDisplayGrid },
                    React.createElement(RightSideBar_1.default, { tabHeaders: ["Breakpoints", "Watch", "Registers"] },
                        React.createElement(BreakpointList_1.default, { loading: this.state.breakpoint.loading, breakpoints: this.state.breakpoint.list, onClickBreakpoint: this.handleBreakpointClick }),
                        React.createElement(Watch_1.default, { ref: this.watchRef }),
                        React.createElement(Registers_1.default, { registerNames: this.state.registerNames, ref: this.registersRef })))),
            React.createElement(core_1.Grid, { container: true },
                React.createElement(core_1.Grid, { item: true, xs: 12 },
                    React.createElement(EventLog_1.default, { state: this.state.execState.state, file: this.state.execState.file, line: this.state.execState.line }))));
    }
}
exports.default = styles_1.withStyles(styles)(StateManager_1.withStateManager(RegistersStateManager_1.RegistersStateManager, "registersState")(App));
//# sourceMappingURL=App.js.map