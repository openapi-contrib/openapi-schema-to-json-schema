module.exports = InvalidTypeError

function InvalidTypeError (message) {
  this.name = 'InvalidTypeError'
  this.message = message
}

InvalidTypeError.prototype = Error.prototype
