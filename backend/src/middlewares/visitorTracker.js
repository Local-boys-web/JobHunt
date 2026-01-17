const Visitor = require('../models/Visitor');

const trackVisitor = async (req, res, next) => {
  try {
    // Get IP address (handle proxy/load balancers)
    const ip = req.ip ||
               req.headers['x-forwarded-for']?.split(',')[0] ||
               req.connection.remoteAddress;

    // Get user agent
    const userAgent = req.headers['user-agent'] || 'Unknown';

    // Get page/route
    const page = req.path || 'unknown';

    // Only track unique visits per day per IP
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingVisit = await Visitor.findOne({
      ip: ip,
      visitedAt: { $gte: today }
    });

    // If no visit from this IP today, record it
    if (!existingVisit) {
      await Visitor.create({
        ip,
        userAgent,
        page
      });
    }
  } catch (error) {
    // Don't block the request if visitor tracking fails
    console.error('Visitor tracking error:', error);
  }

  next();
};

module.exports = trackVisitor;
