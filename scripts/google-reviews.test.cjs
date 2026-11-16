const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const vm = require('node:vm');

const source = readFileSync(join(__dirname, '../api/google-reviews.js'), 'utf8');
const TTL = 300000;
// Isolated protocol fixtures, never used by the website or sent to Google.
const review = (id, comment = '[fixture de protocolo]') => ({
  reviewId: String(id), comment, starRating: 'FIVE', createTime: '2026-01-01T00:00:00Z',
  reviewer: { displayName: '[fixture]', profilePhotoUrl: 'javascript:invalid' }
});
const page = (reviews = [review(1)], extra = {}) => ({ averageRating: 4.8, totalReviewCount: 100, reviews, ...extra });
const reply = (body, status = 200, headers = {}) => new Response(JSON.stringify(body), {
  status, headers: { 'Content-Type': 'application/json', ...headers }
});

function setup(fetchImpl, environment = {}) {
  let now = 1000000;
  const logs = [];
  const calls = [];
  class Clock extends Date { static now() { return now; } }
  const context = vm.createContext({
    module: { exports: {} }, Date: Clock, URL, URLSearchParams, AbortSignal,
    Math: Object.assign(Object.create(Math), { random: () => 0 }),
    process: { env: {
      GOOGLE_CLIENT_ID: 'TEST_CLIENT_ID', GOOGLE_CLIENT_SECRET: 'TEST_SECRET',
      GOOGLE_REFRESH_TOKEN: 'TEST_REFRESH', GOOGLE_ACCOUNT_ID: 'accounts/123',
      GOOGLE_LOCATION_ID: 'locations/456', ...environment
    } },
    console: { error: (line) => logs.push(line) },
    fetch: async (url, options) => {
      calls.push({ url, options });
      return fetchImpl(url, options, calls.length);
    }
  });
  vm.runInContext(source, context);
  return {
    logs, calls, advance: (ms) => { now += ms; },
    async request(method = 'GET') {
      const result = { headers: {}, status: null, body: null };
      await context.module.exports({ method }, {
        setHeader(name, value) { result.headers[name] = value; },
        status(value) { result.status = value; return this; },
        json(value) { result.body = JSON.parse(JSON.stringify(value)); return this; }
      });
      return result;
    }
  };
}
const success = (url) => reply(url.includes('/token') ? { access_token: 'TEST_ACCESS', expires_in: 3600 } : page());

test('shares concurrent refreshes, caches 5 minutes, limits CDN to remaining TTL and reuses token', async () => {
  const api = setup(success);
  const results = await Promise.all(Array.from({ length: 12 }, () => api.request()));
  assert.ok(results.every((result) => result.status === 200));
  assert.equal(api.calls.length, 2);
  assert.equal(results[0].body.reviews[0].profilePhotoUrl, null);
  api.advance(120000);
  const cached = await api.request();
  assert.match(cached.headers['Cache-Control'], /max-age=0, s-maxage=180, must-revalidate/);
  assert.equal(api.calls.length, 2);
  api.advance(180000);
  await api.request();
  assert.equal(api.calls.length, 3);
  assert.equal(api.calls.filter(({ url }) => url.includes('/token')).length, 1);
});

test('paginates, skips uncommented entries, deduplicates, stops at 9, preserves aggregates and order', async () => {
  const api = setup((url) => {
    if (url.includes('/token')) return success(url);
    assert.match(url, /pageSize=50&orderBy=updateTime%20desc/);
    if (!url.includes('pageToken=')) return reply(page([review(0, '  '), ...Array.from({ length: 5 }, (_, i) => review(i + 1))], { nextPageToken: 'next' }));
    assert.match(url, /pageToken=next/);
    return reply(page([review(1), ...Array.from({ length: 7 }, (_, i) => review(i + 6))], { averageRating: 1, totalReviewCount: 1, nextPageToken: 'unused' }));
  });
  const result = await api.request();
  assert.equal(result.status, 200);
  assert.equal(result.body.averageRating, 4.8);
  assert.equal(result.body.totalReviewCount, 100);
  assert.deepEqual(result.body.reviews.map((item) => item.reviewId), ['1','2','3','4','5','6','7','8','9']);
  assert.equal(api.calls.length, 3);
});

test('accepts an empty location without inventing reviews', async () => {
  const api = setup((url) => url.includes('/token') ? success(url) : reply({}));
  const result = await api.request();
  assert.equal(result.status, 200);
  assert.deepEqual(result.body, { averageRating: 0, totalReviewCount: 0, reviews: [] });
});

