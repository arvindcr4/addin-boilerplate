import { Request, Response, NextFunction } from 'express';
import { RateLimiterMemory } from 'rate-limiter-flexible';

const rateLimiter = new RateLimiterMemory({
  points: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // Number of requests
  duration: 15 * 60, // Per 15 minutes by default
});

export async function rateLimiterMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    await rateLimiter.consume(req.ip || 'unknown');
    next();
  } catch (rejRes) {
    res.status(429).json({
      error: 'Too many requests',
      message: 'Please try again later',
    });
  }
}

export { rateLimiterMiddleware as rateLimiter };