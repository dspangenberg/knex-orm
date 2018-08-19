'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _results = require('rqlite-js/lib/api/results');

var _knex = require('knex');

var _knex2 = _interopRequireDefault(_knex);

var _client = require('rqlite-js/lib/api/data/client');

var _client2 = _interopRequireDefault(_client);

var _employees = require('../db/seeds/employees');

var _employees2 = _interopRequireDefault(_employees);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var rqliteAdapter = function () {
  function rqliteAdapter() {
    (0, _classCallCheck3.default)(this, rqliteAdapter);
  }

  (0, _createClass3.default)(rqliteAdapter, null, [{
    key: 'connect',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(connectionString) {
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return (0, _client2.default)(connectionString);

              case 2:
                this.api = _context.sent;

              case 3:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function connect(_x) {
        return _ref.apply(this, arguments);
      }

      return connect;
    }()
  }, {
    key: 'seeds',
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
        var knex, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, employee, sql;

        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                knex = new _knex2.default({
                  client: 'sqlite3',
                  debug: true,
                  useNullAsDefault: true
                });
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context2.prev = 4;


                for (_iterator = (0, _getIterator3.default)(_employees2.default); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                  employee = _step.value;
                  sql = knex('employees').insert(employee);

                  console.log(sql.toString());
                }
                _context2.next = 12;
                break;

              case 8:
                _context2.prev = 8;
                _context2.t0 = _context2['catch'](4);
                _didIteratorError = true;
                _iteratorError = _context2.t0;

              case 12:
                _context2.prev = 12;
                _context2.prev = 13;

                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }

              case 15:
                _context2.prev = 15;

                if (!_didIteratorError) {
                  _context2.next = 18;
                  break;
                }

                throw _iteratorError;

              case 18:
                return _context2.finish(15);

              case 19:
                return _context2.finish(12);

              case 20:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this, [[4, 8, 12, 20], [13,, 15, 19]]);
      }));

      function seeds() {
        return _ref2.apply(this, arguments);
      }

      return seeds;
    }()
  }, {
    key: 'migrations',
    value: function () {
      var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
        var knex, employeesSql, companySql;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                knex = new _knex2.default({
                  client: 'sqlite3',
                  debug: true,
                  useNullAsDefault: true
                });
                employeesSql = knex.schema.createTable('employees', function (table) {
                  table.increments().primary();
                  table.timestamps();

                  table.integer('company_id').unsigned().references('companies.rank');

                  table.string('name').notNullable();
                  table.date('birth_date').notNullable();
                  table.integer('zip_code').unsigned();
                });

                console.log(employeesSql.toString());
                companySql = knex.schema.createTable('companies', function (table) {
                  table.increments('rank').primary();

                  table.string('name').notNullable();
                  table.string('email').unique();
                });

                console.log(companySql.toString());

              case 5:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function migrations() {
        return _ref3.apply(this, arguments);
      }

      return migrations;
    }()
  }, {
    key: 'getMethod',
    value: function getMethod(sql) {
      var api = this.api;
      var lowerSql = sql.toLowerCase();
      if (lowerSql.startsWith('insert')) {
        return api.insert;
      }
      if (lowerSql.startsWith('update')) {
        return api.update;
      }
      if (lowerSql.startsWith('delete')) {
        return api.delete;
      }
      if (lowerSql.startsWith('create')) {
        return api.table.create;
      }
      if (lowerSql.startsWith('drop')) {
        return api.table.drop;
      }
      return api.select;
    }
  }, {
    key: 'exec',
    value: function () {
      var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(connectionString, sql) {
        var method, res, results, error, data;
        return _regenerator2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                console.log(sql);
                _context4.next = 3;
                return this.connect(connectionString);

              case 3:
                method = this.getMethod(sql);
                _context4.prev = 4;
                _context4.next = 7;
                return method(sql);

              case 7:
                res = _context4.sent;
                results = res.body.results;
                error = (0, _results.getError)(results);

                if (!error) {
                  _context4.next = 12;
                  break;
                }

                return _context4.abrupt('return', _promise2.default.reject(error));

              case 12:
                data = (0, _results.toPlainJs)(results);
                return _context4.abrupt('return', _promise2.default.resolve(data));

              case 16:
                _context4.prev = 16;
                _context4.t0 = _context4['catch'](4);
                return _context4.abrupt('return', _promise2.default.reject(_context4.t0));

              case 19:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this, [[4, 16]]);
      }));

      function exec(_x2, _x3) {
        return _ref4.apply(this, arguments);
      }

      return exec;
    }()
  }, {
    key: 'connectionString',
    get: function get() {
      return this.connectionString;
    },
    set: function set(connectionString) {
      this.connectionString = connectionString;
    }
  }]);
  return rqliteAdapter;
}();

exports.default = rqliteAdapter;
//# sourceMappingURL=rqlite.js.map