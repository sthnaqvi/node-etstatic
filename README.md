# etstatic [![build status](https://secure.travis-ci.org/jfhbrook/node-etstatic.png)](http://travis-ci.org/jfhbrook/node-etstatic) [![codecov.io](https://codecov.io/github/jfhbrook/node-etstatic/coverage.svg?branch=master)](https://codecov.io/github/jfhbrook/node-etstatic?branch=master)

![](http://imgur.com/vhub5.png)

A simple static file server middleware with custom error file. Use it with a raw http server,
express/connect or on the CLI!

# Examples:

## express 4.x

``` js
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
```

## stock http server

``` js
'use strict';

const http = require('http');

const etstatic = require('../lib/etstatic')({
  root: `${__dirname}/public`,
  showDir: true,
  autoIndex: true,
});

http.createServer(etstatic).listen(8080);

console.log('Listening on :8080');
```

### fall through
To allow fall through to your custom routes:

```js
etstatic({ root: __dirname + '/public', handleError: false })
```

## CLI

```sh
etstatic ./public --port 8080
```

# Install:

For using etstatic as a library, just npm install it into your project:

```sh
npm install --save etstatic
```

For using etstatic as a cli tool, either npm install it globally:

```sh
npm install etstatic -g
```

or install it locally and use npm runscripts to add it to your $PATH, or
reference it directly with `./node_modules/.bin/etstatic`.


# API:

## etstatic(opts);
## $ etstatic [dir?] {options} --port PORT

In node, pass etstatic an options hash, and it will return your middleware!

```js
const opts = {
  root: path.join(__dirname, 'public'),
  baseDir: '/',
  autoIndex: true,
  showDir: true,
  showDotfiles: true,
  humanReadable: true,
  hidePermissions: false,
  si: false,
  cache: 'max-age=3600',
  cors: false,
  gzip: true,
  defaultExt: 'html',
  handleError: true,
  errorFileName: 'index',
  serverHeader: true,
  contentType: 'application/octet-stream',
  weakEtags: true,
  weakCompare: true,
  handleOptionsMethod: false,
}
```

If `opts` is a string, the string is assigned to the root folder and all other
options are set to their defaults.

When running in CLI mode, all options work as above, passed in
[optimist](https://github.com/substack/node-optimist) style. `port` defaults to
`8000`. If a `dir` or `--root dir` argument is not passed, ecsatic will
serve the current dir. etstatic also respects the PORT environment variable.

### `opts.root`
### `--root {root}`

`opts.root` is the directory you want to serve up.

### `opts.port`
### `--port {port}`

In CLI mode, `opts.port` is the port you want etstatic to listen to. Defaults
to 8000. This can be overridden with the `--port` flag or with the PORT
environment variable.

### `opts.baseDir`
### `--baseDir {dir}`

`opts.baseDir` is `/` by default, but can be changed to allow your static files
to be served off a specific route. For example, if `opts.baseDir === "blog"`
and `opts.root = "./public"`, requests for `localhost:8080/blog/index.html` will
resolve to `./public/index.html`.

### `opts.cache`
### `--cache {value}`

Customize cache control with `opts.cache` , if it is a number then it will set max-age in seconds.
Other wise it will pass through directly to cache-control. Time defaults to 3600 s (ie, 1 hour).

If it is a function, it will be executed on every request, and passed the pathname.  Whatever it returns, string or number, will be used as the cache control header like above.

### `opts.showDir`
### `--no-showDir`

Turn **off** directory listings with `opts.showDir === false`. Defaults to **true**.

### `opts.showDotfiles`
### `--no-showDotfiles`

Exclude dotfiles from directory listings with `opts.showDotfiles === false`. Defaults to **true**.

### `opts.humanReadable`
### `--no-human-readable`

If showDir is enabled, add human-readable file sizes. Defaults to **true**.
Aliases are `humanreadable` and `human-readable`.

### `opts.hidePermissions`
### `--hide-permissions`
If hidePermissions is enabled, file permissions will not be displayed. Defaults to **false**.
Aliases are `hidepermissions` and `hide-permissions`.

### `opts.headers`
### `--H {HeaderA: valA} [--H {HeaderB: valB}]`

Set headers on every response. `opts.headers` can be an object mapping string
header names to string header values, a colon (:) separated string, or an array
of colon separated strings.

`opts.H` and `opts.header` are aliased to `opts.headers` so that you can use
`-H` and `--header` options to set headers on the command-line like curl:

``` sh
$ etstatic ./public -p 5000 -H 'Access-Control-Allow-Origin: *'
```

### `opts.si`
### `--si`

If showDir and humanReadable are enabled, print file sizes with base 1000 instead
of base 1024. Name is inferred from cli options for `ls`. Aliased to `index`, the
equivalent option in Apache.

### `opts.autoIndex`
### `--no-autoindex`

Serve `/path/index.html` when `/path/` is requested.
Turn **off** autoIndexing with `opts.autoIndex === false`. Defaults to **true**.

### `opts.defaultExt`
### `--defaultExt {ext}`

Turn on default file extensions with `opts.defaultExt`. If `opts.defaultExt` is
true, it will default to `html`. For example if you want a request to `/a-file`
to resolve to `./public/a-file.html`, set this to `true`. If you want
`/a-file` to resolve to `./public/a-file.json` instead, set `opts.defaultExt` to
`json`.

### `opts.gzip`
### `--no-gzip`

By default, etstatic will serve `./public/some-file.js.gz` in place of
`./public/some-file.js` when the gzipped version exists and etstatic determines
that the behavior is appropriate. If `./public/some-file.js.gz` is not valid
gzip, this will fall back to `./public/some-file.js`. You can turn this off
with `opts.gzip === false`.

### `opts.serverHeader`
### `--no-server-header`

Set `opts.serverHeader` to false in order to turn off setting the `Server`
header on all responses served by etstatic.

### `opts.contentType`
### `--content-type {type}`

Set `opts.contentType` in order to change default Content-Type header value.
Defaults to **application/octet-stream**.

### `opts.mimeTypes`
### `--mime-types {filename}`

Add new or override one or more mime-types. This affects the HTTP Content-Type
header. Can either be a path to a
[`.types`](http://svn.apache.org/repos/asf/httpd/httpd/trunk/docs/conf/mime.types)
file or an object hash of type(s).

    etstatic({ mimeType: { 'mime-type': ['file_extension', 'file_extension'] } })

### `opts.handleError`

Turn **off** handleErrors to allow fall-through with
`opts.handleError === false`, Defaults to **true**.

### `opts.errorFileName`

Set `opts.errorFileName = 'index'` to set error file when **handleErrors=true** , Defaults errorFileName is **404**.

### `opts.weakEtags`
### `--no-weak-etags`

Set `opts.weakEtags` to false in order to generate strong etags instead of
weak etags. Defaults to **true**. See `opts.weakCompare` as well.

### `opts.weakCompare`
### `--no-weak-compare`

Turn off weakCompare to disable the weak comparison function for etag
validation. Defaults to **true**. See
https://www.ietf.org/rfc/rfc2616.txt Section 13.3.3 for more details.

### `opts.handleOptionsMethod`
### `--handle-options-method`

Set handleOptionsMethod to true in order to respond to 'OPTIONS' calls with any standard/set headers. Defaults to **false**. Useful for hacking up CORS support.

### `opts.cors`
### `--cors`

This is a **convenience** setting which turns on `handleOptionsMethod` and sets the headers **Access-Control-Allow-Origin: \*** and **Access-Control-Allow-Headers: Authorization, Content-Type, If-Match, If-Modified-Since, If-None-Match, If-Unmodified-Since**. This *should* be enough to quickly make cross-origin resource sharing work between development APIs. More advanced usage can come either from overriding these headers with the headers argument, or by using the `handleOptionsMethod` flag and then setting headers "manually." Alternately, just do it in your app using separate middlewares/abstractions.

Defaults to **false**.

## middleware(req, res, next);

This works more or less as you'd expect.

### etstatic.showDir(folder);

This returns another middleware which will attempt to show a directory view. Turning on auto-indexing is roughly equivalent to adding this middleware after an etstatic middleware with autoindexing disabled.

# Tests:

etstatic has a fairly extensive test suite. You can run it with:

```sh
$ npm test
```

# Contribute:

Without outside contributions, etstatic would wither and die! Before
contributing, take a quick look at the contributing guidelines in
[./CONTRIBUTING.md](./CONTRIBUTING.md) . They're relatively painless, I promise.

# License:

MIT. See LICENSE.txt. For contributors, see CONTRIBUTORS.md
