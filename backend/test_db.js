const { Pool } = require('pg');

console.log('Attempting to connect to the database...');

const pool = new Pool({
  user: 'trenph_user',
  host: 'localhost',
  database: 'trenph',
  password: 'trenph_password',
  port: 5433,
});

async function testConnection() {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('✅✅✅ SUCCESS: Database connection is working!');
    console.log('Current time from DB:', res.rows[0]);
  } catch (err) {
    console.error('❌❌❌ FAILURE: Could not connect to the database.');
    console.error(err);
  } finally {
    await pool.end();
  }
}

testConnection();