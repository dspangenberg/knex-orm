'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _methods = require('knex/lib/query/methods');

var _methods2 = _interopRequireDefault(_methods);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var KNEX_IGNORED_QUERY_METHODS = ['from', 'fromJS', 'into', 'table', 'queryBuilder'];

var Config = {
  KNEX_ALLOWED_QUERY_METHODS: _methods2.default.filter(function (item) {
    return KNEX_IGNORED_QUERY_METHODS.indexOf(item) < 0;
  })
};

exports.default = Config;
//# sourceMappingURL=config.js.map