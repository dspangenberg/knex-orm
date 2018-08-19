'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ValidationPlugin = exports.CaseConverterPlugin = undefined;

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _entries = require('babel-runtime/core-js/object/entries');

var _entries2 = _interopRequireDefault(_entries);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _create = require('babel-runtime/core-js/object/create');

var _create2 = _interopRequireDefault(_create);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _inflection = require('inflection');

var _modelBase = require('./model-base');

var _modelBase2 = _interopRequireDefault(_modelBase);

var _pluginBase = require('./plugin-base');

var _pluginBase2 = _interopRequireDefault(_pluginBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CaseConverterPlugin = exports.CaseConverterPlugin = function (_PluginBase) {
  (0, _inherits3.default)(CaseConverterPlugin, _PluginBase);

  function CaseConverterPlugin() {
    (0, _classCallCheck3.default)(this, CaseConverterPlugin);
    return (0, _possibleConstructorReturn3.default)(this, (CaseConverterPlugin.__proto__ || (0, _getPrototypeOf2.default)(CaseConverterPlugin)).apply(this, arguments));
  }

  (0, _createClass3.default)(CaseConverterPlugin, [{
    key: 'init',
    value: function init(BaseModel) {
      var formatterPrototype = BaseModel.knex.client.Formatter.prototype;

      // Override a Knex query formatter function by extending it
      /* eslint-disable no-underscore-dangle */
      var originalFunction = formatterPrototype._wrapString;
      formatterPrototype._wrapString = function _wrapString(value) {
        return (0, _inflection.underscore)(originalFunction.call(this, value));
      };
      /* eslint-enable */

      return this;
    }
  }, {
    key: 'afterQuery',
    value: function afterQuery(res) {
      if (!this.options.afterQuery) return res;

      return this.transformKeys(res, function (key) {
        return (0, _inflection.camelize)(key, true);
      });
    }

    /**
     * Transforms the keys of the given object.
     * @param {Object} obj Object to be transformed.
     * @param {Function<string>} transformer Transformation function to be used.
     * @returns {Object} The transformed object.
     * @private
     */

  }, {
    key: 'transformKeys',
    value: function transformKeys(obj, transformer) {
      var _this2 = this;

      // Don't transform the keys of non-objects
      if (!(obj instanceof _modelBase2.default)) return obj;

      // Support recursive array transformation
      if (Array.isArray(obj)) {
        return obj.map(function (item) {
          return _this2.transformKeys(item, transformer);
        });
      }

      var result = {};
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = (0, _getIterator3.default)((0, _entries2.default)(obj)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _step$value = (0, _slicedToArray3.default)(_step.value, 2),
              key = _step$value[0],
              value = _step$value[1];

          result[transformer(key)] = value;
        }

        // Assign the appropriate prototype to the result
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return (0, _create2.default)((0, _getPrototypeOf2.default)(obj), result);
    }
  }]);
  return CaseConverterPlugin;
}(_pluginBase2.default);

var ValidationPlugin = exports.ValidationPlugin = function (_PluginBase2) {
  (0, _inherits3.default)(ValidationPlugin, _PluginBase2);

  function ValidationPlugin() {
    (0, _classCallCheck3.default)(this, ValidationPlugin);
    return (0, _possibleConstructorReturn3.default)(this, (ValidationPlugin.__proto__ || (0, _getPrototypeOf2.default)(ValidationPlugin)).apply(this, arguments));
  }

  (0, _createClass3.default)(ValidationPlugin, [{
    key: 'beforeQuery',
    value: function beforeQuery(qb) {
      if (!this.options.beforeQuery) return qb;

      var model = qb.modelInstance;
      if (model) {
        model.validate();
      }

      return qb;
    }
  }, {
    key: 'afterQuery',
    value: function afterQuery(res) {
      if (!this.options.afterQuery) return res;

      if (res instanceof _modelBase2.default) {
        res.validate();
      }

      return res;
    }
  }]);
  return ValidationPlugin;
}(_pluginBase2.default);
//# sourceMappingURL=plugins.js.map