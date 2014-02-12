var parse = require('url').parse;

module.exports = function (url) {
  var parsed = parse(url);

  if (url.indexOf('//') === 0)
    return 'protocolRelative';

  if (parsed.protocol === 'data:')
    return 'data';

  if (parsed.host)
    return 'absolute';

  if (parsed.pathname.charAt(0) === '/')
    return 'rootRelative';
  
  return 'relative';
};
