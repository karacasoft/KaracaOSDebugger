"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const CollapsableListItem_1 = require("./CollapsableListItem");
const styles_1 = require("@material-ui/core/styles");
const debugService_1 = require("../../Service/debugService");
const styles = theme => ({
    dirTree: {}
});
class DirTree extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            treeItems: [{
                    index: 0,
                    name: '',
                    title: "<root>",
                    loaded: false,
                    isDir: true,
                    depth: 0
                }]
        };
        this.handleLoad = this.handleLoad.bind(this);
    }
    handleLoad(itemIndex) {
        return __awaiter(this, void 0, void 0, function* () {
            const item = this.state.treeItems[itemIndex];
            let itemCount = this.state.treeItems.length;
            if (!item.loaded) {
                try {
                    const dirDesc = yield debugService_1.getFiles(item.name);
                    const newItems = [
                        ...this.state.treeItems,
                        ...dirDesc.files.map(val => {
                            item.children = [...item.children, itemCount];
                            return ({
                                index: itemCount++,
                                name: val.name,
                                title: val.name,
                                loaded: !val.isDir,
                                isDir: val.isDir,
                                depth: item.depth + 1,
                                parentIndex: item.index
                            });
                        })
                    ];
                    item.loaded = true;
                    this.setState({
                        treeItems: newItems
                    });
                    return true;
                }
                catch (err) {
                    return false;
                }
            }
            return Promise.resolve(true);
        });
    }
    render() {
        return (React.createElement("div", { className: this.props.classes.dirTree },
            React.createElement(CollapsableListItem_1.default, { items: this.state.treeItems, rootItem: this.state.treeItems[0], children: this.state.treeItems[0].children, onLoad: this.handleLoad })));
    }
}
exports.default = styles_1.withStyles(styles)(DirTree);
//# sourceMappingURL=DirTree.js.map