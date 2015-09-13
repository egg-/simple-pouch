# simple-pouch

[![version](https://img.shields.io/npm/v/simple-pouch.svg) ![download](https://img.shields.io/npm/dm/simple-pouch.svg)](https://www.npmjs.com/package/simple-pouch)

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

A simple, lightweight queue using Redis rpush and lrange, ltrim.


## Usage

```javascript
var pouch = require('../lib/pouch').create({
  host: '127.0.0.1',
  port: 6379,
  name: 'test',
  size: 50
})

// put items
pouch.put(['1', '2', '3', '4', '5'])
pouch.put(function (err, len) {
  console.log(len)
}, ['6', '7', '8', '9', '10'])

pouch.count(function (err, count) {
  console.log('count: ' + count)
})

setTimeout(function () {
  pouch.pick(function (err, items) {
    console.log(items)

    pouch.count(function (err, count) {
      console.log('count: ' + count)
    })
  }, 8)
}, 500)
```


## LICENSE

simple-pouch is licensed under the MIT license.
