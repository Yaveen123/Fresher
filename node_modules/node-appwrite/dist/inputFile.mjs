import { File } from 'node-fetch-native-with-agent';
import { realpathSync, readFileSync } from 'fs';

// src/inputFile.ts
var InputFile = class {
  static fromBuffer(parts, name) {
    return new File([parts], name);
  }
  static fromPath(path, name) {
    const realPath = realpathSync(path);
    const contents = readFileSync(realPath);
    return this.fromBuffer(contents, name);
  }
  static fromPlainText(content, name) {
    const arrayBytes = new TextEncoder().encode(content);
    return this.fromBuffer(arrayBytes, name);
  }
};

export { InputFile };
//# sourceMappingURL=out.js.map
//# sourceMappingURL=inputFile.mjs.map