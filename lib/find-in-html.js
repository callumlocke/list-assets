'use strict';

var Soup = require('soup'),
    findInCSS = require('./find-in-css'),
    defaults = require('./defaults'),
    urlType = require('./url-type');

module.exports = function findInHTML(html, options) {
  // Handle args
  var key;
  if (!options)
    options = defaults;
  else {
    for (key in defaults) {
      if (defaults.hasOwnProperty(key) && !options[key])
        options[key] = defaults[key];
    }
  }

  // Make list of places to search
  var locations = {}, selector;
  if (options.extraLocations) {
    for (selector in options.extraLocations) {
      if (options.extraLocations.hasOwnProperty(selector))
        locations[selector] = options.extraLocations[selector];
    }
  }
  if (options.images)
    locations['img'] = 'src';
  if (options.stylesheets)
    locations['link[rel=stylesheet]'] = 'href';
  if (options.scripts)
    locations['script'] = 'src';


  var results = [];
  var soup = new Soup(html);

  // Get an array of line lengths
  var lines = html.split('\n');
  var lineLengths = [];
  var numLines = lines.length;
  for (var i = 0; i < numLines; i++) {
    var line = lines[i];
    lineLengths[i] = line.length + 1; // is push quicker?
  }

  function getLineAndColumn(charIndex) {
    // Returns a line number and column number (as a 2-item array).
    var charCount = 0, i = 0;
    do {
      charCount += lineLengths[i];
      i++;
    } while (charCount <= charIndex && i < numLines);
    charCount -= lineLengths[i-1]; // charCount is now to the beginning of the line
    var colCount = charIndex - charCount;

    return [i, colCount];
  }

  var foundAttr = function (value, charIndex, endIndex) {
    if (value && value.length) {
      // Establish the line and column number
      var lc = getLineAndColumn(charIndex);

      results.push({
        url: value,
        line: lc[0],
        column: lc[1],
        length: endIndex - charIndex,
        start: charIndex,
        end: endIndex
      });
    }
  };

  for (selector in locations) {
    if (locations.hasOwnProperty(selector)) {
      var attrName = locations[selector];

      soup.getAttribute(selector, attrName, foundAttr);

      // TODO in next version: if attrName is a func, use cheerio instead of soup: call .each(), and pass the func the cheerio-wrapped element.
    }
  }

  // Filter them
  results = results.filter(function (url) {
    return options[urlType(url.url)] === true;
  });

  // Add any URLs from inline <style> elements (this does its own filtering)
  var cssOptions = {};
  for (key in options) {
    if (options.hasOwnProperty(key))
      cssOptions[key] = options[key];
  }
  soup.getInnerHTML('style', function (innerHTML, start) {
    cssOptions.lineOffset = getLineAndColumn(start)[0] - 1;
    cssOptions.charOffset = start;
    results = results.concat( findInCSS(innerHTML, cssOptions) );
  });

  // Return a sorted array of results
  return results.sort(function (a, b) {
    if (a.line === b.line)
      return a.column - b.column;
    return a.line - b.line;
  });
};
