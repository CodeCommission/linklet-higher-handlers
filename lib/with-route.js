const {compose, handle, withParams} = require('linklet');

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
