import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const root = process.cwd();
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp'
};

createServer(async (request, response) => {
  try {
    const urlPath = request.url === '/' ? '/index.html' : decodeURIComponent(request.url.split('?')[0]);
    const filePath = normalize(join(root, urlPath));
    if (!filePath.startsWith(root)) throw new Error('Invalid path');
    const data = await readFile(filePath);
    response.writeHead(200, { 'Content-Type': types[extname(filePath)] || 'application/octet-stream' });
    response.end(data);
  } catch {
    response.writeHead(404);
    response.end('Not found');
  }
}).listen(4174, '0.0.0.0', () => console.log('Preview: http://127.0.0.1:4174'));
