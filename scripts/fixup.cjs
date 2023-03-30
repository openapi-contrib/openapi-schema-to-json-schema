// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

const mjsPackage = path.join(__dirname, '../dist/mjs/package.json');
const cjsPackage = path.join(__dirname, '../dist/cjs/package.json');
try {
	fs.writeFileSync(mjsPackage, JSON.stringify({ type: 'module' }, null, 2));
	fs.writeFileSync(cjsPackage, JSON.stringify({ type: 'commonjs' }, null, 2));
} catch (e) {
	console.error(e);
}
