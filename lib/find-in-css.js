'use strict';

var cssParse = require('css-parse'),
    urlType = require('./url-type'),
    defaults = require('./defaults');

var urlMatcher = /url\(\s*['"]?([^)'"]+)['"]?\s*\)/g;

module.exports = function findInCSS(css, options) {
  // Handle args
  if (!options)
    options = defaults;
  else {
    for (var key in defaults) {
      if (defaults.hasOwnProperty(key) && !options[key])
        options[key] = defaults[key];
    }
  }
  options.lineOffset = +options.lineOffset || 0;
  options.charOffset = +options.charOffset || 0;

  // Parse the CSS
  var parsed;
  try {
    parsed = cssParse(css, {position: true});
  } catch (e) {
    throw new Error('CSS parsing error: ' + e.message);
  }

  // Prepare array of line lengths
  var lines = css.split('\n');
  var lineLengths = [];
  var numLines = lines.length;
  for (var i = 0; i < numLines; i++) {
    lineLengths[i] = lines[i].length + 1;
  }
  function getCharacterIndex(line, column) {
    var total = column;
    line--;
    while (--line > -1 && lineLengths[line]) total += lineLengths[line];
    return total;
  }


  // Find all the URLs
  var rules = parsed.stylesheet.rules,
      results = [],
      rl, j, dl, declarations, dec, value, m;

  for (i = 0, rl = rules.length; i < rl; i++) {
    declarations = rules[i].declarations;
    if (!declarations) continue;
    
    for (j = 0, dl = declarations.length; j < dl; j++) {
      dec = declarations[j];
      value = dec.value;
      if (!value) continue;

      do {
        m = urlMatcher.exec(value);


        if (m) {
          var line = dec.position.start.line,
              column = dec.position.start.column - 1,
              startIndex = getCharacterIndex(line, column),
              endIndex = getCharacterIndex(
                dec.position.end.line,
                dec.position.end.column - 1
              ),
              length = endIndex - startIndex;

          results.push({
            url: m[1].trim(),
            line: line + options.lineOffset,
            column: column,
            length: length,
            start: startIndex + options.charOffset,
            end: endIndex + options.charOffset
          });
        }
      } while (m); // @font-face src properties can have more than one url()
    }
  }

  // Filter them to only the requested types
  return results.filter(function (result) {
    return result.url && options[urlType(result.url)] === true;
  });
};
