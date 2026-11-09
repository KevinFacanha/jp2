import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { dirname, extname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

// Development preview only. Vercel keeps using api/google-reviews.js directly.
if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
  throw new Error('Este servidor de pré-visualização só pode ser executado em desenvolvimento local.');
}

const root = dirname(fileURLToPath(import.meta.url));
const reviewsEndpoint = 'https://imperador-do-turismo.vercel.app/api/google-reviews';
const cacheLifetime = 5 * 60 * 1000;
let cachedReviews;
let cacheExpiresAt = 0;
let pendingReviews;

const loadPublicReviews = async () => {
  if (cachedReviews && Date.now() < cacheExpiresAt) return cachedReviews;
  if (pendingReviews) return pendingReviews;

  // The destination is fixed. Never forward local cookies, headers or credentials.
  pendingReviews = (async () => {
    const upstream = await fetch(reviewsEndpoint, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(15000),
      redirect: 'error'
    });
    if (!upstream.ok) throw new Error(`Endpoint público retornou HTTP ${upstream.status}.`);
    const data = await upstream.json();
    if (!Array.isArray(data.reviews) || !Number.isFinite(data.averageRating) ||
        !Number.isInteger(data.totalReviewCount) || data.averageRating < 0 ||
        data.averageRating > 5 || data.totalReviewCount < 0) {
      throw new Error('Resposta inválida do endpoint público de avaliações.');
    }
    cachedReviews = data;
    cacheExpiresAt = Date.now() + cacheLifetime;
    console.log(`[avaliações locais] ${data.reviews.length} comentários reais; nota ${data.averageRating}; total ${data.totalReviewCount}.`);
    return data;
  })();

  try {
    return await pendingReviews;
  } finally {
    pendingReviews = null;
  }
};

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp'
};

createServer(async (request, response) => {
  const urlPath = request.url.split('?')[0];
  if (urlPath === '/api/google-reviews') {
    response.setHeader('Content-Type', 'application/json; charset=utf-8');
    response.setHeader('Cache-Control', 'no-store');
    if (request.method !== 'GET') {
      response.writeHead(405, { Allow: 'GET' });
      response.end(JSON.stringify({ error: 'Method not allowed' }));
      return;
    }
    try {
      const data = await loadPublicReviews();
      response.writeHead(200);
      response.end(JSON.stringify(data));
    } catch (error) {
      console.error(`[avaliações locais] ${error.message} Verifique sua conexão e o endpoint público da Vercel.`);
      response.writeHead(503);
      response.end(JSON.stringify({ error: 'Reviews are temporarily unavailable' }));
    }
    return;
  }

  try {
    const pathname = urlPath === '/' ? '/index.html' : decodeURIComponent(urlPath);
    const filePath = join(root, pathname);
    const localPath = relative(root, filePath);
    if (localPath === '..' || localPath.startsWith(`..${sep}`) ||
        localPath.split(sep).some((part) => part.startsWith('.')) ||
        localPath.split(sep)[0] === 'api') throw new Error('Invalid path');
    const data = await readFile(filePath);
    response.writeHead(200, { 'Content-Type': types[extname(filePath)] || 'application/octet-stream' });
    response.end(data);
  } catch {
    response.writeHead(404);
    response.end('Not found');
  }
}).listen(4174, '127.0.0.1', () => {
  console.log('Pré-visualização local: http://localhost:4174/#depoimentos');
  console.log(`Avaliações reais via proxy local: ${reviewsEndpoint}`);
});
