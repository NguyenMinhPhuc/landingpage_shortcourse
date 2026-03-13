const { queryCourses } = require('../../lib/db');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const rows = await queryCourses();
    return res.status(200).json({ data: rows });
  } catch (err) {
    console.error('SQL query failed:', err && err.message);
    return res.status(500).json({ error: 'Database error', detail: err && err.message });
  }
};
