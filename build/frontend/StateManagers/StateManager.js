"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
class StateManager {
    getState() {
        return this.state;
    }
    updateState(state) {
        this.state = state;
        if (this.updateListener)
            this.updateListener(state);
    }
    setUpdateListener(handler) {
        this.updateListener = handler;
    }
    removeUpdateListener() {
        this.updateListener = undefined;
    }
}
exports.StateManager = StateManager;
function withStateManager(stateManager, stateKey) {
    return function stateManagerWrapper(WrappedComponent) {
        return class extends React.Component {
            constructor(props) {
                super(props);
                this.handleStateUpdate = (state) => {
                    this.setState(() => state);
                };
                this.state = stateManager.getInitialState();
            }
            componentDidMount() {
                stateManager.componentDidMount();
                stateManager.setUpdateListener(this.handleStateUpdate);
            }
            componentWillUnmount() {
                stateManager.componentWillUnmount();
                stateManager.removeUpdateListener();
            }
            render() {
                return React.createElement(WrappedComponent, Object.assign({}, { [stateKey]: this.state }, this.props));
            }
        };
    };
}
exports.withStateManager = withStateManager;
//# sourceMappingURL=StateManager.js.map