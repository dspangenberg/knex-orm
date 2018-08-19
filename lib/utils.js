"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.flattenArray = flattenArray;
exports.modelize = modelize;
function flattenArray(value) {
  return [].concat.apply([], value);
}

function modelize(obj, Model) {
  // Support recursive array transformation
  if (Array.isArray(obj)) {
    return obj.map(function (item) {
      return modelize(item, Model);
    });
  }

  // Don't modelize non-objects
  return obj instanceof Object ? new Model(obj, false) : obj;
}
//# sourceMappingURL=utils.js.map