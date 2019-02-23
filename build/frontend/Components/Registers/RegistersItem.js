"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const core_1 = require("@material-ui/core");
class RegistersItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        const { registerNameValue } = this.props;
        return React.createElement(core_1.TableRow, null,
            React.createElement(core_1.TableCell, null,
                React.createElement(core_1.Typography, null, registerNameValue.name)),
            React.createElement(core_1.TableCell, null,
                React.createElement(core_1.Typography, null, registerNameValue.value)));
    }
}
exports.default = RegistersItem;
//# sourceMappingURL=RegistersItem.js.map