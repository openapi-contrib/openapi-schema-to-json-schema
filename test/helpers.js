var fs = require('fs')
	,	join = require('path').join
;

module.exports = {
	getSchema: getSchema
};

function getSchema(file) {
	var path = join(__dirname, 'schemas', file);
	return JSON.parse(fs.readFileSync(path));
}
