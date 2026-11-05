// Local preview server: node serve.mjs  (then open http://127.0.0.1:8765/)
import { createServer } from 'node:http';
import { createReadStream, statSync } from 'node:fs';
import { join, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = process.argv[2] || fileURLToPath(new URL('.', import.meta.url));
const port = process.argv[3] || 8765;
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.json': 'application/json', '.md': 'text/plain' };
createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p.endsWith('/')) p += 'index.html';
  const f = join(root, normalize(p).replace(/^[\/\\]+/, ''));
  try { const st = statSync(f); if (!st.isFile()) throw 0; res.writeHead(200, { 'content-type': types[extname(f)] || 'application/octet-stream', 'content-length': st.size, 'cache-control': 'no-store' }); createReadStream(f).pipe(res); }
  catch { res.writeHead(404); res.end('not found'); }
}).listen(+port, '127.0.0.1', () => console.log('serving', root, 'on', port));
