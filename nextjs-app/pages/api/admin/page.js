const fs = require('fs');
const path = require('path');

function getLocalPath() {
  return path.resolve(process.cwd(), '..', 'pageData.json');
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Prefer DB if implemented; fallback to local JSON
    try {
      const filePath = getLocalPath();
      if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'pageData.json not found' });
      const raw = fs.readFileSync(filePath, 'utf8');
      const json = JSON.parse(raw);
      return res.json({ data: json });
    } catch (err) {
      console.error('page GET error', err);
      return res.status(500).json({ error: 'Could not load page data', detail: err.message });
    }
  }

  if (req.method === 'POST') {
    // protected by token
    const token = req.headers['x-admin-token'] || req.headers['x-admin-token'.toLowerCase()];
    if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) return res.status(401).json({ error: 'Unauthorized' });
    const payload = req.body;
    try {
      const filePath = getLocalPath();
      fs.writeFileSync(filePath, JSON.stringify(payload, null, 2), 'utf8');
      return res.json({ ok: true });
    } catch (err) {
      console.error('page POST error', err);
      return res.status(500).json({ error: 'Could not save page data', detail: err.message });
    }
  }

  res.status(405).json({ error: 'Method not allowed' });
}
