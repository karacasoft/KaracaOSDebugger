"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const styles_1 = require("@material-ui/core/styles");
const AppBar_1 = require("@material-ui/core/AppBar");
const Toolbar_1 = require("@material-ui/core/Toolbar");
const Typography_1 = require("@material-ui/core/Typography");
const DebugButtons_1 = require("../DebugButtons/DebugButtons");
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
function ButtonAppBar(props) {
    const { classes, onDebug, onContinue, onStepOver, onStepInto, onStepOut } = props;
    return (React.createElement("div", { className: classes.root },
        React.createElement(AppBar_1.default, { position: "fixed" },
            React.createElement(Toolbar_1.default, null,
                React.createElement(Typography_1.default, { variant: "h6", color: "inherit", className: classes.grow }, "KaracaOS Debugger"),
                React.createElement(DebugButtons_1.default, { onDebug: onDebug, onContinue: onContinue, onStepOver: onStepOver, onStepInto: onStepInto, onStepOut: onStepOut })))));
}
exports.default = styles_1.withStyles(styles)(ButtonAppBar);
//# sourceMappingURL=AppBar.js.map