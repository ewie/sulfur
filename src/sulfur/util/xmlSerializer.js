/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define(['sulfur/util/factory'], function (Factory) {

  'use strict';

  var NAMED_CHAR_REF = {
    '&': '&amp;',
    "'": '&apos;',
    '>': '&gt;',
    '<': '&lt;',
    '"': '&quot;'
  };

  function charRef(v) {
    return '&#x' + v.toString(16).toUpperCase() + ';';
  }

  function sanitizeValue(v) {
    var s = v.replace(/[&'><"]/g, function (c) { return NAMED_CHAR_REF[c] });
    s = s.replace(/[\x09\x0A\x0D\x7F\xFF]/g, function (c) {
      return charRef(c.charCodeAt(0));
    });
    return s.replace(/([\uD800-\uDBFF])([\uDC00-\uDFFF])/g, function (_, c, d) {
      c = c.charCodeAt(0) - 0xD800;
      d = d.charCodeAt(0) - 0xDC00;
      return charRef(0x10000 + (c << 10) + d);
    });
  }

  function serializeAttribute(a) {
    var name = a.name;
    var value = sanitizeValue(a.value);
    return name + '="' + value + '"';
  }

  function namespaceAlreadyDeclared(namespaceURI, prefix, element) {
    var p = element.parentElement;
    var xmlns = 'xmlns:' + prefix;
    while (p) {
      if (p.namespaceURI === namespaceURI && p.prefix === element.prefix) {
        return true;
      }
      if (p.hasAttribute(xmlns) && p.getAttribute(xmlns) === namespaceURI) {
        return true;
      }
      p = p.parentElement;
    }
    return false;
  }

  function serializeElement(e) {
    var s = '<' + e.tagName;

    if (!namespaceAlreadyDeclared(e.namespaceURI, e.prefix, e)) {
      s += ' xmlns:' + e.prefix + '="' + sanitizeValue(e.namespaceURI) + '"';
    }

    if (e.attributes.length) {
      var attrs = e.attributes;
      for (var j = 0; j < attrs.length; j += 1) {
        s += ' ' + serializeAttribute(attrs.item(j));
      }
    }

    if (e.children.length) {
      s += '>';
      var children = e.children;
      for (var i = 0; i < children.length; i += 1) {
        s += serializeElement(children.item(i));
      }
      s += '</' + e.tagName + '>';
    } else {
      s += '/>';
    }

    return s;
  }

  return Factory.derive({

    serializeToString: function (d) {
      return serializeElement(d.documentElement);
    }

  });

});
