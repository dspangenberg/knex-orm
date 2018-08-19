'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ValidationError = exports.UnidentifiedModelError = exports.RelationError = exports.EmptyModelError = exports.DuplicateModelError = undefined;

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _es6Error = require('es6-error');

var _es6Error2 = _interopRequireDefault(_es6Error);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * An error which gets thrown when an attempt is made to register a Model
 * multiple times.
 */
var DuplicateModelError = exports.DuplicateModelError = function (_ErrorBase) {
  (0, _inherits3.default)(DuplicateModelError, _ErrorBase);

  function DuplicateModelError(name) {
    (0, _classCallCheck3.default)(this, DuplicateModelError);

    var _this = (0, _possibleConstructorReturn3.default)(this, (DuplicateModelError.__proto__ || (0, _getPrototypeOf2.default)(DuplicateModelError)).call(this, 'Model with name \'' + name + '\' cannot be registered multiple times'));

    _this.name = name;
    return _this;
  }
  /**
   * Name of the Model in question.
   * @type {string}
   * @memberof DuplicateModelError
   * @instance
   */


  return DuplicateModelError;
}(_es6Error2.default);

/**
 * An error which gets thrown when an attempt is made to store an empty Model.
 */


var EmptyModelError = exports.EmptyModelError = function (_ErrorBase2) {
  (0, _inherits3.default)(EmptyModelError, _ErrorBase2);

  function EmptyModelError() {
    (0, _classCallCheck3.default)(this, EmptyModelError);
    return (0, _possibleConstructorReturn3.default)(this, (EmptyModelError.__proto__ || (0, _getPrototypeOf2.default)(EmptyModelError)).call(this, 'Empty Model cannot be stored'));
  }

  return EmptyModelError;
}(_es6Error2.default);

/**
 * An error which gets thrown when a Relation does not behave as expected.
 */


var RelationError = exports.RelationError = function (_ErrorBase3) {
  (0, _inherits3.default)(RelationError, _ErrorBase3);

  function RelationError() {
    (0, _classCallCheck3.default)(this, RelationError);
    return (0, _possibleConstructorReturn3.default)(this, (RelationError.__proto__ || (0, _getPrototypeOf2.default)(RelationError)).call(this, 'One-to-one and many-to-one Relations cannot be re-assigned'));
  }

  return RelationError;
}(_es6Error2.default);

/**
 * An error which gets thrown when an attempt is made to modify a Model instance
 * without specifying its primary key.
 */


var UnidentifiedModelError = exports.UnidentifiedModelError = function (_ErrorBase4) {
  (0, _inherits3.default)(UnidentifiedModelError, _ErrorBase4);

  function UnidentifiedModelError() {
    (0, _classCallCheck3.default)(this, UnidentifiedModelError);
    return (0, _possibleConstructorReturn3.default)(this, (UnidentifiedModelError.__proto__ || (0, _getPrototypeOf2.default)(UnidentifiedModelError)).call(this, 'Model cannot be identified without specifying a primary key value'));
  }

  return UnidentifiedModelError;
}(_es6Error2.default);

/**
 * An error which gets thrown when a Model cannot be successfully validated
 * against its JSON Schema.
 */


var ValidationError = exports.ValidationError = function (_ErrorBase5) {
  (0, _inherits3.default)(ValidationError, _ErrorBase5);

  function ValidationError(data) {
    (0, _classCallCheck3.default)(this, ValidationError);

    var _this5 = (0, _possibleConstructorReturn3.default)(this, (ValidationError.__proto__ || (0, _getPrototypeOf2.default)(ValidationError)).call(this, 'Model could not be successfully validated against its JSON Schema'));

    _this5.data = data;
    return _this5;
  }
  /**
   * Detailed information about why the validation has failed.
   * @type {?Object}
   * @memberof ValidationError
   * @instance
   */


  return ValidationError;
}(_es6Error2.default);
//# sourceMappingURL=errors.js.map