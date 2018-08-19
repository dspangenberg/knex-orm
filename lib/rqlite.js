'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

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
    key: 'migrations',
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
        var knex, employeesSql, companySql;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
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
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function migrations() {
        return _ref2.apply(this, arguments);
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
      var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(connectionString, sql) {
        var method, res, results, error, data;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return this.connect(connectionString);

              case 2:
                method = this.getMethod(sql);
                _context3.prev = 3;
                _context3.next = 6;
                return method(sql);

              case 6:
                res = _context3.sent;
                results = res.body.results;
                error = (0, _results.getError)(results);

                if (!error) {
                  _context3.next = 11;
                  break;
                }

                return _context3.abrupt('return', _promise2.default.reject(error));

              case 11:
                data = (0, _results.toPlainJs)(results);
                return _context3.abrupt('return', _promise2.default.resolve(data));

              case 15:
                _context3.prev = 15;
                _context3.t0 = _context3['catch'](3);
                return _context3.abrupt('return', _promise2.default.reject(_context3.t0));

              case 18:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this, [[3, 15]]);
      }));

      function exec(_x2, _x3) {
        return _ref3.apply(this, arguments);
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