const url = require('url');
const pathToRegexp = require('path-to-regexp');

module.exports = ({path}) => handler => (req, res) => {
  req.hasParamMatch = false;
  const uri = url.parse(req.url, true);
  const paramKeys = [];
  const pathMatchingPattern = pathToRegexp(path, paramKeys);

  const isPatternMatchesPath = pathMatchingPattern.exec(
    req.url.replace(uri.search, '')
  );

  if (!isPatternMatchesPath) return handler(req, res);
  if (!isPatternMatchesPath.length) return handler(req, res);

  req.hasParamMatch = true;
  const paramValues = isPatternMatchesPath.splice(
    1,
    isPatternMatchesPath.length - 1
  );

  req.params = paramKeys.reduce((state, next, idx) => {
    state[next.name] = paramValues[idx];
    return state;
  }, {});

  return handler(req, res);
};
