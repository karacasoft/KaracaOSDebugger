"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const Collapse_1 = require("@material-ui/core/Collapse");
const List_1 = require("@material-ui/core/List");
const ListItem_1 = require("@material-ui/core/ListItem");
const ListItemText_1 = require("@material-ui/core/ListItemText");
const ExpandLess_1 = require("@material-ui/icons/ExpandLess");
const ExpandMore_1 = require("@material-ui/icons/ExpandMore");
class CollapsableListItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            error: false,
            loading: false
        };
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick() {
        if (!this.props.children) {
            this.props.onLoad(this.props.rootItem.index)
                .then(res => {
                if (res) {
                    this.setState({
                        open: true,
                        error: false,
                        loading: false
                    });
                }
            })
                .catch(err => {
                console.error(err);
                this.setState({
                    open: false,
                    error: true,
                    loading: false
                });
            });
        }
    }
    render() {
        return ([
            React.createElement(ListItem_1.default, { button: true, onClick: this.handleClick },
                React.createElement(ListItemText_1.default, { inset: true, primary: this.props.rootItem.title }),
                this.state.open ? React.createElement(ExpandLess_1.default, { color: "action" }) : React.createElement(ExpandMore_1.default, { color: "action" })),
            React.createElement(Collapse_1.default, { in: this.state.open },
                React.createElement(List_1.default, { component: "div" }, this.props.children ?
                    this.props.children
                        .map(cIndex => this.props.items[cIndex])
                        .map(val => {
                        if (val.isDir)
                            return (React.createElement(CollapsableListItem, { key: val.index, items: this.props.items, children: val.children, rootItem: val, onLoad: this.props.onLoad }));
                        else
                            return (React.createElement(ListItem_1.default, { button: true },
                                React.createElement(ListItemText_1.default, { inset: true, primary: val.title })));
                    }) : React.createElement(ListItem_1.default, null,
                    React.createElement(ListItemText_1.default, { inset: true, primary: "Loading..." }))))
        ]);
    }
}
exports.default = CollapsableListItem;
//# sourceMappingURL=CollapsableListItem.js.map