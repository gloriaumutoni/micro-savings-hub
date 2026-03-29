'use strict';

const { Pool } = require('pg');

function buildPoolConfig(databaseUrl) {
  if (!databaseUrl) return {};
  const url = new URL(databaseUrl);
  const useSSL = url.searchParams.get('sslmode') !== 'disable';
  url.searchParams.delete('sslmode');
  url.searchParams.delete('channel_binding');
  return {
    connectionString: url.toString(),
    ssl: useSSL ? { rejectUnauthorized: false } : false,
  };
}

const pool = new Pool(buildPoolConfig(process.env.DATABASE_URL));

pool.on('error', (err) => {
  console.error('Unexpected error on idle pg client', err);
  process.exit(-1);
});

module.exports = pool;
