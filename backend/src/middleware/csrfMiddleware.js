const generateCsrfToken = (req, res, next) => {
  // Generate a CSRF token if one doesn't exist
  if (!req.cookies.csrfToken) {
    const crypto = require('crypto');
    const token = crypto.randomBytes(32).toString('hex');
    const isProd = process.env.NODE_ENV === 'production';
    res.cookie('csrfToken', token, {
      httpOnly: false, // Must be false so the frontend can read it
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    // Set on req to be used immediately if needed
    req.csrfToken = token;
  } else {
    req.csrfToken = req.cookies.csrfToken;
  }
  next();
};

const verifyCsrfToken = (req, res, next) => {
  // Allow safe methods
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  // Skip CSRF verification in test environment
  if (process.env.NODE_ENV === 'test') {
    return next();
  }

  const tokenFromCookie = req.cookies.csrfToken;
  const tokenFromHeader = req.headers['x-csrf-token'];

  if (!tokenFromCookie || !tokenFromHeader || tokenFromCookie !== tokenFromHeader) {
    return res.status(403).json({
      success: false,
      message: 'Invalid CSRF token'
    });
  }

  next();
};

module.exports = {
  generateCsrfToken,
  verifyCsrfToken
};
