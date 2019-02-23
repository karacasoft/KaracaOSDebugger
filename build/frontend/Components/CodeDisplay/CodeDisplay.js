"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const styles_1 = require("@material-ui/core/styles");
const react_codemirror2_1 = require("react-codemirror2");
require('codemirror/mode/clike/clike');
require("codemirror/lib/codemirror.css");
require("codemirror/theme/material.css");
const styles = theme => {
    return ({
        codeDisplay: {
            height: "100%"
        },
        breakpointMarker: {
            backgroundColor: "#1B5E20"
        },
        breakpointGutter: {
            backgroundColor: "#64DD17",
            color: theme.palette.common.black
        },
        execMarker: {
            backgroundColor: "#827717"
        }
    });
};
class CodeDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editor: null,
        };
    }
    componentDidUpdate(prevProps) {
        if (this.state.editor !== null) {
            if (prevProps.execLine)
                this.state.editor.removeLineClass(prevProps.execLine - 1, "background");
            this.props.breakpoints.filter(br => br.deleted !== true).forEach(br => {
                this.state.editor.addLineClass(br.lineNum - 1, "background", this.props.classes.breakpointMarker);
                this.state.editor.addLineClass(br.lineNum - 1, "gutter", this.props.classes.breakpointGutter);
            });
            if (this.props.execLine)
                this.state.editor
                    .addLineClass(this.props.execLine - 1, "background", this.props.classes.execMarker);
        }
    }
    render() {
        return (React.createElement(react_codemirror2_1.Controlled, { value: this.props.value, onBeforeChange: () => {
                console.log("On before change");
            }, editorDidMount: (editor) => {
                this.setState({
                    editor
                });
                editor.setSize(null, "100%");
            }, onGutterClick: (editor, lineNumber, gutter, event) => {
                const bpFiltered = this.props.breakpoints.filter(br => br.lineNum === lineNumber + 1);
                if (bpFiltered.length >= 1) {
                    bpFiltered[0].deleted = true;
                    editor.removeLineClass(lineNumber, "background");
                    editor.removeLineClass(lineNumber, "gutter");
                    this.props.onRemoveBreakpoint(bpFiltered[0].num);
                }
                else {
                    this.props.onAddBreakpoint(lineNumber + 1);
                }
            }, className: this.props.classes.codeDisplay, options: {
                mode: this.props.mode,
                lineNumbers: true,
                readOnly: true,
                theme: 'material'
            } }));
    }
}
exports.default = styles_1.withStyles(styles)(CodeDisplay);
//# sourceMappingURL=CodeDisplay.js.map