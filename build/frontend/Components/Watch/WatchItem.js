"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const core_1 = require("@material-ui/core");
const EditableText_1 = require("../EditableText/EditableText");
class WatchItem extends React.Component {
    constructor(props) {
        super(props);
        this.handleOnChange = (value) => {
            this.props.onChange(value);
        };
        this.state = {};
    }
    render() {
        const { watchItem } = this.props;
        return React.createElement(core_1.TableRow, null,
            React.createElement(core_1.TableCell, null,
                React.createElement(EditableText_1.default, { alwaysEditing: this.props.addNew, label: "Expression", value: watchItem.expression, onChange: this.handleOnChange })),
            React.createElement(core_1.TableCell, null,
                React.createElement(core_1.Typography, null, watchItem.value)));
    }
}
exports.default = WatchItem;
//# sourceMappingURL=WatchItem.js.map