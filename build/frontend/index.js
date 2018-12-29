"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_dom_1 = require("react-dom");
const App_1 = require("./App");
const styles_1 = require("@material-ui/core/styles");
const theme_1 = require("./theme");
react_dom_1.render(React.createElement(styles_1.MuiThemeProvider, { theme: theme_1.default },
    React.createElement(App_1.default, null)), document.getElementById('app'));
//# sourceMappingURL=index.js.map