test('invalid_grant is classified, shared, cooled down and never exposes bodies or secrets', async () => {
  const api = setup(() => reply({ error: 'invalid_grant', error_description: 'TEST_SECRET TEST_REFRESH Bearer TEST_ACCESS' }, 400));
  const results = await Promise.all([api.request(), api.request()]);
  assert.ok(results.every((result) => result.status === 503));
  assert.equal(api.calls.length, 1);
  assert.equal(results[0].headers['Retry-After'], '900');
  assert.match(api.logs[0], /"category":"authentication"/);
  assert.match(api.logs[0], /"code":"invalid_grant"/);
  assert.doesNotMatch(JSON.stringify(results) + api.logs.join(), /TEST_|Bearer|error_description/);
  await api.request();
  assert.equal(api.calls.length, 1);
  assert.equal(api.logs.length, 1);
  api.advance(900000);
  await api.request();
  assert.equal(api.calls.length, 2);
});

test('renews a rejected access token once and recovers from 401', async () => {
  let requests = 0;
  const api = setup((url) => url.includes('/token') ? success(url) : ++requests === 1 ? reply({ error: { status: 'UNAUTHENTICATED' } }, 401) : reply(page()));
  assert.equal((await api.request()).status, 200);
  assert.equal(api.calls.length, 4);
  assert.equal(api.logs.length, 0);
});

test('repeated 401 stops after one renewal, logs authentication and preserves confidentiality', async () => {
  const api = setup((url) => url.includes('/token') ? success(url) : reply({ error: { status: 'UNAUTHENTICATED', message: 'Bearer TEST_ACCESS' } }, 401));
  assert.equal((await api.request()).status, 503);
  assert.equal(api.calls.length, 4);
  assert.match(api.logs[0], /"category":"authentication"/);
  assert.doesNotMatch(api.logs.join(), /TEST_ACCESS|Bearer/);
});

for (const [status, body, category] of [
  [403, { error: { status: 'PERMISSION_DENIED' } }, 'permission'],
  [403, { error: { errors: [{ reason: 'rateLimitExceeded' }] } }, 'quota'],
  [429, { error: { status: 'RESOURCE_EXHAUSTED' } }, 'quota'],
  [503, { error: { status: 'UNAVAILABLE' } }, 'temporary']
]) {
  test(`classifies HTTP ${status} as ${category} and honors Retry-After`, async () => {
    const api = setup((url) => url.includes('/token') ? success(url) : reply(body, status, { 'Retry-After': '1800' }));
    const result = await api.request();
    assert.equal(result.status, 503);
    assert.equal(result.headers['Retry-After'], '1800');
    assert.equal(result.headers['Cache-Control'], 'no-store');
    assert.match(api.logs[0], new RegExp(`"category":"${category}"`));
    await api.request();
    assert.equal(api.calls.length, 2);
  });
}

test('temporary failures back off progressively and recover, without caching a broken payload', async () => {
  let broken = false;
  const api = setup((url) => url.includes('/token') ? success(url) : broken ? reply({}, 503) : reply(page()));
  assert.equal((await api.request()).status, 200);
  api.advance(TTL);
  broken = true;
  assert.equal((await api.request()).headers['Retry-After'], '300');
  api.advance(TTL);
  assert.equal((await api.request()).headers['Retry-After'], '600');
  api.advance(600000);
  broken = false;
  assert.equal((await api.request()).status, 200);
  assert.equal((await api.request()).status, 200);
});

test('rejects malformed aggregates and pagination cycles without publishing partial results', async () => {
  for (const payload of [page([], { averageRating: 'bad' }), page([], { totalReviewCount: -1 }), page('bad')]) {
    const api = setup((url) => url.includes('/token') ? success(url) : reply(payload));
    assert.equal((await api.request()).status, 503);
    assert.match(api.logs[0], /invalid_response/);
  }
  const api = setup((url) => url.includes('/token') ? success(url) : reply(page([], { nextPageToken: 'same' })));
  assert.equal((await api.request()).status, 503);
  assert.equal(api.calls.length, 3);
  assert.match(api.logs[0], /pagination_cycle/);
});

test('network failures and timeouts have safe logs', async () => {
  for (const name of ['TypeError', 'TimeoutError']) {
    const api = setup(() => { throw Object.assign(new Error('TEST_SECRET Bearer TEST_ACCESS'), { name }); });
    assert.equal((await api.request()).status, 503);
    assert.match(api.logs[0], name === 'TimeoutError' ? /"code":"timeout"/ : /"code":"network"/);
    assert.doesNotMatch(api.logs.join(), /TEST_|Bearer/);
  }
});

test('rejects unsupported methods and invalid configuration before contacting Google', async () => {
  const api = setup(success, { GOOGLE_REFRESH_TOKEN: '' });
  const post = await api.request('POST');
  assert.equal(post.status, 405);
  assert.equal(post.headers.Allow, 'GET');
  assert.equal((await api.request()).status, 503);
  assert.equal(api.calls.length, 0);
  assert.match(api.logs[0], /missing_environment/);
  const invalid = setup(success, { GOOGLE_ACCOUNT_ID: 'not-an-id' });
  assert.equal((await invalid.request()).status, 503);
  assert.equal(invalid.calls.length, 0);
  assert.match(invalid.logs[0], /invalid_resource_id/);
});
