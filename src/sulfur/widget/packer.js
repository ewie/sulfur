/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'jszip',
  'text!app/common/icon.svg',
  'text!app/common/style.css',
  'text!app/widget/index.html',
  'text!app/widget/main-built.js',
  'text!app/widget/style.css'
], function (JSZip, iconSvg, commonStyleCss, indexHtml, mainJs, styleCss) {

  'use strict';

  function addContent(d, ns, e, fileName, mediaType) {
    var f = d.createElementNS(ns, 'content');
    f.setAttribute('src', fileName);
    f.setAttribute('type', mediaType);
    e.appendChild(f);
  }

  function addPreference(d, ns, e, name, value) {
    var f = d.createElementNS(ns, 'preference');
    f.setAttribute('name', name);
    f.setAttribute('value', value);
    e.appendChild(f);
  }

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

      addContent(d, ns, r, 'index.html', 'text/html');
      addContent(d, ns, r, 'main.js', 'application/javascript');
      addContent(d, ns, r, 'style.css', 'text/css');

      addPreference(d, ns, r, 'endpoint', dgs.endpoint);
      addPreference(d, ns, r, 'recordCollectionName', widget.resource.recordCollectionName);

      widget.resource.hasFiles && addPreference(d, ns, r,
        'fileCollectionName', widget.resource.fileCollectionName);

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
      z.file('main.js', mainJs);
      z.file('style.css', commonStyleCss + styleCss);

      return z.generate({ type: 'blob', compression: 'DEFLATE' });
    }

  };

});
