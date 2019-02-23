"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const StateManager_1 = require("./StateManager");
const debugService_1 = require("../Service/debugService");
class RegistersStateManagerClass extends StateManager_1.StateManager {
    getInitialState() {
        return {};
    }
    componentDidMount() {
        if (!this.getState().registerNames)
            debugService_1.getRegisterNames();
    }
    componentWillUnmount() { }
    getRegisterNames() {
        debugService_1.getRegisterNames().then(res => {
            this.updateState(Object.assign({}, this.getState(), { registerNames: res.results['register-names'] }));
        }).catch(console.error);
    }
}
exports.RegistersStateManager = new RegistersStateManagerClass();
//# sourceMappingURL=RegistersStateManager.js.map