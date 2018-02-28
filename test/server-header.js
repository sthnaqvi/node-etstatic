'use strict';

const test = require('tap').test;
const etstatic = require('../');
const http = require('http');
const request = require('request');

test('serverHeader should exist', (t) => {
  t.plan(2);

  const server = http.createServer(etstatic(`${__dirname}/public/subdir`));

  t.on('end', () => { server.close(); });

  server.listen(0, () => {
    const port = server.address().port;
    request.get(`http://localhost:${port}`, (err, res) => {
      t.ifError(err);
      t.equal(res.headers.server, `etstatic-${etstatic.version}`);
    });
  });
});

test('serverHeader should not exist', (t) => {
  t.plan(2);

  const server = http.createServer(etstatic(`${__dirname}/public/subdir`, {
    serverHeader: false,
  }));

  t.on('end', () => { server.close(); });

  server.listen(0, () => {
    const port = server.address().port;
    request.get(`http://localhost:${port}`, (err, res) => {
      t.ifError(err);
      t.equal(res.headers.server, undefined);
    });
  });
});
