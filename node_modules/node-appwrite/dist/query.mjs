// src/query.ts
var _Query = class _Query {
  /**
   * Constructor for Query class.
   *
   * @param {string} method
   * @param {AttributesTypes} attribute
   * @param {QueryTypes} values
   */
  constructor(method, attribute, values) {
    this.method = method;
    this.attribute = attribute;
    if (values !== void 0) {
      if (Array.isArray(values)) {
        this.values = values;
      } else {
        this.values = [values];
      }
    }
  }
  /**
   * Convert the query object to a JSON string.
   *
   * @returns {string}
   */
  toString() {
    return JSON.stringify({
      method: this.method,
      attribute: this.attribute,
      values: this.values
    });
  }
};
/**
 * Filter resources where attribute is equal to value.
 *
 * @param {string} attribute
 * @param {QueryTypes} value
 * @returns {string}
 */
_Query.equal = (attribute, value) => new _Query("equal", attribute, value).toString();
/**
 * Filter resources where attribute is not equal to value.
 *
 * @param {string} attribute
 * @param {QueryTypes} value
 * @returns {string}
 */
_Query.notEqual = (attribute, value) => new _Query("notEqual", attribute, value).toString();
/**
 * Filter resources where attribute is less than value.
 *
 * @param {string} attribute
 * @param {QueryTypes} value
 * @returns {string}
 */
_Query.lessThan = (attribute, value) => new _Query("lessThan", attribute, value).toString();
/**
 * Filter resources where attribute is less than or equal to value.
 *
 * @param {string} attribute
 * @param {QueryTypes} value
 * @returns {string}
 */
_Query.lessThanEqual = (attribute, value) => new _Query("lessThanEqual", attribute, value).toString();
/**
 * Filter resources where attribute is greater than value.
 *
 * @param {string} attribute
 * @param {QueryTypes} value
 * @returns {string}
 */
_Query.greaterThan = (attribute, value) => new _Query("greaterThan", attribute, value).toString();
/**
 * Filter resources where attribute is greater than or equal to value.
 *
 * @param {string} attribute
 * @param {QueryTypes} value
 * @returns {string}
 */
_Query.greaterThanEqual = (attribute, value) => new _Query("greaterThanEqual", attribute, value).toString();
/**
 * Filter resources where attribute is null.
 *
 * @param {string} attribute
 * @returns {string}
 */
_Query.isNull = (attribute) => new _Query("isNull", attribute).toString();
/**
 * Filter resources where attribute is not null.
 *
 * @param {string} attribute
 * @returns {string}
 */
_Query.isNotNull = (attribute) => new _Query("isNotNull", attribute).toString();
/**
 * Filter resources where attribute is between start and end (inclusive).
 *
 * @param {string} attribute
 * @param {string | number} start
 * @param {string | number} end
 * @returns {string}
 */
_Query.between = (attribute, start, end) => new _Query("between", attribute, [start, end]).toString();
/**
 * Filter resources where attribute starts with value.
 *
 * @param {string} attribute
 * @param {string} value
 * @returns {string}
 */
_Query.startsWith = (attribute, value) => new _Query("startsWith", attribute, value).toString();
/**
 * Filter resources where attribute ends with value.
 *
 * @param {string} attribute
 * @param {string} value
 * @returns {string}
 */
_Query.endsWith = (attribute, value) => new _Query("endsWith", attribute, value).toString();
/**
 * Specify which attributes should be returned by the API call.
 *
 * @param {string[]} attributes
 * @returns {string}
 */
_Query.select = (attributes) => new _Query("select", void 0, attributes).toString();
/**
 * Filter resources by searching attribute for value.
 * A fulltext index on attribute is required for this query to work.
 *
 * @param {string} attribute
 * @param {string} value
 * @returns {string}
 */
_Query.search = (attribute, value) => new _Query("search", attribute, value).toString();
/**
 * Sort results by attribute descending.
 *
 * @param {string} attribute
 * @returns {string}
 */
_Query.orderDesc = (attribute) => new _Query("orderDesc", attribute).toString();
/**
 * Sort results by attribute ascending.
 *
 * @param {string} attribute
 * @returns {string}
 */
_Query.orderAsc = (attribute) => new _Query("orderAsc", attribute).toString();
/**
 * Return results after documentId.
 *
 * @param {string} documentId
 * @returns {string}
 */
_Query.cursorAfter = (documentId) => new _Query("cursorAfter", void 0, documentId).toString();
/**
 * Return results before documentId.
 *
 * @param {string} documentId
 * @returns {string}
 */
_Query.cursorBefore = (documentId) => new _Query("cursorBefore", void 0, documentId).toString();
/**
 * Return only limit results.
 *
 * @param {number} limit
 * @returns {string}
 */
_Query.limit = (limit) => new _Query("limit", void 0, limit).toString();
/**
 * Filter resources by skipping the first offset results.
 *
 * @param {number} offset
 * @returns {string}
 */
_Query.offset = (offset) => new _Query("offset", void 0, offset).toString();
/**
 * Filter resources where attribute contains the specified value.
 *
 * @param {string} attribute
 * @param {string | string[]} value
 * @returns {string}
 */
_Query.contains = (attribute, value) => new _Query("contains", attribute, value).toString();
/**
 * Combine multiple queries using logical OR operator.
 *
 * @param {string[]} queries
 * @returns {string}
 */
_Query.or = (queries) => new _Query("or", void 0, queries.map((query) => JSON.parse(query))).toString();
/**
 * Combine multiple queries using logical AND operator.
 *
 * @param {string[]} queries
 * @returns {string}
 */
_Query.and = (queries) => new _Query("and", void 0, queries.map((query) => JSON.parse(query))).toString();
var Query = _Query;

export { Query };
//# sourceMappingURL=out.js.map
//# sourceMappingURL=query.mjs.map