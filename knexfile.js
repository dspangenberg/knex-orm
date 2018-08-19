module.exports = {
  development: {
    client: 'sqlite3',
    debug: true,
    useNullAsDefault: true,
    rqliteConnection: 'http://localhost:4001',
/*
    connection: {
      filename: './dev.sqlite3',
    },
*/
    migrations: {
      directory: './db/migrations',
    },
    seeds: {
      directory: './db/seeds',
    },
  },
};
