const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_BUSINESS_API_URL = 'https://mybusiness.googleapis.com/v4';
const CACHE_CONTROL = 'public, s-maxage=300, stale-while-revalidate=60';

const STAR_RATINGS = {
  ONE: 1,
  TWO: 2,
  THREE: 3,
  FOUR: 4,
  FIVE: 5
};

const requiredEnvironmentVariables = [
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'GOOGLE_REFRESH_TOKEN',
  'GOOGLE_ACCOUNT_ID',
  'GOOGLE_LOCATION_ID'
];

const publicUrlOrNull = (value) => {
  if (typeof value !== 'string') return null;

  try {
    const url = new URL(value);
    return url.protocol === 'https:' ? url.toString() : null;
  } catch {
    return null;
  }
};

const readResponseBody = async (response) => {
  try {
    const text = await response.text();
    if (!text) return null;

    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  } catch (error) {
    return `[Unable to read response body: ${error.message}]`;
  }
};

const safeUrlForLogging = (value) => {
  const url = new URL(value);
  const sensitiveParameters = /token|secret|authorization|credential|password|api_?key/i;

  url.username = '';
  url.password = '';
  for (const parameter of [...url.searchParams.keys()]) {
    if (sensitiveParameters.test(parameter)) url.searchParams.set(parameter, '[REDACTED]');
  }

  return url.toString();
};

const numericResourceId = (value, resourceName, environmentVariable) => {
  const id = value.trim().replace(new RegExp(`^(?:${resourceName}/)+`, 'i'), '');

  if (!/^\d+$/.test(id)) {
    throw new Error(`${environmentVariable} must be a numeric ID`);
  }

  return id;
};

const requestJson = async (url, options, { logGoogleBusinessFailure = false } = {}) => {
  const response = await fetch(url, {
    ...options,
    signal: AbortSignal.timeout(10000)
  });

  if (!response.ok) {
    const body = await readResponseBody(response);

    if (logGoogleBusinessFailure) {
      console.error('[google-reviews] Google Business Profile HTTP error:', {
        status: response.status,
        statusText: response.statusText,
        body,
        url: safeUrlForLogging(url)
      });
    }

    const error = new Error(`Google request failed with status ${response.status}`);
    error.googleBusinessFailureLogged = logGoogleBusinessFailure;
    throw error;
  }

  return response.json();
};

module.exports = async function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const missingVariables = requiredEnvironmentVariables.filter((name) => !process.env[name]);
  if (missingVariables.length > 0) {
    console.error(`[google-reviews] Missing server environment variables: ${missingVariables.join(', ')}`);
    response.setHeader('Cache-Control', 'no-store');
    return response.status(503).json({ error: 'Reviews are temporarily unavailable' });
  }

  try {
    const tokenData = await requestJson(GOOGLE_TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
        grant_type: 'refresh_token'
      })
    });

    if (typeof tokenData.access_token !== 'string' || !tokenData.access_token) {
      throw new Error('Google token response did not include an access token');
    }

    const accountId = numericResourceId(process.env.GOOGLE_ACCOUNT_ID, 'accounts', 'GOOGLE_ACCOUNT_ID');
    const locationId = numericResourceId(process.env.GOOGLE_LOCATION_ID, 'locations', 'GOOGLE_LOCATION_ID');
    const reviewsUrl = `${GOOGLE_BUSINESS_API_URL}/accounts/${accountId}/locations/${locationId}/reviews?pageSize=50&orderBy=updateTime%20desc`;

    const reviewsData = await requestJson(reviewsUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${tokenData.access_token}`
      }
    }, { logGoogleBusinessFailure: true });

    const reviews = Array.isArray(reviewsData.reviews)
      ? reviewsData.reviews
          .filter((review) => typeof review.comment === 'string' && review.comment.trim())
          .slice(0, 3)
          .map((review) => ({
            displayName: review.reviewer?.displayName || 'Cliente do Google',
            profilePhotoUrl: publicUrlOrNull(review.reviewer?.profilePhotoUrl),
            starRating: STAR_RATINGS[review.starRating] || null,
            comment: review.comment.trim(),
            createTime: review.createTime || null,
            reviewReplyUrl: publicUrlOrNull(review.reviewReplyUrl)
          }))
      : [];

    const payload = {
      averageRating: Number(reviewsData.averageRating) || 0,
      totalReviewCount: Number(reviewsData.totalReviewCount) || 0,
      reviews
    };

    response.setHeader('Cache-Control', CACHE_CONTROL);
    return response.status(200).json(payload);
  } catch (error) {
    if (!error.googleBusinessFailureLogged) {
      console.error('[google-reviews] Google Business Profile request failed:', error.message);
    }
    response.setHeader('Cache-Control', 'no-store');
    return response.status(503).json({ error: 'Reviews are temporarily unavailable' });
  }
};
