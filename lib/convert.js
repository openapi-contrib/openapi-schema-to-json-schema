var convertFromSchema = require('./converters/schema')
var convertFromParameter = require('./converters/parameter')

module.exports = {
  fromSchema: convertFromSchema,
  fromParameter: convertFromParameter
}
