const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const Redis = require('ioredis');

const redis = new Redis();

const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    store: new RedisStore({
      client: redis,
      prefix: 'rate-limit:'
    }),
    windowMs,
    max,
    message: { error: message }
  });
};

module.exports = {
  loginLimiter: createRateLimiter(
    15 * 60 * 1000, // 15 minutes
    5, // 5 attempts
    'Too many login attempts. Please try again later.'
  ),
  
  uploadLimiter: createRateLimiter(
    60 * 60 * 1000, // 1 hour
    10, // 10 uploads
    'Upload limit reached. Please try again later.'
  ),

  downloadLimiter: createRateLimiter(
    60 * 60 * 1000, // 1 hour
    50, // 50 downloads
    'Download limit reached. Please try again later.'
  )
}; 