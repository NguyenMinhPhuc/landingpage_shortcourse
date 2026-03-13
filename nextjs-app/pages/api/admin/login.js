export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { token } = req.body || {};
  if (!process.env.ADMIN_TOKEN) return res.status(500).json({ error: 'Server admin token not configured' });
  if (!token) return res.status(400).json({ error: 'Missing token' });
  if (token === process.env.ADMIN_TOKEN) return res.status(200).json({ ok: true });
  return res.status(401).json({ error: 'Invalid token' });
}
