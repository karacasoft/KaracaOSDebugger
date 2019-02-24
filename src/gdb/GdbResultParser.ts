function cStringToNormalString(cstring: string): string {
  const matches = cstring.match(/^\"(.*)\"$/);
  if(matches && matches.length >= 1)
    return matches[1]
      .replace("\\n", "\n")
      .replace("\\r", "")
      .replace("\\\"", "\"");
  else return "";
}

function split(results: string): string[] {
  let splitArray = [];
  let parenStack = [];
  let str = "";
  let i = 0;
  if(results[0] === ",") i = 1;
  for(; i < results.length; i++) {
    if(results[i] === ',' && parenStack.length === 0) {
      splitArray.push(str);
      str = "";
    } else if(results[i] === '[') {
      parenStack.push('[');
      str += results[i];
    } else if(results[i] === ']') {
      parenStack.pop();
      // TODO assert that returning character is [
      str += results[i];
    } else if(results[i] === '{') {
      parenStack.push('{');
      str += results[i];
    } else if(results[i] === '}') {
      parenStack.pop();
      str += results[i];
    } else {
      str += results[i];
    }
  }
  splitArray.push(str);
  return splitArray;
}

function parseList(list: string): any {
  if(list === "[]") {
    return [];
  } else {
    const matches = list.match(/^\[(.*)\]$/);
    if(matches && matches.length >= 1)
      return split(matches[1])
        .map(val => {
          if(val.match(/^("|{|\[)/)) {
            return parseValue(val);
          } else {
            return parseResult(val);
          }
        });
    else return [];
  }
}

function parseTuple(tuple: string): any {
  if(tuple === "{}") {
    return {};
  } else {
    const matches = tuple.match(/^{(.+)}$/);
    if(matches && matches.length >= 1) return parseResult(matches[1]);
  }
}

function parseValue(value: string): any {
  if(value.match(/^{(.*)}$/)) {
    return parseTuple(value);
  } else if(value.match(/^\[(.*)\]$/)) {
    return parseList(value);
  } else {
    return cStringToNormalString(value);
  }
}

export function parseResult(results: string | null | undefined): any {
  console.log(`Results '${JSON.stringify(results)}'`);
  if(results === "" || results === null || results === undefined) {
    return {};
  }
  const resultsArr: string[] = split(results);
  //console.log(`Results arr: """${JSON.stringify(resultsArr)}"""`);
  let resultsObj = {};
  resultsArr.map(result => result.trim())
    .forEach(result => {
      const keyValue = result.match(/^(.+?)=(.+)$/);
      if(keyValue) {
        resultsObj = {
          ...resultsObj,
          [keyValue[1]]: parseValue(keyValue[2])
        };
      }
    });
  return resultsObj;
}
