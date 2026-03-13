const fs = require('fs');
const path = require('path');

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // simple token auth: require x-admin-token header matching ADMIN_TOKEN env var
  const token = req.headers['x-admin-token'] || req.headers['x-admin-token'.toLowerCase()];
  if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id, title, desc, meta } = req.body || {};
  if (!id) return res.status(400).json({ error: 'Missing id' });

  // Try DB update first (not implemented here) — fallback to editing ../courses.json
  try {
    const filePath = path.resolve(process.cwd(), '..', 'courses.json');
    if (!fs.existsSync(filePath)) return res.status(500).json({ error: 'courses.json not found' });
    const raw = fs.readFileSync(filePath, 'utf8');
    const json = JSON.parse(raw);
    // normalize meta to array
    const metaArr = Array.isArray(meta) ? meta : (typeof meta === 'string' ? meta.split('\n').map(s => s.trim()).filter(Boolean) : []);
    json[id] = json[id] || {};
    json[id].title = title || json[id].title;
    json[id].desc = desc || json[id].desc;
    json[id].meta = metaArr.length ? metaArr : json[id].meta;
    fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf8');
    return res.json({ ok: true });
  } catch (err) {
    console.error('saveCourse error', err);
    return res.status(500).json({ error: 'Could not save', detail: err.message });
  }
}
