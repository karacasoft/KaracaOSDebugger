"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const CodeDisplay_1 = require("./Components/CodeDisplay/CodeDisplay");
const core_1 = require("@material-ui/core");
const styles_1 = require("@material-ui/core/styles");
const AppBar_1 = require("./Components/AppBar/AppBar");
require("./global.css");
const DirTree_1 = require("./Components/DirTree/DirTree");
const styles = theme => ({
    marginTop: {
        marginTop: 64,
    }
});
class App extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return React.createElement("div", null,
            React.createElement(AppBar_1.default, null),
            React.createElement(core_1.Grid, { container: true },
                React.createElement(core_1.Grid, { item: true, xs: 2, className: this.props.classes.marginTop },
                    React.createElement(DirTree_1.default, null)),
                React.createElement(core_1.Grid, { item: true, xs: 6, className: this.props.classes.marginTop },
                    React.createElement(CodeDisplay_1.default, { value: "This is a test..." }))));
    }
}
exports.default = styles_1.withStyles(styles)(App);
//# sourceMappingURL=App.js.map