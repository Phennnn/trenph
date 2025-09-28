const { Pool } = require('pg');

const pool = new Pool({
  user: 'trenph_user',
  host: 'localhost',
  database: 'trenph',
  password: 'trenph_password', // This must be an exact match
  port: 5433, // Use the new, non-conflicting port
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};