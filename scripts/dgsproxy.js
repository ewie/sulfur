/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/**
 * An HTTP Proxy to circumvent the missing "Access-Control-Allow-Origin" header
 * not sent by the DataGridService.
 */

var http = require('http');
var fs = require('fs');
var url = require('url');
var util = require('util');

function loadConfig(filename) {
  var json = fs.readFileSync(filename, { encoding: 'utf8' });
  var config = JSON.parse(json);
  config.proxy || (config.proxy = {});
  config.proxy.port || (config.proxy.port = 8000);
  config.dgs.path || (config.dgs.path = '/');
  config.dgs.port || (config.dgs.port = 3826);
  config.dgs.localhost || (config.dgs.localhost = 'localhost');
  return config;
}

function clone(obj) {
  return Object.keys(obj).reduce(function (copy, key) {
    copy[key] = obj[key];
    return copy;
  }, {});
}

function translateToDgs(s) {
  var pattern = new RegExp('http://localhost:' + config.proxy.port + '([^\d])', 'g');
  var sub = 'http://' + config.dgs.localhost + ':' + config.dgs.port + '$1';
  return s.replace(pattern, sub);
}

function translateFromDgs(s) {
  var pattern = new RegExp('http://' + config.dgs.localhost + ':' + config.dgs.port + '([^\d])', 'g');
  var sub = 'http://localhost:' + config.proxy.port + '$1';
  return s.replace(pattern, sub);
}

function isTextualContent(contentType) {
  if (!contentType) {
    util.debug('non-existing content-type treated as non-textual');
    return false;
  }
  if (contentType.indexOf('text/') === 0) {
    return true;
  }
  if (contentType.indexOf('application/xml') === 0) {
    return true;
  }
  if (contentType === 'application/rdf+xml' || contentType === 'application/atom+xml') {
    return true;
  }
  util.debug('unknown content-type ' + contentType + ' treated as non-textual');
  return false;
}

var filename = process.argv[2] || 'dgsproxy.json';
var config = loadConfig(filename);

process.on('uncaughtException', function (ex) {
  console.error(ex);
});

http.createServer(function (req, res) {
  var parsedUrl = url.parse(req.url);
  var headers = req.headers;

  if ('host' in headers) {
    headers = clone(req.headers);
    headers['host'] = config.dgs.localhost + ':' + config.dgs.port;
  }

  function handleDgsResponse(r) {
    var headers = r.headers;
    if ('location' in headers) {
      headers = clone(headers);
      headers['location'] = translateFromDgs(headers['location']);
    }

    headers['access-control-allow-origin'] = '*';

    res.writeHead(r.statusCode, headers);

    //r.on('error', function (error) {
    //  console.log(error);
    //});

    if (isTextualContent(headers['content-type'])) {
      // Accumulate the data so we can translate it.
      (function () {
        var data = '';

        r.on('data', function (chunk) {
          data += chunk;
        });

        r.on('end', function () {
            data = translateFromDgs(data);
          res.end(data);
        });
      }());
    } else {
      // Non-textual (binary) data will be passed on as we receive it.
      r.on('data', function (chunk) {
        res.write(chunk);
      });

      r.on('end', function () {
        res.end();
      });
    }
  }

  var options = {
    method: req.method,
    host: config.dgs.host,
    port: config.dgs.port,
    headers: headers,
    path: url.format({
      pathname: parsedUrl.pathname,
      query: parsedUrl.query,
      hash: parsedUrl.hash
    })
  };

  var r = http.request(options, handleDgsResponse);

  //req.on('error', function (error) {
  //  console.error(error);
  //});

  if (isTextualContent(headers['content-type'])) {
    // Accumulate the data so we can translate it.
    (function () {
      var data = '';

      req.on('data', function (chunk) {
        data += chunk;
      });

      req.on('end', function () {
          data = translateToDgs(data);
        r.end(data);
      });
    })();
  } else {
    // Non-textual (binary) data will be passed on as we receive it.
    req.on('data', function (chunk) {
      r.write(chunk);
    });

    req.on('end', function () {
      r.end();
    });
  }
}).listen(config.proxy.port);

console.log('listening on port ' + config.proxy.port);
console.log(config);
