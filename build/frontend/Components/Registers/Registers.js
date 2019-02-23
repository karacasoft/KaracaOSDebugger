"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const debugService_1 = require("../../Service/debugService");
const core_1 = require("@material-ui/core");
const RegistersItem_1 = require("./RegistersItem");
class Registers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        this.updateRegisterValues();
    }
    updateRegisterValues() {
        debugService_1.getRegisterValues().then(res => {
            this.setState({
                registerValues: res.results['register-values'],
            });
        }).catch(console.error);
    }
    render() {
        const { registerNames } = this.props;
        const { registerValues } = this.state;
        if (!registerNames || !registerValues) {
            return React.createElement(core_1.Typography, null, "Retrieving information...");
        }
        return React.createElement(core_1.Paper, null,
            React.createElement(core_1.Table, { padding: "dense" },
                React.createElement(core_1.TableHead, null,
                    React.createElement(core_1.TableRow, null,
                        React.createElement(core_1.TableCell, null, "Register"),
                        React.createElement(core_1.TableCell, null, "Value"))),
                React.createElement(core_1.TableBody, null, this.state.registerValues.map((item, idx) => (React.createElement(RegistersItem_1.default, { key: idx, registerNameValue: {
                        number: item.number,
                        name: registerNames[parseInt(item.number)],
                        value: item.value,
                    } }))))));
        ;
    }
}
exports.default = Registers;
//# sourceMappingURL=Registers.js.map