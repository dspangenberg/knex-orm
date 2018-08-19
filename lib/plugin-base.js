"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require("babel-runtime/core-js/object/assign");

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A base class for Plugins.
 */
var PluginBase = function () {
  /**
   * Creates a new plugin instance with the given options.
   * @param {Object} [options] Options to be used for the plugin.
   * @param {boolean} [options.beforeQuery=true] Set to false to disable the
   * execution of the 'beforeQuery' function.
   * @param {boolean} [options.afterQuery=true] Set to false to disable the
   * execution of the 'afterQuery' function.
   */
  function PluginBase() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, PluginBase);

    var defaultOptions = {
      beforeQuery: true,
      afterQuery: true
    };

    this.options = (0, _assign2.default)(defaultOptions, options);
  }

  /**
   * Initializes the plugin.
   * @param {ModelBase} BaseModel Base Model class of the plugin's corresponding
   * ORM instance.
   * @returns {PluginBase} The current plugin after initialization.
   */
  /* eslint-disable no-unused-vars */


  (0, _createClass3.default)(PluginBase, [{
    key: "init",
    value: function init(BaseModel) {
      return this;
    }

    /**
     * A function which triggers before query execution.
     * @param {QueryBuilder} qb QueryBuilder which corresponds to the query.
     * @returns {QueryBuilder} The modified QueryBuilder instance.
     */

  }, {
    key: "beforeQuery",
    value: function beforeQuery(qb) {
      return qb;
    }

    /**
     * A function which triggers after query execution, but before returning a
     * response object.
     * @param {Object} res Response object which can be modified.
     * @returns {Object} The modified response object.
     */

  }, {
    key: "afterQuery",
    value: function afterQuery(res) {
      return res;
    }
  }]);
  return PluginBase;
}();

exports.default = PluginBase;
//# sourceMappingURL=plugin-base.js.map