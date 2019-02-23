"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const core_1 = require("@material-ui/core");
class BreakpointListItem extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return React.createElement(core_1.TableRow, { onClick: _ => this.props.onClick(this.props.breakpoint) },
            React.createElement(core_1.TableCell, null, this.props.breakpoint.num),
            React.createElement(core_1.TableCell, null, this.props.breakpoint.type),
            React.createElement(core_1.TableCell, null, this.props.breakpoint.enabled ? "Yes" : "No"),
            React.createElement(core_1.TableCell, null, this.props.breakpoint.file),
            React.createElement(core_1.TableCell, null, this.props.breakpoint.lineNum));
    }
}
exports.default = BreakpointListItem;
//# sourceMappingURL=BreakpointListItem.js.map