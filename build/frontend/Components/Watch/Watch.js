"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const core_1 = require("@material-ui/core");
const WatchItem_1 = require("./WatchItem");
const debugService_1 = require("../../Service/debugService");
class Watch extends React.Component {
    constructor(props) {
        super(props);
        this.handleAddWatchItem = (expr) => {
            debugService_1.addToWatch(expr).then(res => {
                this.state.watchItems.push(Object.assign({}, res.results, { expression: expr }));
                this.setState({
                    watchItems: this.state.watchItems,
                });
                this.resetNewWatchItem();
            }).catch(err => {
                console.log("err");
                console.error(err);
            });
        };
        this.handleEditWatchItem = (i, expr) => {
            if (expr === "") {
                debugService_1.removeFromWatch(this.state.watchItems[i].name).then(res => {
                    console.log(res);
                    this.setState({
                        watchItems: this.state.watchItems.filter((_, idx) => idx !== i),
                    });
                }).catch(err => {
                    console.error(err);
                });
            }
            else {
                debugService_1.editItemOnWatch(this.state.watchItems[i].name, expr).then(res => {
                    console.log(res);
                    this.setState({
                        watchItems: this.state.watchItems.map((item, idx) => (Object.assign({}, item, { expression: (idx === i) ? expr : item.expression }))),
                    });
                }).catch(err => {
                    console.error(err);
                });
            }
        };
        this.state = {
            watchItems: [],
            newWatchItem: {
                expression: "",
                value: "",
            }
        };
    }
    componentDidMount() {
        this.updateVars();
    }
    resetNewWatchItem() {
        this.setState({
            newWatchItem: {
                expression: "",
                value: "",
            },
        });
    }
    updateVars() {
        debugService_1.watchUpdate().then(res => {
            const changeList = res.results.changelist;
            let lastList = [...this.state.watchItems];
            changeList.forEach(change => {
                if (lastList.find(el => el.name === change.name)) {
                    lastList = lastList.map(val => {
                        if (change.name === val.name) {
                            return Object.assign({}, val, change);
                        }
                        else
                            return val;
                    });
                }
                else {
                    debugService_1.removeFromWatch(change.name);
                }
            });
            this.setState({
                watchItems: lastList,
            });
        }).catch(console.error);
    }
    render() {
        const { newWatchItem } = this.state;
        return React.createElement(core_1.Paper, null,
            React.createElement(core_1.Table, { padding: "dense" },
                React.createElement(core_1.TableHead, null,
                    React.createElement(core_1.TableRow, null,
                        React.createElement(core_1.TableCell, null, "Expression"),
                        React.createElement(core_1.TableCell, null, "Value"))),
                React.createElement(core_1.TableBody, null,
                    this.state.watchItems.map((item, idx) => (React.createElement(WatchItem_1.default, { key: idx, watchItem: item, onChange: (val) => this.handleEditWatchItem(idx, val) }))),
                    React.createElement(WatchItem_1.default, { watchItem: newWatchItem, onChange: this.handleAddWatchItem, addNew: true }))));
    }
}
exports.default = Watch;
//# sourceMappingURL=Watch.js.map