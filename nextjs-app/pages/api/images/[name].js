import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const { name } = req.query;
  if (!name) return res.status(400).end('Missing name');
  // allow only filenames (no slashes)
  if (Array.isArray(name)) return res.status(400).end('Invalid name');

  const filePath = path.resolve(process.cwd(), '..', 'images', name);
  if (!fs.existsSync(filePath)) return res.status(404).end('Not found');

  const ext = path.extname(filePath).toLowerCase();
  const mime = ext === '.png' ? 'image/png' : ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 'application/octet-stream';
  res.setHeader('Content-Type', mime);
  const stat = fs.statSync(filePath);
  res.setHeader('Content-Length', stat.size);
  const stream = fs.createReadStream(filePath);
  stream.pipe(res);
}
