"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const styles_1 = require("@material-ui/core/styles");
const react_codemirror2_1 = require("react-codemirror2");
require("codemirror/lib/codemirror.css");
require("codemirror/theme/material.css");
const styles = theme => ({
    codeDisplay: {
        paddingTop: 10,
        paddingLeft: 10
    }
});
class CodeDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            breakpoints: []
        };
    }
    render() {
        return (React.createElement(react_codemirror2_1.Controlled, { value: this.props.value, onBeforeChange: () => {
                console.log("On before change");
            }, onGutterClick: (editor, lineNumber, gutter, event) => {
                console.log("Is that what I'm looking for?");
                console.log(lineNumber);
            }, className: this.props.classes.codeDisplay, options: {
                lineNumbers: true,
                readOnly: true,
                theme: 'material',
                gutters: [
                    "gutter-normal",
                    "gutter-breakpoint",
                    "gutter-exec"
                ]
            } }));
    }
}
exports.default = styles_1.withStyles(styles)(CodeDisplay);
//# sourceMappingURL=CodeDisplay.js.map