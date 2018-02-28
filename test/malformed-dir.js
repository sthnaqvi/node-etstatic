'use strict';

const test = require('tap').test;
const etstatic = require('../lib/etstatic');
const http = require('http');
const request = require('request');

test('malformed showdir uri', (t) => {
  const server = http.createServer(etstatic(__dirname, { showDir: true }));

  t.plan(2);

  server.listen(0, () => {
    request.get(`http://localhost:${server.address().port}/?%`, (err, res) => {
      t.ifError(err);
      t.equal(res.statusCode, 400);
      server.close(() => { t.end(); });
    });
  });
});
