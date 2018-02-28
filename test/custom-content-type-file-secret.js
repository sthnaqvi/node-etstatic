'use strict';

const test = require('tap').test;
const http = require('http');
const request = require('request');
const etstatic = require('../');

test('custom contentType via .types file', (t) => {
  let server = null;
  try {
    server = http.createServer(etstatic({
      root: `${__dirname}/public/`,
      mimetypes: `${__dirname}/fixtures/custom_mime_type.types`,
    }));
  } catch (e) {
    t.fail(e.message);
    t.end();
  }

  t.plan(3);

  server.listen(0, () => {
    const port = server.address().port;
    request.get(`http://localhost:${port}/custom_mime_type.opml`, (err, res) => {
      t.ifError(err);
      t.equal(res.statusCode, 200, 'custom_mime_type.opml should be found');
      t.equal(res.headers['content-type'], 'application/secret; charset=utf-8');
      server.close(() => { t.end(); });
    });
  });
});
