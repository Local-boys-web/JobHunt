const jwt = require('jsonwebtoken');

const generateToken = (id, role = null) => {
  const payload = { id };

  if (role) {
    payload.role = role;
  }

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

module.exports = generateToken;
