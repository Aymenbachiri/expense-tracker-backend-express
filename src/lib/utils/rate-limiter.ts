import { rateLimit, type RateLimitRequestHandler } from 'express-rate-limit';

export const rateLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 60000,
  limit: 60,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});
