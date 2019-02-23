"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function cStringToNormalString(cstring) {
    return cstring.match(/^\"(.*)\"$/)[1]
        .replace("\\n", "\n")
        .replace("\\r", "")
        .replace("\\\"", "\"");
}
function split(results) {
    let splitArray = [];
    let parenStack = [];
    let str = "";
    let i = 0;
    if (results[0] === ",")
        i = 1;
    for (; i < results.length; i++) {
        if (results[i] === ',' && parenStack.length === 0) {
            splitArray.push(str);
            str = "";
        }
        else if (results[i] === '[') {
            parenStack.push('[');
            str += results[i];
        }
        else if (results[i] === ']') {
            parenStack.pop();
            // TODO assert that returning character is [
            str += results[i];
        }
        else if (results[i] === '{') {
            parenStack.push('{');
            str += results[i];
        }
        else if (results[i] === '}') {
            parenStack.pop();
            str += results[i];
        }
        else {
            str += results[i];
        }
    }
    splitArray.push(str);
    return splitArray;
}
function parseList(list) {
    if (list === "[]") {
        return [];
    }
    else {
        return split(list.match(/^\[(.*)\]$/)[1])
            .map(val => {
            if (val.match(/^("|{|\[)/)) {
                return parseValue(val);
            }
            else {
                return parseResult(val);
            }
        });
    }
}
function parseTuple(tuple) {
    if (tuple === "{}") {
        return {};
    }
    else {
        return parseResult(tuple.match(/^{(.+)}$/)[1]);
    }
}
function parseValue(value) {
    if (value.match(/^{(.*)}$/)) {
        return parseTuple(value);
    }
    else if (value.match(/^\[(.*)\]$/)) {
        return parseList(value);
    }
    else {
        return cStringToNormalString(value);
    }
}
function parseResult(results) {
    console.log(`Results '${JSON.stringify(results)}'`);
    if (results === "" || results === null || results === undefined) {
        return {};
    }
    const resultsArr = split(results);
    //console.log(`Results arr: """${JSON.stringify(resultsArr)}"""`);
    let resultsObj = {};
    resultsArr.map(result => result.trim())
        .forEach(result => {
        const keyValue = result.match(/^(.+?)=(.+)$/);
        resultsObj = Object.assign({}, resultsObj, { [keyValue[1]]: parseValue(keyValue[2]) });
    });
    return resultsObj;
}
exports.parseResult = parseResult;
//# sourceMappingURL=GdbResultParser.js.map