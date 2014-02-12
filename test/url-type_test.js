/*global describe, it */
/*jshint expr:true */

'use strict';

var urlType = require('../lib/url-type'),
    expect = require('chai').expect;

describe('urlType', function() {

  it('relative', function () {
    expect(urlType('some/file.js')).to.equal('relative');
    expect(urlType('../../../some/file.js')).to.equal('relative');
  });

  it('rootRelative', function () {
    expect(urlType('/some/file.js')).to.equal('rootRelative');
  });

  it('protocolRelative', function () {
    expect(urlType('//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js')).to.equal('protocolRelative');
  });

  it('data', function () {
    expect(urlType('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==')).to.equal('data');
  });

  it('absolute', function () {
    expect(urlType('http://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js')).to.equal('absolute');
  });

});
