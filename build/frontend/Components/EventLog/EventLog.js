"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const core_1 = require("@material-ui/core");
const styles = _ => core_1.createStyles({
    "root": {
        width: "100%",
        color: "white",
        height: 260
    }
});
class EventLog extends React.Component {
    render() {
        return React.createElement(core_1.Paper, { className: this.props.classes.root },
            React.createElement(core_1.Typography, null,
                "Exec State: ",
                this.props.state),
            React.createElement(core_1.Typography, null,
                "Address: ",
                this.props.addr || "??"),
            React.createElement(core_1.Typography, null,
                "File: ",
                this.props.file || "??"),
            React.createElement(core_1.Typography, null,
                "Line: ",
                this.props.line || "??"));
    }
}
exports.default = core_1.withStyles(styles)(EventLog);
//# sourceMappingURL=EventLog.js.map