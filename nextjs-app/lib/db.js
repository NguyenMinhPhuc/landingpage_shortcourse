const sql = require('mssql');

async function getPool() {
  const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT || '1433', 10),
    options: {
      encrypt: (process.env.DB_ENCRYPT === 'true') || false,
      trustServerCertificate: true
    },
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000
    }
  };

  if (!config.user || !config.server || !config.database) {
    throw new Error('Missing DB configuration in environment variables.');
  }

  return sql.connect(config);
}

async function queryCourses() {
  const pool = await getPool();
  // Query the cms.courses table defined in landingpage_schema.sql
  const result = await pool.request().query("SELECT id, slug, title, short_desc AS description, content, duration, audience FROM cms.courses ORDER BY id");
  return result.recordset;
}

module.exports = { queryCourses };
