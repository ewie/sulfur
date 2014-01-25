/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'jszip',
  'text!app/common/sulfur.svg',
  'text!app/common/style.css',
  'text!app/widget/index.html',
  'text!app/widget/main-built.js',
  'text!app/widget/style.css'
], function (JSZip, sulfurSvg, commonStyleCss, indexHtml, mainJs, styleCss) {

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

  var getIconName = (function () {

    var mediaTypes = {
      'image/gif': 'gif',
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/svg': 'svg',
      'image/vnd.microsft.ico': 'ico'
    };

    return function (file) {
      if (mediaTypes.hasOwnProperty(file.type)) {
        return 'icon.' + mediaTypes[file.type];
      }
      throw new Error("unknown icon file type");
    };

  }());

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
      addContent(d, ns, r, 'sulfur.svg', 'image/svg');

      addPreference(d, ns, r, 'endpoint', dgs.endpoint);
      addPreference(d, ns, r, 'recordCollectionName', widget.resource.recordCollectionName);

      widget.resource.hasFiles && addPreference(d, ns, r,
        'fileCollectionName', widget.resource.fileCollectionName);

      e = d.createElementNS(ns, 'icon');
      if (widget.icon) {
        e.setAttribute('src', getIconName(widget.icon.file));
      } else {
        e.setAttribute('src', 'sulfur.svg');
      }
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
      z.file('sulfur.svg', sulfurSvg);
      z.file('main.js', mainJs);
      z.file('style.css', commonStyleCss + styleCss);

      if (widget.icon) {
        z.file(getIconName(widget.icon.file), widget.icon.blob);
      }

      return z.generate({ type: 'blob', compression: 'DEFLATE' });
    }

  };

});
