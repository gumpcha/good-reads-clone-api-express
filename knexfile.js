module.exports = {
  development: {
    client: 'pg',
    connection: {
        host: 'localhost',
        port: 5432,
        database: 'postgres',
    }
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
  },
};

