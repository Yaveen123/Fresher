'use strict';

class Permission {
}
/**
 * Generate read permission string for the provided role.
 *
 * @param {string} role
 * @returns {string}
 */
Permission.read = (role) => {
  return `read("${role}")`;
};
/**
 * Generate write permission string for the provided role.
 *
 * This is an alias of update, delete, and possibly create.
 * Don't use write in combination with update, delete, or create.
 *
 * @param {string} role
 * @returns {string}
 */
Permission.write = (role) => {
  return `write("${role}")`;
};
/**
 * Generate create permission string for the provided role.
 *
 * @param {string} role
 * @returns {string}
 */
Permission.create = (role) => {
  return `create("${role}")`;
};
/**
 * Generate update permission string for the provided role.
 *
 * @param {string} role
 * @returns {string}
 */
Permission.update = (role) => {
  return `update("${role}")`;
};
/**
 * Generate delete permission string for the provided role.
 *
 * @param {string} role
 * @returns {string}
 */
Permission.delete = (role) => {
  return `delete("${role}")`;
};

exports.Permission = Permission;
//# sourceMappingURL=out.js.map
//# sourceMappingURL=permission.js.map