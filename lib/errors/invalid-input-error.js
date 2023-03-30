module.exports = InvalidInputError

function InvalidInputError (message) {
  this.name = 'InvalidInputError'
  this.message = message
}

InvalidInputError.prototype = new Error()
