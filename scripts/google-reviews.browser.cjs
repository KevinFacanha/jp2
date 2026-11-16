// Usage: node scripts/google-reviews.browser.cjs [path-to-playwright]
// All API responses are isolated test fixtures. No Google account is contacted.
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { resolve, extname, sep } = require('node:path');
const { chromium } = require(process.argv[2] || 'playwright');
const root = resolve(__dirname, '..');
const TTL = 300000;
const fixture = () => ({
  averageRating: 4.8, totalReviewCount: 100,
  reviews: Array.from({ length: 9 }, (_, index) => ({
    reviewId: String(index), displayName: '[fixture de teste]',
    comment: `[fixture de protocolo ${index}; não publicar]`,
    starRating: 5, createTime: '2026-01-01T00:00:00Z', profilePhotoUrl: null
  }))
});

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  let checks = 0;
  const check = (condition, message) => { assert.ok(condition, message); checks++; };
  try {
    for (const mobile of [false, true]) {
      const context = await browser.newContext({ viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 1000 } });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', (error) => errors.push(error.message));
      let payload = fixture();
      let calls = 0;
      let status = 200;
      let retryAfter = null;
      let hold = null;
      let onHeldRequest = null;
      await page.route('**/*', async (route) => {
        const url = new URL(route.request().url());
        if (url.origin !== 'https://reviews.test') return route.abort();
        if (url.pathname === '/api/google-reviews') {
          calls++;
          if (hold) { onHeldRequest?.(); await hold; }
          return route.fulfill({
            status, contentType: 'application/json',
            headers: retryAfter ? { 'Retry-After': retryAfter } : {},
            body: JSON.stringify(status === 200 ? payload : { error: 'temporarily unavailable' })
          });
        }
        const path = resolve(root, '.' + (url.pathname === '/' ? '/index.html' : decodeURIComponent(url.pathname)));
        if (!path.startsWith(root + sep)) return route.abort();
        try {
          const contentType = { '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript', '.png': 'image/png' }[extname(path)] || 'application/octet-stream';
          return route.fulfill({ contentType, body: readFileSync(path) });
        } catch { return route.abort(); }
      });
      const epoch = new Date('2026-11-16T12:00:00Z');
      await page.clock.install({ time: epoch });
      await page.clock.pauseAt(epoch);
      await page.goto('https://reviews.test/', { waitUntil: 'load' });
      await page.waitForFunction(() => document.querySelectorAll('.quote-card:not([data-review-copy])').length === 9);
      await page.clock.runFor(100);
      await page.locator('#depoimentos').scrollIntoViewIfNeeded();
      await page.clock.runFor(100);
      check(calls === 1, 'initial load/pageshow must share a request');
      check(await page.locator('[data-average-rating]').textContent() === '4,8', 'initial average');
      check(await page.locator('[data-reviews-list]').getAttribute('aria-busy') === 'false', 'loading ends');
      await page.evaluate(() => {
        window.originalTrack = document.querySelector('.reviews-column-track');
        window.originalCard = document.querySelector('.quote-card');
        window.mutations = 0;
        new MutationObserver((entries) => { window.mutations += entries.length; })
          .observe(document.querySelector('[data-reviews-list]'), { childList: true, subtree: true });
      });

      const poll = async () => {
        const previousCalls = calls;
        await page.clock.fastForward(TTL);
        // Wait on page state, not real time or the frozen browser clock.
        await page.evaluate(() => loadGoogleReviews());
        check(calls === previousCalls + 1, 'exactly one refresh per five minutes');
      };
      await poll();
      check(await page.evaluate(() => window.originalTrack === document.querySelector('.reviews-column-track') && window.originalCard === document.querySelector('.quote-card') && window.mutations === 0), 'unchanged payload keeps all nodes');

      payload.averageRating = 4.9;
      payload.totalReviewCount = 101;
      await poll();
      check(await page.locator('[data-average-rating]').textContent() === '4,9', 'aggregate updates live');
      check(await page.locator('[data-total-reviews]').textContent() === '101 avaliações no Google', 'total updates live');
      check(await page.evaluate(() => window.originalTrack === document.querySelector('.reviews-column-track') && window.mutations === 0), 'aggregate-only changes preserve carousel');

      if (mobile) {
        await page.evaluate(() => {
          reviewsMobileCarousel.animations.forEach((animation) => { animation.onfinish = null; animation.cancel(); });
          reviewsMobileCarousel.animations = [];
          settleMobileReview(reviewsMobileCarousel, 3);
          reviewsHovered = true;
          syncReviewsMotion();
        });
      } else {
        await page.evaluate(() => {
          document.querySelector('.reviews-column-track').getAnimations()[0].currentTime = 15000;
          reviewsHovered = true;
          syncReviewsMotion();
        });
      }
      payload.reviews.unshift({ ...payload.reviews[0], reviewId: 'new', comment: '[nova fixture de protocolo; não publicar]' });
      payload.reviews.pop();
      await poll();
      check((await page.locator('[data-reviews-list]').textContent()).includes('[nova fixture'), 'new comments become visible');
      check(await page.locator('.quote-card:not([data-review-copy])').count() === 9, 'selection remains capped at nine');
      check(await page.evaluate(() => reviewsMobile.matches ? loadedGoogleReviews[reviewsMobileCarousel.index].reviewId === '3' : document.querySelector('.reviews-column-track').getAnimations()[0].currentTime >= 15000), 'keeps mobile identity / desktop animation progress');

      await page.evaluate(() => {
        window.validTrack = document.querySelector('.reviews-column-track');
        window.validText = document.querySelector('[data-reviews-list]').textContent;
        openFullReviews(0);
      });
      payload.reviews[0].comment = '[fixture editada; não publicar]';
      await poll();
      check((await page.locator('[data-reviews-full]').textContent()).includes('[fixture editada'), 'open dialog updates too');
      await page.evaluate(() => {
        reviewsDialog.close();
        window.validTrack = document.querySelector('.reviews-column-track');
        window.validText = document.querySelector('[data-reviews-list]').textContent;
      });
      status = 503;
      retryAfter = '900';
      await poll();
      check(await page.evaluate(() => window.validTrack === document.querySelector('.reviews-column-track') && window.validText === document.querySelector('[data-reviews-list]').textContent), 'temporary failure preserves valid nodes and content');
      const beforeRetry = calls;
      await page.clock.fastForward(TTL);
      await page.evaluate(() => loadGoogleReviews());
      check(calls === beforeRetry, 'honors Retry-After');
      status = 200;
      retryAfter = null;
      await page.clock.fastForward(600000);
      await page.evaluate(() => loadGoogleReviews());
      check(calls === beforeRetry + 1, 'recovers after cooldown');

      await page.evaluate(() => {
        window.hiddenForTest = true;
        Object.defineProperty(document, 'hidden', { configurable: true, get: () => window.hiddenForTest });
        document.dispatchEvent(new Event('visibilitychange'));
      });
      const beforeHidden = calls;
      await page.clock.fastForward(TTL * 3);
      check(calls === beforeHidden, 'no background polling');
      await page.evaluate(() => {
        window.hiddenForTest = false;
        document.dispatchEvent(new Event('visibilitychange'));
        document.dispatchEvent(new Event('visibilitychange'));
        return loadGoogleReviews();
      });
      check(calls === beforeHidden + 1, 'returning to overdue tab refreshes only once');
      await page.evaluate(() => document.dispatchEvent(new Event('visibilitychange')));
      check(calls === beforeHidden + 1, 'fresh tab does not fetch again');

      let release;
      hold = new Promise((resolve) => { release = resolve; });
      const requestHeld = new Promise((resolve) => { onHeldRequest = resolve; });
      await page.clock.fastForward(TTL);
      await requestHeld;
      const beforeConcurrent = calls;
      await page.evaluate(() => { loadGoogleReviews(); loadGoogleReviews(); document.dispatchEvent(new Event('visibilitychange')); });
      check(calls === beforeConcurrent, 'pending request is shared');
      release();
      hold = null;
      await page.evaluate(() => loadGoogleReviews());

      await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent('pagehide', { persisted: true })));
      const beforeBFCache = calls;
      await page.clock.fastForward(TTL * 2);
      check(calls === beforeBFCache, 'pagehide suspends polling');
      await page.evaluate(() => { window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true })); return loadGoogleReviews(); });
      check(calls === beforeBFCache + 1, 'BFCache restoration checks freshness');

      payload = { averageRating: 0, totalReviewCount: 0, reviews: null };
      await poll();
      check(await page.locator('[data-average-rating]').textContent() === '4,9', 'malformed payload preserves last summary');
      check(await page.evaluate(() => window.validText === document.querySelector('[data-reviews-list]').textContent), 'malformed payload preserves comments');

      status = 503;
      await page.reload({ waitUntil: 'load' });
      await page.waitForFunction(() => document.querySelector('[data-reviews-list] > .reviews-status:only-child'));
      check(await page.locator('[data-average-rating]').textContent() === '—', 'initial failure does not invent a rating');
      await page.evaluate(() => { window.failureStatus = document.querySelector('.reviews-status'); });
      await poll();
      check(await page.evaluate(() => window.failureStatus === document.querySelector('.reviews-status')), 'repeated initial failure does not recreate status');
      status = 200;
      payload = { averageRating: 0, totalReviewCount: 0, reviews: [] };
      await poll();
      check((await page.locator('[data-reviews-list]').textContent()).includes('Nenhuma avaliação'), 'empty valid response recovers from initial failure');
      payload = fixture();
      await poll();
      check(await page.locator('.quote-card:not([data-review-copy])').count() === 9, 'recovers from empty response when comments arrive');
      check(errors.length === 0, `no browser exceptions: ${errors.join('; ')}`);
      console.log(`${mobile ? 'mobile' : 'desktop'}: passed; ${calls} API requests`);
      await context.close();
    }
    console.log(`${checks} browser checks passed`);
  } finally { await browser.close(); }
})().catch((error) => { console.error(error); process.exitCode = 1; });
