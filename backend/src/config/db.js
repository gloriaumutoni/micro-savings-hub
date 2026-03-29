'use strict';

const { Pool } = require('pg');

const ssl = process.env.DATABASE_URL?.includes('sslmode=disable')
  ? false
  : { rejectUnauthorized: false };

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle pg client', err);
  process.exit(-1);
});

module.exports = pool;
