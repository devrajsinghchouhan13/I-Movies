const ipHits = new Map();

export function apiRateLimiter(limit = 120, windowMs = 60000) {
  return (req, res, next) => {
    const ip = req.ip || req.socket?.remoteAddress || 'unknown';
    const now = Date.now();

    const record = ipHits.get(ip);
    if (!record || now > record.resetTime) {
      ipHits.set(ip, { count: 1, resetTime: now + windowMs });
      return next();
    }

    record.count++;
    if (record.count > limit) {
      res.status(429).json({
        message: 'Too many requests. Please slow down your requests and try again shortly.'
      });
      return;
    }

    next();
  };
}
