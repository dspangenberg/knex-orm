'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperties = require('babel-runtime/core-js/object/define-properties');

var _defineProperties2 = _interopRequireDefault(_defineProperties);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _ajv = require('ajv');

var _ajv2 = _interopRequireDefault(_ajv);

var _inflection = require('inflection');

var _queryBuilder = require('./query-builder');

var _queryBuilder2 = _interopRequireDefault(_queryBuilder);

var _relation = require('./relation');

var _relation2 = _interopRequireDefault(_relation);

var _relationType = require('./enums/relation-type');

var _relationType2 = _interopRequireDefault(_relationType);

var _errors = require('./errors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Base Model class which should be used as an extension for database entities.
 */
var ModelBase = function () {
  (0, _createClass3.default)(ModelBase, null, [{
    key: 'register',


    /**
     * Registers this static Model object to the list of database objects.
     * @param {string} [name] Name under which the Model shall be registered.
     * @throws {DuplicateModelError}
     * @returns {Model} The current Model.
     */
    value: function register(name) {
      // Clone Knex and initialize plugins
      this.knex = (0, _assign2.default)({}, this.knex);
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = (0, _getIterator3.default)(this.plugins), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var plugin = _step.value;

          plugin.init(this);
        }

        // Determine the Model's name and then check if it's already registered
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

      var modelName = name || this.name;
      if ((0, _keys2.default)(this.registry).indexOf(modelName) >= 0) {
        throw new _errors.DuplicateModelError(modelName);
      }

      this.registry[modelName] = this;
      return this;
    }

    /**
     * Returns a new QueryBuilder instance which corresponds to the current Model.
     * @returns {QueryBuilder}
     */

  }, {
    key: 'query',
    value: function query() {
      return new _queryBuilder2.default(this);
    }

    /**
     * Creates a one-to-one relation between the current Model and a target.
     * @param {string|Model} Target Name or static reference to the joinable
     * table's Model.
     * @param {string} [foreignKey] Foreign key in the target Model.
     * @returns {Relation}
     */

  }, {
    key: 'hasOne',
    value: function hasOne(Target, foreignKey) {
      return new _relation2.default(this, Target, _relationType2.default.ONE_TO_ONE, foreignKey);
    }

    /**
     * Creates a one-to-many relation between the current Model and a target.
     * @param {string|Model} Target Name or static reference to the joinable
     * table's Model.
     * @param {string} [foreignKey] Foreign key in the target Model.
     * @returns {Relation}
     */

  }, {
    key: 'hasMany',
    value: function hasMany(Target, foreignKey) {
      return new _relation2.default(this, Target, _relationType2.default.ONE_TO_MANY, foreignKey);
    }

    /**
     * Creates a many-to-one relation between the current Model and a target.
     * @param {string|Model} Target Name or static reference to the joinable
     * table's Model.
     * @param {string} [foreignKey] Foreign key in this Model.
     * @returns {Relation}
     */

  }, {
    key: 'belongsTo',
    value: function belongsTo(Target, foreignKey) {
      return new _relation2.default(this, Target, _relationType2.default.MANY_TO_ONE, foreignKey);
    }

    /**
     * Creates a new Model instance.
     * @param {Object} [props={}] Initial properties of the instance.
     * @param {boolean} [isNew=true] True if the instance is not yet stored
     * persistently in the database.
     */

  }, {
    key: 'tableName',


    /**
     * Case-sensitive name of the database table which corresponds to the Model.
     * @type {string}
     */


    /**
     * Plugins to be used for the current ORM instance.
     * @type {Object[]}
     * @memberof ModelBase
     * @static
     */
    get: function get() {
      return (0, _inflection.tableize)(this.name);
    }

    /**
     * Primary key of the Model, used for instance identification.
     * @type {string}
     */

    /**
     * Knex client corresponding to the current ORM instance.
     * @type {Object}
     * @memberof ModelBase
     * @static
     */

  }, {
    key: 'primaryKey',
    get: function get() {
      return 'id';
    }

    /**
     * List of properties which should exclusively be present in database
     * entities. If the list is empty, then every enumerable property of the
     * instance are considered to be database entities.
     * @type {string[]}
     */

  }, {
    key: 'whitelistedProps',
    get: function get() {
      return [];
    }

    /**
     * List of properties which shall not be present in database entities. The
     * blacklist takes precedence over any whitelist rule.
     * @type {string[]}
     */

  }, {
    key: 'blacklistedProps',
    get: function get() {
      return [];
    }

    /**
     * JSON Schema to be used for validating instances of the Model. Validation
     * happens automatically before executing queries.
     * @type{?Object}
     */

  }, {
    key: 'jsonSchema',
    get: function get() {
      return null;
    }
  }]);

  function ModelBase() {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var isNew = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    (0, _classCallCheck3.default)(this, ModelBase);

    // Set the initial properties of the instance
    (0, _assign2.default)(this, props);

    // Initialize a store for old properties of the instance
    (0, _defineProperties2.default)(this, {
      isNew: {
        value: isNew
      },
      oldProps: {
        value: isNew ? {} : (0, _assign2.default)({}, props),
        writable: true
      }
    });
  }

  /**
   * Validates all the enumerable properties of the current instance.
   * @throws {ValidationError}
   */


  (0, _createClass3.default)(ModelBase, [{
    key: 'validate',
    value: function validate() {
      var schema = this.constructor.jsonSchema;
      if (!schema) return; // The Model is valid if no schema is given

      var ajv = new _ajv2.default();
      if (!ajv.validate(schema, this)) {
        throw new _errors.ValidationError(ajv.errors);
      }
    }

    /**
     * Queues fetching the given related Models of the current instance.
     * @param {...string} props Relation attributes to be fetched.
     * @returns {QueryBuilder}
     */

  }, {
    key: 'fetchRelated',
    value: function fetchRelated() {
      var qb = this.getQueryBuilder();
      if (!qb) throw new _errors.UnidentifiedModelError();

      return qb.withRelated.apply(qb, arguments);
    }

    /**
     * Queues the deletion of the current Model from the database.
     * @throws {UnidentifiedModelError}
     * @returns {QueryBuilder}
     */

  }, {
    key: 'del',
    value: function del() {
      var qb = this.getQueryBuilder();
      if (!qb) throw new _errors.UnidentifiedModelError();

      return qb.del();
    }

    /**
     * Queues saving (creating or updating) the current Model in the database.
     * @throws {EmptyModelError}
     * @returns {QueryBuilder}
     */

  }, {
    key: 'save',
    value: function save() {
      var _this = this;

      var qb = this.getQueryBuilder();
      var changedProps = {};

      // By default, save only the whitelisted properties, but if none is present,
      // then save every property. Use the blacklist for filtering the results.
      var savablePropNames = (this.constructor.whitelistedProps.length > 0 ? this.constructor.whitelistedProps : (0, _keys2.default)(this)).filter(function (propName) {
        return _this.constructor.blacklistedProps.indexOf(propName) < 0;
      });

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = (0, _getIterator3.default)(savablePropNames), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var propName = _step2.value;

          var oldValue = this.oldProps[propName];
          var newValue = this[propName];

          // New and modified properties must be updated
          if (oldValue === undefined || newValue !== oldValue) {
            changedProps[propName] = newValue;
          }
        }

        // Don't run unnecessary queries
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

      if ((0, _keys2.default)(changedProps).length === 0) {
        if (!qb) throw new _errors.EmptyModelError();

        return qb;
      }

      // Update the Model's old properties with the new ones
      (0, _assign2.default)(this.oldProps, changedProps);

      // Insert or update the current instance in the database
      return qb ? qb.update(changedProps) : this.constructor.query().insert(changedProps);
    }

    /**
     * @returns {?QueryBuilder}
     * @private
     */

  }, {
    key: 'getQueryBuilder',
    value: function getQueryBuilder() {
      if (this.isNew) return null;

      return new _queryBuilder2.default(this.constructor, this);
    }
  }]);
  return ModelBase;
}();

ModelBase.plugins = [];
ModelBase.registry = [];
exports.default = ModelBase;
//# sourceMappingURL=model-base.js.map