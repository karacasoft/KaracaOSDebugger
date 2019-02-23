"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const Button_1 = require("@material-ui/core/Button");
const styles_1 = require("@material-ui/core/styles");
const styles = theme => ({
    button: {
        margin: theme.spacing.unit
    }
});
class DebugButtons extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            waitingResult: false
        };
    }
    render() {
        return React.createElement("div", null,
            React.createElement(Button_1.default, { variant: "contained", color: "secondary", className: this.props.classes.button, onClick: this.props.onDebug }, "Debug"),
            React.createElement(Button_1.default, { variant: "contained", className: this.props.classes.button, onClick: this.props.onContinue }, "Continue"),
            React.createElement(Button_1.default, { variant: "contained", className: this.props.classes.button, onClick: this.props.onStepOver }, "Step Over"),
            React.createElement(Button_1.default, { variant: "contained", className: this.props.classes.button, onClick: this.props.onStepInto }, "Step Into"),
            React.createElement(Button_1.default, { variant: "contained", className: this.props.classes.button, onClick: this.props.onStepOut }, "Step Out"),
            React.createElement(Button_1.default, { variant: "contained", className: this.props.classes.button }, "Build All"),
            React.createElement(Button_1.default, { variant: "contained", className: this.props.classes.button }, "Stop"));
    }
}
exports.default = styles_1.withStyles(styles)(DebugButtons);
//# sourceMappingURL=DebugButtons.js.map