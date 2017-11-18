const {compose, handle} = require('linklet');
const withParams = require('./with-params');

const withRoute = options => handler => (req, res) => {
  return req.hasParamMatch
    ? handle(req, res, options[req.method])
    : handler
      ? handler(req, res)
      : handle(req, res, null, {
          message: 'Route not found',
          status: 'Not found',
          statusCode: 404
        });
};

module.exports = options => compose(withParams(options), withRoute(options));
module.exports.withRoute = withRoute;
