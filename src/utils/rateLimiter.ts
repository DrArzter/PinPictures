import Redis from 'ioredis';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import { NextApiRequest, NextApiResponse } from 'next';
import { RateLimiterRes } from 'rate-limiter-flexible';

const redisClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  connectTimeout: 5000,
  maxRetriesPerRequest: 3
});

export const userRateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'middleware:user',
  points: 100,
  duration: 60,
  blockDuration: 60 * 15,
});

export const ipRateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'middleware:ip',
  points: 10,
  duration: 60,
  blockDuration: 60 * 15,
});

export const handleRateLimitError = (
  rateLimiterRes: RateLimiterRes,
  req: NextApiRequest,
  res: NextApiResponse
) => {
  res.status(429).json({
    status: 'error',
    message: 'Too Many Requests',
    resetTime: Date.now() + rateLimiterRes.msBeforeNext,
  });
};