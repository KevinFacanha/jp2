const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_BUSINESS_API_URL = 'https://mybusiness.googleapis.com/v4';
const CACHE_LIFETIME = 5 * 60 * 1000;
const STAR_RATINGS = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 };
const requiredEnvironmentVariables = [
  'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'GOOGLE_REFRESH_TOKEN',
  'GOOGLE_ACCOUNT_ID', 'GOOGLE_LOCATION_ID'
];

// Best-effort, per warm server instance; the CDN also caches public results.
// Nothing is written to disk or an external storage service.
let cachedPayload;
let cacheExpiresAt = 0;
let pendingReviews;
let cachedToken;
let tokenExpiresAt = 0;
let retryAt = 0;
let consecutiveFailures = 0;

const publicUrlOrNull = (value) => {
  if (typeof value !== 'string') return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' ? url.toString() : null;
  } catch {
    return null;
  }
};

const failure = (stage, category, code, status = null, retryAfter = 0) =>
  Object.assign(new Error('Google reviews unavailable'), { stage, category, code, status, retryAfter });

const parseRetryAfter = (value) => {
  if (!value) return 0;
  const seconds = Number(value);
  const milliseconds = Number.isFinite(seconds) ? seconds * 1000 : Date.parse(value) - Date.now();
  return Number.isFinite(milliseconds) ? Math.max(0, milliseconds) : 0;
};

const requestGoogle = async (url, options, stage, signal) => {
  let response;
  let body;
  try {
    response = await fetch(url, {
      ...options,
      redirect: 'error',
      signal: AbortSignal.any([signal, AbortSignal.timeout(10000)])
    });
    body = await response.json().catch(() => null);
  } catch (error) {
    throw failure(stage, 'temporary',
      signal.aborted || error.name === 'TimeoutError' || error.name === 'AbortError' ? 'timeout' : 'network');
  }

  if (!response.ok) {
    // Read only known machine codes. Never log response bodies, messages, URLs,
    // request headers, tokens, credentials, or reviewer information.
    const oauthCodes = new Set(['invalid_grant', 'invalid_client', 'unauthorized_client', 'access_denied']);
    const googleCodes = new Set([
      'UNAUTHENTICATED', 'PERMISSION_DENIED', 'RESOURCE_EXHAUSTED',
      'UNAVAILABLE', 'INTERNAL', 'DEADLINE_EXCEEDED', 'NOT_FOUND', 'INVALID_ARGUMENT'
    ]);
    const quotaReasons = new Set([
      'rateLimitExceeded', 'userRateLimitExceeded', 'dailyLimitExceeded', 'quotaExceeded',
      'RATE_LIMIT_EXCEEDED', 'QUOTA_EXCEEDED', 'DAILY_LIMIT_EXCEEDED'
    ]);
    const code = oauthCodes.has(body?.error) ? body.error :
      googleCodes.has(body?.error?.status) ? body.error.status : 'upstream_error';
    const reasons = [...(Array.isArray(body?.error?.errors) ? body.error.errors : []),
      ...(Array.isArray(body?.error?.details) ? body.error.details : [])];
    const quota = response.status === 429 || code === 'RESOURCE_EXHAUSTED' ||
      reasons.some((item) => quotaReasons.has(item?.reason));
    const category = quota ? 'quota' : oauthCodes.has(code) || response.status === 401 ? 'authentication' :
      response.status === 403 ? 'permission' : response.status >= 500 || response.status === 408 ? 'temporary' : 'request';
    throw failure(stage, category, code, response.status, parseRetryAfter(response.headers.get('Retry-After')));
  }

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw failure(stage, 'temporary', 'invalid_response');
  }
  return body;
};

const numericResourceId = (value, resourceName) => {
  const id = value.trim().replace(new RegExp(`^(?:${resourceName}/)+`, 'i'), '');
  if (!/^\d+$/.test(id)) throw failure('configuration', 'configuration', 'invalid_resource_id');
  return id;
};

const requestOAuthToken = async (signal) => {
  if (cachedToken && Date.now() < tokenExpiresAt) return cachedToken;
  const tokenData = await requestGoogle(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
      grant_type: 'refresh_token'
    })
  }, 'oauth_token', signal);

  if (typeof tokenData.access_token !== 'string' || !tokenData.access_token) {
    throw failure('oauth_token', 'temporary', 'missing_access_token');
  }
  cachedToken = tokenData.access_token;
  // Keep a safety margin; a missing expiry simply disables token reuse.
  tokenExpiresAt = Date.now() + Math.max(0, (Number(tokenData.expires_in) || 0) - 60) * 1000;
  return cachedToken;
};

