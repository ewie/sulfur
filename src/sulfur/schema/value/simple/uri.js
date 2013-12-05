/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define(['sulfur/util/factory'], function (Factory) {

  'use strict';

  var pattern = (function () {

    var p = {
      patterns: Object.create(null),
      resolved: Object.create(null),
      add: function (name, pattern) {
        this.patterns[name] = '(?:' + pattern.source + ')';
      },
      resolve: function (name) {
        if (!(name in this.resolved)) {
          this.resolved[name] = this.patterns[name].replace(/<([^>]+)>/g, function (_, name) {
            if (!(name in this.patterns)) {
              throw new Error("unknown symbol " + name);
            }
            return this.resolve(name);
          }.bind(this));
        }
        return this.resolved[name];
      }
    };

    // Build the regex to match a valid URI using the grammar given in RFC 2396
    // Appendix A (http://tools.ietf.org/html/rfc2396#appendix-A) and the
    // changes in RFC 2732.

    p.add('abs_path',      /\/<path_segments>/);
    p.add('absoluteURI',   /<scheme>:(?:<hier_part>|<opaque_part>)/);
    p.add('alpha',         /[A-Za-z]/);
    p.add('alphanum',      /<digit>|<alpha>/);
    p.add('authority',     /<server>|<reg_name>/);
    p.add('digit',         /[0-9]/);
    p.add('domainlabel',   /<alphanum>|<alphanum>(?:<alphanum>-)*<alphanum>/);
    p.add('escaped',       /%<hex>{2}/);
    p.add('fragment',      /<uric>*/);
    p.add('hex',           /<digit>|[A-Fa-f]/);
    p.add('hex4',          /<hex>{1,4}/);
    p.add('hexpart',       /<hexseq>|<hexseq>?::<hexseq>?/);
    p.add('hexseq',        /<hex4>(?::<hex4>)*/);
    p.add('hier_part',     /(?:<net_path>|<abs_path>)(?:\?<query>)?/);
    p.add('host',          /<hostname>|<IPv4address>|\[<IPv6address>\]/);
    p.add('hostname',      /(?:<domainlabel>\.)*<toplabel>\.?/);
    p.add('hostport',      /<host>(?::<port>)?/);
    p.add('IPv4address',   /<digit>{3}(?:\.<digit>{3}){3}/);
    p.add('IPv6address',   /<hexpart>(?::<IPv4address>)?/);
    p.add('net_path',      /\/\/<authority><abs_path>?/);
    p.add('opaque_part',   /<uric_no_slash><uric>*/);
    p.add('param',         /<pchar>*/);
    p.add('path_segments', /<segment>(?:\/<segment>)*/);
    p.add('pchar',         /<unreserved>|<escaped>|[:@&=+$,]/);
    p.add('port',          /<digit>*/);
    p.add('query',         /<uric>*/);
    p.add('reg_name',      /(?:<unreserved>|<escaped>|[&,;:@&=+])+/);
    p.add('rel_path',      /<rel_segment><abs_path>?/);
    p.add('rel_segment',   /(?:<unreserved>|<escaped>|[;@&=+$,])+/);
    p.add('relativeURI',   /(?:<net_path>|<abs_path>|<rel_path>)(?:\?<query>)?/);
    p.add('reserved',      /[;/?:@&=+$,[\]]/);
    p.add('scheme',        /<alpha>(?:<alphanum>|[+.-])*/);
    p.add('segment',       /<pchar>*(?:;<param>)*/);
    p.add('server',        /(?:(?:<userinfo>@)?<hostport>)?/);
    p.add('toplabel',      /<alpha>|<alpha>(?:<alphanum>-)*<alphanum>/);
    p.add('unreserved',    /<alphanum>|[_.!~*'()-]/);
    p.add('uric',          /<reserved>|<unreserved>|<escaped>/);
    p.add('uric_no_slash', /<unreserved>|<escaped>|[;?:@&=+$,]/);
    p.add('URI-reference', /<absoluteURI>|<relativeURI>|#<fragment>/);
    p.add('userinfo',      /(?:<unreserved>|<escaped>|[;:&=+$,])*/);

    return new RegExp('^' + p.resolve('URI-reference') + '$');

  }());

  return Factory.clone({

    parse: function (s) {
      return this.create(s);
    }

  }).augment({

    initialize: function (value) {
      if (!pattern.test(value)) {
        throw new Error("invalid URI");
      }
      this._value = value;
    },

    get length() {
      return this._value.length;
    },

    toString: function () {
      return this._value;
    }

  });

});
