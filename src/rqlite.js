import { getError, toPlainJs } from 'rqlite-js/lib/api/results';

import Knex from 'knex'
import connect from 'rqlite-js/lib/api/data/client';
import employees from '../db/seeds/employees'

export default class rqliteAdapter {

  static get connectionString() {
    return this.connectionString;
  }

  static set connectionString(connectionString) {
    this.connectionString = connectionString;
  }

  static async connect(connectionString) {
    this.api = await connect(connectionString);
  }


  static async seeds() {

    const knex = new Knex({
      client: 'sqlite3',
      debug: true,
      useNullAsDefault: true,
    });

    for (const employee of employees) {
      const sql = knex('employees').insert(employee)
      console.log(sql.toString())
    }
  }

  static async migrations() {

    const knex = new Knex({
      client: 'sqlite3',
      debug: true,
      useNullAsDefault: true,
    });

    const employeesSql = knex.schema.createTable('employees', (table) => {
      table.increments().primary();
      table.timestamps();

      table.integer('company_id').unsigned().references('companies.rank');

      table.string('name').notNullable();
      table.date('birth_date').notNullable();
      table.integer('zip_code').unsigned();
    })
    console.log(employeesSql.toString());
    const companySql = knex.schema.createTable('companies', (table) => {
      table.increments('rank').primary();

      table.string('name').notNullable();
      table.string('email').unique();
    });
    console.log(companySql.toString());
  }

  static getMethod(sql) {
    const api = this.api;
    const lowerSql = sql.toLowerCase();
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

  static async exec(connectionString, sql) {
    console.log(sql)
    await this.connect(connectionString);
    const method = this.getMethod(sql);
    try {
      const res = await method(sql);
      const results = res.body.results;
      const error = getError(results);
      if (error) {
        return Promise.reject(error);
      }
      const data = toPlainJs(results);
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
