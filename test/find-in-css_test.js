/*global describe, it */
/*jshint expr:true */

'use strict';

var findInCSS = require('..').css,
    fs = require('fs'),
    expect = require('chai').expect,
    _ = require('lodash'),
    path = require('path');


describe('findInCSS', function() {

  var css = fs.readFileSync(
    path.join(__dirname, 'fixtures', 'sample.css')
  ).toString('utf8');

  var results = findInCSS(css);
  var urls = _.pluck(results, 'url');

  it('finds the URLs', function () {
    expect(urls).to.have.length(18);
  });

  it('finds font URLs declared on the same line', function () {
    expect(urls).to.contain('fonts/coool.eot?#iefix');
    expect(urls).to.contain('fonts/coool.woff');
    expect(urls).to.contain('fonts/coool.ttf');
    expect(urls).to.contain('fonts/coool.svg#coool');
  });

  it('can find things in hacky places', function () {
    expect(urls).to.contain('scripts/boxsizing1.htc');
    expect(urls).to.contain('scripts/boxsizing2.htc');
    expect(urls).to.contain('scripts/boxsizing3.htc');
  });

  it('gets line and column numbers', function () {
    var result = _.findWhere(results, {'url': 'fonts/coool.svg#coool'});
    expect(result.line).to.equal(45);
    expect(result.column).to.equal(5);
    expect(result.length).to.equal(196);
  });

});
