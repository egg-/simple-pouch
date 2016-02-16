var util = require('util')
var events = require('events')

function Pouch () {
  events.EventEmitter.call(this)

  this._client = null

  this.config = {
    name: 'pouch_default',
    size: 100
  }
}

util.inherits(Pouch, events.EventEmitter)

Pouch.prototype.Pouch = Pouch

Pouch.prototype.connect = function (config) {
  if (this._client) {
    this._client.end()
  }

  this._client = require('redis').createClient(config.port, config.host)

  typeof config.name !== 'undefined' && (this.config.name = 'pouch_' + config.name)
  typeof config.size !== 'undefined' && (this.config.size = config.size)

  this.events()

  return this
}

Pouch.prototype.events = function () {
  var self = this
  var events = ['error', 'ready', 'connect', 'end']

  for (var i = 0; i < events.length; i++) {
    this._client.on(events[i], (function (evt) {
      return function () {
        var args = Array.prototype.slice.call(arguments)

        args.unshift(evt)
        self.emit.apply(self, args)
      }
    }(events[i])))
  }

  return this
}

Pouch.prototype.put = function (cb, items) {
  if (typeof cb !== 'function') {
    items = cb
    cb = function () {}
  }

  var size = this.config.size
  var name = this.config.name
  var idx = 0
  var self = this
  var put = function () {
    var multi = self._client.multi()
    var cnt = Math.min(size, items.length - idx)

    for (var i = 0; i < cnt; i++, idx++) {
      multi.rpush(name, items[idx])
    }
    multi.exec(function (err) {
      if (err) {
        return cb(err)
      }
      if (idx < items.length) {
        process.nextTick(function () {
          put()
        })
      } else {
        cb(err, items.length)
      }
    })
  }

  put()

  return this
}

Pouch.prototype.pick = function (cb, size) {
  size = size || this.config.size

  this._client.multi()
    .lrange(this.config.name, 0, size - 1)
    .ltrim(this.config.name, size, -1)
    .exec(function (err, replies) {
      cb(err, replies[0])
    })

  return this
}

Pouch.prototype.count = function (cb) {
  this._client.llen(this.config.name, cb)
}

Pouch.prototype.list = function (cb, start, end) {
  this._client.lrange(this.config.name, start, end, cb)
}

Pouch.create = function (config) {
  return (new Pouch()).connect(config)
}

module.exports = Pouch
