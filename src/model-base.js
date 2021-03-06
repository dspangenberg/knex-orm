import Ajv from 'ajv';
import { tableize } from 'inflection';
import QueryBuilder from './query-builder';
import Relation from './relation';
import RelationType from './enums/relation-type';
import {
  DuplicateModelError,
  EmptyModelError,
  UnidentifiedModelError,
  ValidationError,
} from './errors';

/**
 * Base Model class which should be used as an extension for database entities.
 */
export default class ModelBase {
  /**
   * Knex client corresponding to the current ORM instance.
   * @type {Object}
   * @memberof ModelBase
   * @static
   */
  static knex;

  /**
   * Plugins to be used for the current ORM instance.
   * @type {Object[]}
   * @memberof ModelBase
   * @static
   */
  static plugins = [];

  static registry = [];

  /**
   * Case-sensitive name of the database table which corresponds to the Model.
   * @type {string}
   */
  static get tableName() { return tableize(this.name); }

  /**
   * Primary key of the Model, used for instance identification.
   * @type {string}
   */
  static get primaryKey() { return 'id'; }

  /**
   * List of properties which should exclusively be present in database
   * entities. If the list is empty, then every enumerable property of the
   * instance are considered to be database entities.
   * @type {string[]}
   */
  static get whitelistedProps() { return []; }

  /**
   * List of properties which shall not be present in database entities. The
   * blacklist takes precedence over any whitelist rule.
   * @type {string[]}
   */
  static get blacklistedProps() { return []; }

  /**
   * JSON Schema to be used for validating instances of the Model. Validation
   * happens automatically before executing queries.
   * @type{?Object}
   */
  static get jsonSchema() { return null; }

  /**
   * Registers this static Model object to the list of database objects.
   * @param {string} [name] Name under which the Model shall be registered.
   * @throws {DuplicateModelError}
   * @returns {Model} The current Model.
   */
  static register(name) {
    // Clone Knex and initialize plugins
    this.knex = Object.assign({}, this.knex);
    for (const plugin of this.plugins) {
      plugin.init(this);
    }

    // Determine the Model's name and then check if it's already registered
    const modelName = name || this.name;
    if (Object.keys(this.registry).indexOf(modelName) >= 0) {
      throw new DuplicateModelError(modelName);
    }

    this.registry[modelName] = this;
    return this;
  }

  /**
   * Returns a new QueryBuilder instance which corresponds to the current Model.
   * @returns {QueryBuilder}
   */
  static query() {
    return new QueryBuilder(this);
  }

  /**
   * Creates a one-to-one relation between the current Model and a target.
   * @param {string|Model} Target Name or static reference to the joinable
   * table's Model.
   * @param {string} [foreignKey] Foreign key in the target Model.
   * @returns {Relation}
   */
  static hasOne(Target, foreignKey) {
    return new Relation(this, Target, RelationType.ONE_TO_ONE, foreignKey);
  }

  /**
   * Creates a one-to-many relation between the current Model and a target.
   * @param {string|Model} Target Name or static reference to the joinable
   * table's Model.
   * @param {string} [foreignKey] Foreign key in the target Model.
   * @returns {Relation}
   */
  static hasMany(Target, foreignKey) {
    return new Relation(this, Target, RelationType.ONE_TO_MANY, foreignKey);
  }

  /**
   * Creates a many-to-one relation between the current Model and a target.
   * @param {string|Model} Target Name or static reference to the joinable
   * table's Model.
   * @param {string} [foreignKey] Foreign key in this Model.
   * @returns {Relation}
   */
  static belongsTo(Target, foreignKey) {
    return new Relation(this, Target, RelationType.MANY_TO_ONE, foreignKey);
  }

  /**
   * Creates a new Model instance.
   * @param {Object} [props={}] Initial properties of the instance.
   * @param {boolean} [isNew=true] True if the instance is not yet stored
   * persistently in the database.
   */
  constructor(props = {}, isNew = true) {
    // Set the initial properties of the instance
    Object.assign(this, props);

    // Initialize a store for old properties of the instance
    Object.defineProperties(this, {
      isNew: {
        value: isNew,
      },
      oldProps: {
        value: isNew ? {} : Object.assign({}, props),
        writable: true,
      },
    });
  }

  /**
   * Validates all the enumerable properties of the current instance.
   * @throws {ValidationError}
   */
  validate() {
    const schema = this.constructor.jsonSchema;
    if (!schema) return; // The Model is valid if no schema is given

    const ajv = new Ajv();
    if (!ajv.validate(schema, this)) {
      throw new ValidationError(ajv.errors);
    }
  }

  /**
   * Queues fetching the given related Models of the current instance.
   * @param {...string} props Relation attributes to be fetched.
   * @returns {QueryBuilder}
   */
  fetchRelated(...props) {
    const qb = this.getQueryBuilder();
    if (!qb) throw new UnidentifiedModelError();

    return qb.withRelated(...props);
  }

  /**
   * Queues the deletion of the current Model from the database.
   * @throws {UnidentifiedModelError}
   * @returns {QueryBuilder}
   */
  del() {
    const qb = this.getQueryBuilder();
    if (!qb) throw new UnidentifiedModelError();

    return qb.del();
  }

  /**
   * Queues saving (creating or updating) the current Model in the database.
   * @throws {EmptyModelError}
   * @returns {QueryBuilder}
   */
  save() {
    const qb = this.getQueryBuilder();
    const changedProps = {};

    // By default, save only the whitelisted properties, but if none is present,
    // then save every property. Use the blacklist for filtering the results.
    const savablePropNames = (
      this.constructor.whitelistedProps.length > 0 ?
      this.constructor.whitelistedProps :
      Object.keys(this)
    ).filter((propName) =>
      this.constructor.blacklistedProps.indexOf(propName) < 0
    );

    for (const propName of savablePropNames) {
      const oldValue = this.oldProps[propName];
      const newValue = this[propName];

      // New and modified properties must be updated
      if (oldValue === undefined || newValue !== oldValue) {
        changedProps[propName] = newValue;
      }
    }

    // Don't run unnecessary queries
    if (Object.keys(changedProps).length === 0) {
      if (!qb) throw new EmptyModelError();

      return qb;
    }

    // Update the Model's old properties with the new ones
    Object.assign(this.oldProps, changedProps);

    // Insert or update the current instance in the database
    return qb ?
      qb.update(changedProps) :
      this.constructor.query().insert(changedProps);
  }

  /**
   * @returns {?QueryBuilder}
   * @private
   */
  getQueryBuilder() {
    if (this.isNew) return null;

    return new QueryBuilder(this.constructor, this);
  }
}
