'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _inflection = require('inflection');

var _relationType = require('./enums/relation-type');

var _relationType2 = _interopRequireDefault(_relationType);

var _errors = require('./errors');

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Represents a relation between Models.
 * @private
 */
var Relation = function () {

  /**
   * Type of the relation between Origin and Target.
   * @type {RelationType}
   * @memberof Relation
   * @instance
   */

  /**
   * Static Model object which shall be joined with the target.
   * @type {Model}
   * @memberof Relation
   * @instance
   */
  function Relation(Origin, Target, type, foreignKey) {
    (0, _classCallCheck3.default)(this, Relation);

    this.Origin = Origin;

    // Get the target's registered Model if target is a string
    var modelRegistry = Origin.registry;
    this.Target = typeof Target === 'string' ? modelRegistry[Target] : Target;

    this.type = type;
    if (foreignKey) this.foreignKey = foreignKey;
  }

  /**
   * The attribute which points to the primary key of the joinable database
   * table.
   * @type {string}
   */


  /**
   * Name of the Relation.
   * @type {string}
   * @memberof Relation
   * @instance
   */


  /**
   * Static Model object which corresponds to the origin.
   * @type {Model}
   * @memberof Relation
   * @instance
   */


  (0, _createClass3.default)(Relation, [{
    key: 'through',


    /**
     * Creates a many-to-many Relation from a one-to many Relation.
     * @param {string|Model} Interim Name or static reference to the pivot Model.
     * @param {string} [foreignKey] Foreign key in this Model.
     * @param {string} [otherKey] Foreign key in the Interim Model.
     * @returns {Relation}
     */
    value: function through(Interim, foreignKey, otherKey) {
      // eslint-disable-line
      // TODO
      return this;
    }

    /**
     * Creates a query based on the given origin Model instances.
     * @param {Object[]} originInstances Origin Model instances.
     * @returns {QueryBuilder}
     */

  }, {
    key: 'createQuery',
    value: function createQuery(originInstances) {
      var OriginAttribute = this.OriginAttribute,
          TargetAttribute = this.TargetAttribute;


      return this.Target.query().whereIn(OriginAttribute, originInstances.length > 0 ? // Pass a mock value if necessary
      originInstances.map(function (model) {
        return model[TargetAttribute];
      }) : ['originInstance.' + TargetAttribute]);
    }

    /**
     * Applies the relation by executing subqueries on the origin Model instances.
     * @param {...Object} originInstances Origin Model instances.
     * @throws {RelationError}
     * @returns {Promise}
     */

  }, {
    key: 'applyAsync',
    value: function applyAsync() {
      var _this = this;

      for (var _len = arguments.length, originInstances = Array(_len), _key = 0; _key < _len; _key++) {
        originInstances[_key] = arguments[_key];
      }

      var models = (0, _utils.flattenArray)(originInstances);
      var OriginAttribute = this.OriginAttribute,
          TargetAttribute = this.TargetAttribute;

      // Create and then execute the query, handling Model bindings

      return this.createQuery(models).then(function (relatedModels) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          var _loop = function _loop() {
            var relatedModel = _step.value;

            // Pair up the related Model with its origin
            var foreignValue = relatedModel[OriginAttribute];
            var originInstance = models.find(function (model) {
              return model[TargetAttribute] === foreignValue;
            });

            if (originInstance) {
              if (originInstance[_this.name] === undefined) {
                // Initially set the origin's related property
                if (_this.type === _relationType2.default.ONE_TO_MANY) {
                  originInstance[_this.name] = [relatedModel];
                } else {
                  originInstance[_this.name] = relatedModel;
                }
              } else {
                // Modify the origin instance's related property if possible
                if (_this.type === _relationType2.default.ONE_TO_MANY) {
                  originInstance[_this.name].push(relatedModel);
                } else {
                  throw new _errors.RelationError();
                }
              }
            }
          };

          for (var _iterator = (0, _getIterator3.default)(relatedModels), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            _loop();
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
      });
    }
  }, {
    key: 'foreignKey',
    get: function get() {
      // Set the foreign key deterministically
      return this.isTypeFromOne ? (0, _inflection.underscore)(this.Origin.name) + '_id' : (0, _inflection.underscore)(this.Target.name) + '_id';
    }
  }, {
    key: 'OriginAttribute',
    get: function get() {
      return this.isTypeFromOne ? this.foreignKey : this.Target.primaryKey;
    }
  }, {
    key: 'TargetAttribute',
    get: function get() {
      return this.isTypeFromOne ? this.Origin.primaryKey : this.foreignKey;
    }
  }, {
    key: 'isTypeFromOne',
    get: function get() {
      return [_relationType2.default.MANY_TO_ONE, _relationType2.default.MANY_TO_MANY].indexOf(this.type) < 0;
    }
  }]);
  return Relation;
}();

exports.default = Relation;
//# sourceMappingURL=relation.js.map