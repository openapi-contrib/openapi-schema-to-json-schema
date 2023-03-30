var test = require('tape');
var convert = require('../');

test('using exports.fromSchema', function (assert) {
  assert.plan(1)

  var schema = {
    type: 'string',
    nullable: true
  }

  var result = convert.fromSchema(schema)

  var expected = {
    $schema: 'http://json-schema.org/draft-04/schema#',
    type: ['string', 'null']
  }

  assert.deepEqual(result, expected, 'converted')
})
