// src/id.ts
var ID = class _ID {
  /**
   * Generate an hex ID based on timestamp.
   * Recreated from https://www.php.net/manual/en/function.uniqid.php
   *
   * @returns {string}
   */
  static #hexTimestamp() {
    const now = /* @__PURE__ */ new Date();
    const sec = Math.floor(now.getTime() / 1e3);
    const msec = now.getMilliseconds();
    const hexTimestamp = sec.toString(16) + msec.toString(16).padStart(5, "0");
    return hexTimestamp;
  }
  /**
   * Uses the provided ID as the ID for the resource.
   *
   * @param {string} id
   * @returns {string}
   */
  static custom(id) {
    return id;
  }
  /**
   * Have Appwrite generate a unique ID for you.
   * 
   * @param {number} padding. Default is 7.
   * @returns {string}
   */
  static unique(padding = 7) {
    const baseId = _ID.#hexTimestamp();
    let randomPadding = "";
    for (let i = 0; i < padding; i++) {
      const randomHexDigit = Math.floor(Math.random() * 16).toString(16);
      randomPadding += randomHexDigit;
    }
    return baseId + randomPadding;
  }
};

export { ID };
//# sourceMappingURL=out.js.map
//# sourceMappingURL=id.mjs.map