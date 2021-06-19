var test = require('tape');
var convert = require('../');

test('using hooks', function (assert) {
  assert.plan(3)

  var schema = {
    type: 'boolean',
  }

  var result = convert.fromSchema(schema, {
    beforeTransform: function(schema, options) {
        assert.equal(typeof options, 'object', 'options passed')
        schema.type = 'string'
        return schema
    },
    afterTransform: function(schema, options) {
        assert.equal(typeof options, 'object', 'options passed')
        schema.examples = ['foo', 'bar']
        return schema
    },
 })

  var expected = {
    $schema: 'http://json-schema.org/draft-04/schema#',
    type: 'string',
    examples: ['foo', 'bar']
  }

  assert.deepEqual(result, expected, 'custom handler called')
})
