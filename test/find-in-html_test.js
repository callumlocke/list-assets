/*global describe, it */
/*jshint expr:true */

'use strict';

var findInHTML = require('..').html,
    fs = require('fs'),
    expect = require('chai').expect,
    _ = require('lodash'),
    path = require('path');


describe('findInHTML', function() {

  var html = fs.readFileSync(path.join(__dirname, 'fixtures', 'sample.html')).toString('utf8');

  it('picks up all the right URLs in the right order', function () {
    var urls = _.pluck(findInHTML(html), 'url');

    expect(urls).to.have.length(6);
    expect(urls[0]).to.equal('something.jpg');
    expect(urls[1]).to.equal('something%20with%20spaces.jpg');
    expect(urls[2]).to.equal('hey.js');
    expect(urls[3]).to.equal('yo.css');
    expect(urls[4]).to.equal('some-css-image.png');
    expect(urls[5]).to.equal('/absolute/css/bg.png');
  });

  it('knows line and column numbers', function () {
    var results = findInHTML(html);

    var result = _.findWhere(results, {url: 'yo.css'});
    expect(result.line).to.equal(9);
    expect(result.column).to.equal(29);

    result = _.findWhere(results, {url: 'hey.js'});
    expect(result.line).to.equal(4);
    expect(result.column).to.equal(8);

    result = _.findWhere(results, {url: 'something.jpg'});
    expect(result.line).to.equal(1);
    expect(result.column).to.equal(5);
    expect(result.length).to.equal(19);

    // In <style> block
    result = _.findWhere(results, {url: 'some-css-image.png'});
    expect(result.line).to.equal(18);
    expect(result.column).to.equal(4);
    expect(result.length).to.equal(35);
  });

  it('works with custom options', function () {
    var urls = _.pluck(findInHTML(html, {
      data: true,
      protocolRelative: true,
      extraLocations: {
        'div': 'data-foobar'
      }
    }), 'url');

    expect(urls).to.have.length(9);
  });

});
