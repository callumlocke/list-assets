# list-assets [![Build Status](https://secure.travis-ci.org/callumlocke/list-assets.png?branch=master)](http://travis-ci.org/callumlocke/list-assets)

> Scans HTML and CSS for static resource URLs.

## Usage

`npm install list-assets`

```javascript
var listAssets = require('list-assets');

var urls = listAssets.html('<img src="foo.jpg">\n\n<link rel="stylesheet" href="bar.css">');
console.log(urls);
```

Output:

```javascript
[
  {
    url: 'foo.jpg',
    line: 1,
    column: 5,
    length: 13
    start: 5,
    end: 18
  },
  {
    url: 'bar.css',
    line: 3,
    column: 23,
    length: 14,
    start: 44,
    end: 58
  }
]
```

- You can also do `findResources.css(cssString)` to find resource URLs in CSS (background images, fonts – anything in a `url(...)`).
- `.html()` also uses `.css()` to search inside any inline `<style>` elements.
- Both functions accept an options object as a second argument.


## Options

These properties (shown here with their defaults) are for specifying what kinds of URLs you want to find:

- `relative` (true) – 'some/file.js'
- `rootRelative` (true) – '/some/file.js'
- `absolute` (false) – eg, `http://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js`
- `protocolRelative` (false) – eg, `//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js`
- `data` (false) – [data URIs](http://en.wikipedia.org/wiki/Data_Uri), eg `data:image/png;base64,iVBORw0KGg...`

These options are for choosing where to look for asset URLs (these have no effect on a CSS search):

- `images` (true)
- `stylesheets` (true)
- `scripts` (true)

<!-- Not yet implemented:
- `videos` (true)
- `objects` (true)
-->

Finally, you can also pass:

- `extraLocations` (null) – an object of key-value pairs that specify extra locations within your HTML where asset URLs can be found.

The key is a selector, and the value is the name of the attribute that might contain an asset URL.

For example:

```javascript
var options = {
  extraLocations: {
    '.some-selector': 'data-some-custom-thing'
  }
};
```

(You might want to use `extraLocations` if you're doing some kind of JavaScript-powered thing that dynamically creates images based on data-attributes.)


## License
Copyright (c) 2014 . Licensed under the MIT license.
