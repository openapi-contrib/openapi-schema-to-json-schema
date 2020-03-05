const convertFromSchema = require('./converters/schema');
const convertFromParameter = require('./converters/parameter');

module.exports = {
  fromSchema: convertFromSchema,
  fromParameter: convertFromParameter
}
