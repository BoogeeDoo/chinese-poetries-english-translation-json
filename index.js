'use strict';

const fs = require('fs');
const path = require('path');

const JSON_ROOT = path.join(__dirname, 'poetries');

const fns = fs.readdirSync(JSON_ROOT);

let ret = [];
for (const name of fns) {
  const arr = require(path.join(JSON_ROOT, name));
  ret = ret.concat(arr);
}

module.exports = ret;
