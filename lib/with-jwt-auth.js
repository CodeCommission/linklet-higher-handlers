const {compose, handle} = require('linklet');
const {verify, decode} = require('jsonwebtoken');

const withJWTAuth = options => handler => (req, res) => {
  if (!options.secret) throw new Error('JWT-Secret is missing.');
  if (req.headers.authorization) {
    const token = (req.headers.authorization || '')
      .replace('Bearer', '')
      .trim();
    try {
      req.user = verify(token, options.secret);
      return handler(req, res);
    } catch (error) {
      return handle(req, res, null, {
        message: 'Unauthorized',
        status: 'Unauthorized',
        statusCode: 401
      });
    }
  }
  return handle(req, res, null, {
    message: 'Unauthorized',
    status: 'Unauthorized',
    statusCode: 401
  });
};

module.exports = options => compose(withJWTAuth(options));
module.exports.withJWTAuth = withJWTAuth;
