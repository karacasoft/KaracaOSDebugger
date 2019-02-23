"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const core_1 = require("@material-ui/core");
class RightSideBar extends React.Component {
    constructor(props) {
        super(props);
        this.handleChangeTab = (ev, value) => {
            this.setState({
                activeTab: value,
            });
        };
        this.state = {
            activeTab: 0,
        };
    }
    render() {
        const { children, tabHeaders } = this.props;
        const { activeTab } = this.state;
        return React.createElement("div", null,
            React.createElement(core_1.AppBar, { position: "static" },
                React.createElement(core_1.Tabs, { value: activeTab, onChange: this.handleChangeTab }, tabHeaders.map(header => (React.createElement(core_1.Tab, { key: header, label: header }))))),
            children[activeTab]);
    }
}
exports.default = RightSideBar;
//# sourceMappingURL=RightSideBar.js.map