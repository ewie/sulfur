var fs = require('fs');
var http = require('http');
var path = require('path');
var url = require('url');

function parseArgs(args) {
  var config = {
    proxy: 'url',
    port: 8000
  };

  while (args.length) {

    switch (args.shift()) {
      case '-p':
      case '--port':
        var port = args.shift();
        if (/^\d+$/.test(port)) {
          config.port = parseInt(port, 10);
        } else {
          console.error("invalid port " + port);
          process.exit(1);
        }

      case '-x':
      case '--proxy':
        config.proxy = args.shift();
    }

  }

  return config;
}

var config = parseArgs(process.argv.slice(1));

var handleProxyRequest = (function () {

  function copy(src) {
    return Object.keys(src).reduce(function (dst, name) {
      dst[name] = src[name];
      return dst;
    }, {});
  }

  return function handleProxyRequest(req, res) {
    var method = req.method;

    var src = url.parse(req.url, true);
    var target = url.parse(src.query[config.proxy]);

    var headers = copy(req.headers);
    headers.host = target.host;

    var options = {
      method: method,
      headers: headers,
      hostname: target.hostname,
      port: target.port,
      path: target.path
    };

    var r = http.request(options, function (r) {
      res.writeHead(r.statusCode, r.headers);
      r.on('data', res.write.bind(res));
      r.on('end', res.end.bind(res));
    });

    r.on('error', function () {
      res.writeHead(500);
      res.end();
    });

    req.on('data', r.write.bind(r));
    req.on('end', r.end.bind(r));
  };

}());

var handleFileRequest = (function () {

  var contentType = (function () {

    // XXX determine the content type using the a path's extension name
    var contentTypes = {
      'css': 'text/css',
      'js': 'application/javascript',
      'html': 'text/html',
      'svg': 'image/svg+xml'
    };

    return function contentType(p) {
      var ext = path.extname(p).substr(1);
      if (ext && contentTypes.hasOwnProperty(ext)) {
        return contentTypes[ext];
      }
      return 'text/plain';
    };

  }());

  return function (req, res) {
    var _url = url.parse(req.url);
    var path = '.' + _url.pathname;
    fs.readFile(path, function (err, data) {
      if (err) {
        res.writeHead(404);
        res.end();
      } else {
        res.writeHead(200, {
          'content-length': data.length,
          'content-type': contentType(path)
        });
        res.end(data);
      }
    });
  };

}());

var server = http.createServer(function (req, res) {
  var pathname = url.parse(req.url).pathname;
  if (pathname === '/') {
    handleProxyRequest(req, res);
  } else {
    handleFileRequest(req, res);
  }
});

console.log('listening on localhost:' + config.port + ' ...');
server.listen(config.port);
