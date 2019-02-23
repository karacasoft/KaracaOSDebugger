"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const core_1 = require("@material-ui/core");
const BreakpointListItem_1 = require("./BreakpointListItem");
class BreakpointList extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return React.createElement(core_1.Paper, null,
            React.createElement(core_1.Table, { padding: "dense" },
                React.createElement(core_1.TableHead, null,
                    React.createElement(core_1.TableRow, null,
                        React.createElement(core_1.TableCell, { numeric: true }, "#"),
                        React.createElement(core_1.TableCell, null, "Type"),
                        React.createElement(core_1.TableCell, null, "Enabled"),
                        React.createElement(core_1.TableCell, null, "File"),
                        React.createElement(core_1.TableCell, null, "Line"))),
                React.createElement(core_1.TableBody, null, this.props.breakpoints.map(br => React.createElement(BreakpointListItem_1.default, { key: br.num, breakpoint: br, onClick: this.props.onClickBreakpoint })))));
    }
}
exports.default = BreakpointList;
//# sourceMappingURL=BreakpointList.js.map