const fetchReviewsPayload = async () => {
  const missingVariables = requiredEnvironmentVariables.filter((name) => !process.env[name]);
  if (missingVariables.length) throw failure('configuration', 'configuration', 'missing_environment');
  const accountId = numericResourceId(process.env.GOOGLE_ACCOUNT_ID, 'accounts');
  const locationId = numericResourceId(process.env.GOOGLE_LOCATION_ID, 'locations');
  const reviewsUrl = `${GOOGLE_BUSINESS_API_URL}/accounts/${accountId}/locations/${locationId}/reviews?pageSize=50&orderBy=updateTime%20desc`;
  // Bound the entire refresh, including pagination and at most one token renewal.
  const signal = AbortSignal.timeout(25000);
  let accessToken = await requestOAuthToken(signal);
  let renewedToken = false;
  const requestPage = async (url) => {
    const options = () => ({
      method: 'GET',
      headers: { Accept: 'application/json', Authorization: `Bearer ${accessToken}` }
    });
    try {
      return await requestGoogle(url, options(), 'google_reviews', signal);
    } catch (error) {
      if (error.status !== 401 || renewedToken) throw error;
      // A cached access token may have expired or been rejected. Retry only once.
      renewedToken = true;
      cachedToken = null;
      tokenExpiresAt = 0;
      accessToken = await requestOAuthToken(signal);
      return requestGoogle(url, options(), 'google_reviews', signal);
    }
  };
  const reviewsData = await requestPage(reviewsUrl);
  // Google may omit zero-valued fields for a location with no reviews.
  const averageRating = reviewsData.averageRating ?? 0;
  const totalReviewCount = reviewsData.totalReviewCount ?? 0;
  if (!Number.isFinite(averageRating) || averageRating < 0 || averageRating > 5 ||
      !Number.isInteger(totalReviewCount) || totalReviewCount < 0) {
    throw failure('google_reviews', 'temporary', 'invalid_response');
  }

  // Preserve selection: up to nine genuine comments, in Google's update order.
  // Aggregates include uncommented reviews and always come from the first page.
  const commentedReviews = [];
  const seenReviews = new Set();
  const seenPageTokens = new Set();
  let page = reviewsData;
  while (true) {
    if ((page.reviews !== undefined && !Array.isArray(page.reviews)) ||
        (page.nextPageToken !== undefined && typeof page.nextPageToken !== 'string') ||
        (page === reviewsData && totalReviewCount > 0 && !Array.isArray(page.reviews))) {
      throw failure('google_reviews', 'temporary', 'invalid_response');
    }
    for (const review of page.reviews || []) {
      if (!review || typeof review.comment !== 'string' || !review.comment.trim()) continue;
      const key = review.reviewId || JSON.stringify([
        review.reviewer?.displayName, review.createTime, review.comment
      ]);
      if (seenReviews.has(key)) continue;
      seenReviews.add(key);
      commentedReviews.push(review);
      if (commentedReviews.length === 9) break;
    }
    const nextPageToken = page.nextPageToken;
    if (commentedReviews.length === 9 || !nextPageToken) break;
    if (seenPageTokens.has(nextPageToken)) throw failure('google_reviews', 'temporary', 'pagination_cycle');
    seenPageTokens.add(nextPageToken);
    page = await requestPage(`${reviewsUrl}&pageToken=${encodeURIComponent(nextPageToken)}`);
  }

  return {
    averageRating,
    totalReviewCount,
    reviews: commentedReviews.map((review) => ({
      reviewId: typeof review.reviewId === 'string' ? review.reviewId : null,
      displayName: review.reviewer?.displayName || 'Cliente do Google',
      profilePhotoUrl: publicUrlOrNull(review.reviewer?.profilePhotoUrl),
      starRating: STAR_RATINGS[review.starRating] || null,
      comment: review.comment.trim(),
      createTime: review.createTime || null,
      reviewReplyUrl: publicUrlOrNull(review.reviewReplyUrl)
    }))
  };
};

const refreshReviews = () => {
  if (pendingReviews) return pendingReviews;
  pendingReviews = fetchReviewsPayload().then((payload) => {
    cachedPayload = payload;
    cacheExpiresAt = Date.now() + CACHE_LIFETIME;
    retryAt = 0;
    consecutiveFailures = 0;
    return payload;
  }).catch((error) => {
    consecutiveFailures++;
    const needsAttention = ['authentication', 'permission', 'configuration', 'request'].includes(error.category);
    const backoff = needsAttention ? 15 * 60 * 1000 :
      Math.min(30 * 60 * 1000, CACHE_LIFETIME * 2 ** Math.min(consecutiveFailures - 1, 3)) + Math.random() * 30000;
    retryAt = Date.now() + Math.max(backoff, error.retryAfter || 0);
    if (error.category === 'authentication') {
      cachedToken = null;
      tokenExpiresAt = 0;
    }
    console.error('[google-reviews] ' + JSON.stringify({
      stage: error.stage || 'google_reviews',
      category: error.category || 'temporary',
      code: error.code || 'unexpected_failure',
      status: error.status || null,
      retryAfterSeconds: Math.ceil((retryAt - Date.now()) / 1000)
    }));
    throw error;
  }).finally(() => { pendingReviews = null; });
  return pendingReviews;
};

module.exports = async function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    response.setHeader('Cache-Control', 'no-store');
    return response.status(405).json({ error: 'Method not allowed' });
  }
  try {
    let payload;
    if (cachedPayload && Date.now() < cacheExpiresAt) payload = cachedPayload;
    else if (Date.now() < retryAt) throw failure('cooldown', 'temporary', 'retry_later');
    else payload = await refreshReviews();
    // Use only the remaining lifetime so CDN + memory do not double the cache age.
    const remainingSeconds = Math.max(0, Math.floor((cacheExpiresAt - Date.now()) / 1000));
    response.setHeader('Cache-Control', `public, max-age=0, s-maxage=${remainingSeconds}, must-revalidate`);
    return response.status(200).json(payload);
  } catch {
    response.setHeader('Cache-Control', 'no-store');
    response.setHeader('Retry-After', String(Math.max(1, Math.ceil((retryAt - Date.now()) / 1000))));
    return response.status(503).json({ error: 'Reviews are temporarily unavailable' });
  }
};
