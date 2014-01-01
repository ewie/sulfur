/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'jszip',
  'text!app/icon.svg',
  'text!app/widget/index.html'
], function (JSZip, iconSvg, indexHtml) {

  'use strict';

  return {

    get namespaceURI() { return 'http://www.w3.org/ns/widgets' },

    archiveFileName: function (widget) {
      var baseName = widget.name.replace(/[^A-Za-z0-9_-]+/g, '-');
      return baseName + '.wgt';
    },

    createConfigurationDocument: function (widget, dgs) {
      var ns = this.namespaceURI;

      var d = document.implementation.createDocument(ns, 'widget');

      var r = d.documentElement;

      var e = d.createElementNS(ns, 'name');
      e.textContent = widget.name;
      r.appendChild(e);

      e = d.createElementNS(ns, 'content');
      e.setAttribute('src', 'index.html');
      e.setAttribute('type', 'text/html');
      r.appendChild(e);

      e = d.createElementNS(ns, 'preference');
      e.setAttribute('name', 'endpoint');
      e.setAttribute('value', dgs.endpoint);
      r.appendChild(e);

      e = d.createElementNS(ns, 'preference');
      e.setAttribute('name', 'name');
      e.setAttribute('value', widget.resource.name);
      r.appendChild(e);

      e = d.createElementNS(ns, 'icon');
      e.setAttribute('src', 'icon.svg');
      r.appendChild(e);

      if (widget.description) {
        e = d.createElementNS(ns, 'description');
        e.textContent = widget.description;
        r.appendChild(e);
      }

      var authorName = widget.authorName;
      var authorEmail = widget.authorEmail;

      if (authorName || authorEmail) {
        e = d.createElementNS(ns, 'author');
        authorName && (e.textContent = authorName);
        authorEmail && (e.setAttribute('email', authorEmail));
        r.appendChild(e);
      }

      return d;
    },

    createArchive: function (widget, dgs) {
      var z = new JSZip();

      var xs = new XMLSerializer();
      var d = this.createConfigurationDocument(widget, dgs);
      var configXml = xs.serializeToString(d);

      z.file('config.xml', '<?xml version="1.0" encoding="utf-8"?>' + configXml);
      z.file('index.html', indexHtml);
      z.file('icon.svg', iconSvg);

      return z.generate({ type: 'blob', compression: 'DEFLATE' });
    }

  };

});
