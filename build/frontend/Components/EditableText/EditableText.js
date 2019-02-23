"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const core_1 = require("@material-ui/core");
class EditableText extends React.Component {
    constructor(props) {
        super(props);
        this.handleKeyDown = (ev) => {
            if (ev.keyCode === 13) {
                this.setState({
                    editing: this.props.alwaysEditing,
                });
                this.props.onChange(this.textFieldRef.current.value.trim());
                this.textFieldRef.current.value = "";
            }
        };
        this.handleClick = () => {
            this.setState({
                editing: true,
            });
        };
        this.state = {
            editing: this.props.alwaysEditing,
        };
        this.textFieldRef = React.createRef();
    }
    render() {
        const { label } = this.props;
        const { editing } = this.state;
        if (editing) {
            return React.createElement(core_1.TextField, { inputProps: {
                    ref: this.textFieldRef,
                }, label: label, onKeyDown: this.handleKeyDown, defaultValue: this.props.value });
        }
        else {
            return React.createElement(core_1.Typography, { onClick: this.handleClick }, this.props.value);
        }
    }
}
exports.default = EditableText;
//# sourceMappingURL=EditableText.js.map