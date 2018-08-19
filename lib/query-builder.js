'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _entries = require('babel-runtime/core-js/object/entries');

var _entries2 = _interopRequireDefault(_entries);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _utils = require('./utils');

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _rqlite = require('./rqlite');

var _rqlite2 = _interopRequireDefault(_rqlite);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Represents a query builder which corresponds to a static Model reference.
 * Inherits every query method of the Knex query builder.
 */
var QueryBuilder = function () {
  function QueryBuilder(StaticModel, modelInstance) {
    (0, _classCallCheck3.default)(this, QueryBuilder);

    this.StaticModel = StaticModel;
    this.modelInstance = modelInstance;

    this.includedRelations = new _set2.default();
    this.knexInstance = StaticModel.knex.from(StaticModel.tableName);
    if (modelInstance) {
      var props = {};
      if (Array.isArray(StaticModel.primaryKey)) {
        // Handle composite primary keys
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = (0, _getIterator3.default)(StaticModel.primaryKey), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var prop = _step.value;

            props[prop] = modelInstance.oldProps[prop] || modelInstance[prop];
          }
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
      } else {
        // Handle single primary key
        var _prop = StaticModel.primaryKey;
        props[_prop] = modelInstance.oldProps[_prop] || modelInstance[_prop];
      }

      // Filter to the given model instance
      this.knexInstance = this.knexInstance.where(props).first();
    }
  }

  /**
   * Queues fetching the given related Models of the queryable instance(s).
   * @param {...string} props Relation attributes to be fetched.
   * @returns {QueryBuilder}
   */


  (0, _createClass3.default)(QueryBuilder, [{
    key: 'withRelated',
    value: function withRelated() {
      for (var _len = arguments.length, props = Array(_len), _key = 0; _key < _len; _key++) {
        props[_key] = arguments[_key];
      }

      var relationNames = (0, _utils.flattenArray)(props);
      var relationEntries = (0, _entries2.default)(this.StaticModel.related);

      // Filter the given relations by name if necessary
      if (relationNames.length > 0) {
        relationEntries.filter(function (_ref) {
          var _ref2 = (0, _slicedToArray3.default)(_ref, 1),
              name = _ref2[0];

          return relationNames.indexOf(name) >= 0;
        });
      }

      // Store the filtered relations
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = (0, _getIterator3.default)(relationEntries), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var _step2$value = (0, _slicedToArray3.default)(_step2.value, 2),
              name = _step2$value[0],
              relation = _step2$value[1];

          relation.name = name;
          this.includedRelations.add(relation);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      return this;
    }

    /**
     * Executes the query.
     * @param {Function<Object>} [onFulfilled] Success handler function.
     * @param {Function<Object>} [onRejected] Error handler function.
     * @returns {Promise<Object>}
     */

  }, {
    key: 'then',
    value: function then() {
      var onFulfilled = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};
      var onRejected = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};

      // Apply the effect of plugins
      var qb = this;
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = (0, _getIterator3.default)(this.StaticModel.plugins), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var plugin = _step3.value;

          qb = plugin.beforeQuery(qb);
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      var result = void 0;

      var sql = qb.knexInstance.toString();
      var connection = qb.knexInstance.client.config.rqliteConnection;
      return _rqlite2.default.exec(connection, sql).then(function (res) {
        var awaitableQueries = [];
        result = res;
        // Convert the result to a specific Model type if necessary
        result = (0, _utils.modelize)(result, qb.StaticModel);

        // Apply each desired relation to the original result
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
          for (var _iterator4 = (0, _getIterator3.default)(qb.includedRelations), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var relation = _step4.value;

            awaitableQueries.push(relation.applyAsync(result));
          }
        } catch (err) {
          _didIteratorError4 = true;
          _iteratorError4 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion4 && _iterator4.return) {
              _iterator4.return();
            }
          } finally {
            if (_didIteratorError4) {
              throw _iteratorError4;
            }
          }
        }

        return _promise2.default.all(awaitableQueries);
      }).then(function () {
        // Apply the effect of plugins
        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;
        var _iteratorError5 = undefined;

        try {
          for (var _iterator5 = (0, _getIterator3.default)(qb.StaticModel.plugins), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            var plugin = _step5.value;

            result = plugin.afterQuery(result);
          }
        } catch (err) {
          _didIteratorError5 = true;
          _iteratorError5 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion5 && _iterator5.return) {
              _iterator5.return();
            }
          } finally {
            if (_didIteratorError5) {
              throw _iteratorError5;
            }
          }
        }

        return result;
      }).then(onFulfilled, onRejected);
    }

    /**
     * Gets the list of raw queries to be executed, joined by a string separator.
     * @param {string} [separator=\n] Separator string to be used for joining
     * multiple raw query strings.
     * @returns {string}
     */

  }, {
    key: 'toString',
    value: function toString() {
      var separator = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '\n';

      // Apply the effect of plugins
      var qb = this;
      var _iteratorNormalCompletion6 = true;
      var _didIteratorError6 = false;
      var _iteratorError6 = undefined;

      try {
        for (var _iterator6 = (0, _getIterator3.default)(this.StaticModel.plugins), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
          var plugin = _step6.value;

          qb = plugin.beforeQuery(qb);
        }

        // Return a list of query strings to be executed, including Relations
      } catch (err) {
        _didIteratorError6 = true;
        _iteratorError6 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion6 && _iterator6.return) {
            _iterator6.return();
          }
        } finally {
          if (_didIteratorError6) {
            throw _iteratorError6;
          }
        }
      }

      var result = [qb.knexInstance.toString()];
      var _iteratorNormalCompletion7 = true;
      var _didIteratorError7 = false;
      var _iteratorError7 = undefined;

      try {
        for (var _iterator7 = (0, _getIterator3.default)(qb.includedRelations), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
          var relation = _step7.value;

          // Create the relation query with an empty array of Models
          result.push(relation.createQuery([]).toString());
        }
      } catch (err) {
        _didIteratorError7 = true;
        _iteratorError7 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion7 && _iterator7.return) {
            _iterator7.return();
          }
        } finally {
          if (_didIteratorError7) {
            throw _iteratorError7;
          }
        }
      }

      return result.join(separator);
    }
  }]);
  return QueryBuilder;
}();

// Inherit Knex query methods


exports.default = QueryBuilder;
var _iteratorNormalCompletion8 = true;
var _didIteratorError8 = false;
var _iteratorError8 = undefined;

try {
  var _loop = function _loop() {
    var method = _step8.value;

    QueryBuilder.prototype[method] = function queryMethod() {
      var _knexInstance;

      // Update Knex state
      this.knexInstance = (_knexInstance = this.knexInstance)[method].apply(_knexInstance, arguments);
      return this;
    };
  };

  for (var _iterator8 = (0, _getIterator3.default)(_config2.default.KNEX_ALLOWED_QUERY_METHODS), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
    _loop();
  }
} catch (err) {
  _didIteratorError8 = true;
  _iteratorError8 = err;
} finally {
  try {
    if (!_iteratorNormalCompletion8 && _iterator8.return) {
      _iterator8.return();
    }
  } finally {
    if (_didIteratorError8) {
      throw _iteratorError8;
    }
  }
}
//# sourceMappingURL=query-builder.js.map