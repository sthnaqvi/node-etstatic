'use strict';

const express = require('express');
const etstatic = require('../lib/etstatic');
const http = require('http');

const app = express();

app.use(etstatic({
  root: `${__dirname}/public`,
  showdir: true,
}));

http.createServer(app).listen(8080);

console.log('Listening on :8080');
