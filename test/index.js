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
