'use strict';

const http = require('http');

const etstatic = require('../lib/etstatic')({
  root: `${__dirname}/public`,
  showDir: true,
  autoIndex: true,
});

http.createServer(etstatic).listen(8080);

console.log('Listening on :8080');
