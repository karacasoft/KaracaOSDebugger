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
const getFullPath = (item, items) => {
    if (item.depth === 0) {
        return '';
    }
    else if (item.depth === 1) {
        return item.name;
    }
    else {
        return `${getFullPath(items[item.parentIndex], items)}/${item.name}`;
    }
};
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
    handleDirLoad(itemIndex) {
        return __awaiter(this, void 0, void 0, function* () {
            const item = this.state.treeItems[itemIndex];
            let itemCount = this.state.treeItems.length;
            const initialCount = itemCount;
            if (!item.loaded) {
                try {
                    const dirDesc = yield debugService_1.getFiles(getFullPath(item, this.state.treeItems));
                    const newItems = [
                        ...this.state.treeItems,
                        ...dirDesc.files
                            .filter(val => (val.isDir && !val.name.match(/(^\.|^sysroot$)/)) || val.name.match(/\.(c|S|h)$/))
                            .map((val) => {
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
                    let children = Array(itemCount - initialCount).fill(0).map((_, idx) => initialCount + idx);
                    item.children = children;
                    this.setState({
                        treeItems: newItems
                    });
                    return true;
                }
                catch (err) {
                    console.error(err);
                    return false;
                }
            }
            return true;
        });
    }
    handleLoad(itemIndex) {
        return __awaiter(this, void 0, void 0, function* () {
            const item = this.state.treeItems[itemIndex];
            if (item.isDir) {
                return this.handleDirLoad(itemIndex);
            }
            else {
                this.props.onLoadFile(getFullPath(item, this.state.treeItems));
            }
        });
    }
    render() {
        return (React.createElement("div", { className: this.props.classes.dirTree },
            React.createElement(CollapsableListItem_1.default, { items: this.state.treeItems, rootItem: this.state.treeItems[0], children: this.state.treeItems[0].children, onLoad: this.handleLoad })));
    }
}
exports.default = styles_1.withStyles(styles)(DirTree);
//# sourceMappingURL=DirTree.js.map