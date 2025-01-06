'use strict';

var nodeFetchNativeWithAgent = require('node-fetch-native-with-agent');
var fs = require('fs');

class InputFile {
  static fromBuffer(parts, name) {
    return new nodeFetchNativeWithAgent.File([parts], name);
  }
  static fromPath(path, name) {
    const realPath = fs.realpathSync(path);
    const contents = fs.readFileSync(realPath);
    return this.fromBuffer(contents, name);
  }
  static fromPlainText(content, name) {
    const arrayBytes = new TextEncoder().encode(content);
    return this.fromBuffer(arrayBytes, name);
  }
}

exports.InputFile = InputFile;
//# sourceMappingURL=out.js.map
//# sourceMappingURL=inputFile.js.map