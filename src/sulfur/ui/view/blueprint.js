/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define(['sulfur/util/factory'], function (Factory) {

  'use strict';

  function preprocessHtml(s) {
    // Remove unprotected whitespace between two tags.
    return s.replace(/>\s+</g, '><');
  }

  var processHtml = (function () {

    var counter = 0;
    var rand = Math.random().toString(36).substr(2);

    function getValue(index, name) {
      if (!index.hasOwnProperty(name)) {
        index[name] = counter += 1;
      }
      return index[name];
    }

    return function (s) {
      var index = {};
      // Resolve ID templates to ensure unique IDs when creating an element.
      s = s.replace(/\{{2}id:([^}]+)\}{2}/g, function (_, id) {
        var v = getValue(index, id);
        return '-sulfur-' + rand + '-' + v;
      });
      return s;
    };

  }());

  function parseHtml(markup) {
    var e = document.createElement('div');
    e.innerHTML = markup;
    return e.children;
  }

  return Factory.derive({

    /**
     * @param {object} options
     *
     * @option options {string} html
     * @option options {array} events (default [])
     * @option options {array} accessors (default [])
     */
    initialize: function (options) {
      options || (options = {});
      this._html = preprocessHtml(options.html);
      this._events = options.events || [];
      this._accessors = options.accessors || [];
    },

    createElement: function() {
      var e = parseHtml(processHtml(this._html));
      if (e.length > 1) {
        throw new Error("expecting HTML specifying only a single element");
      }
      e = e.item(0);
      return e.parentNode.removeChild(e);
    },

    bindEvents: function (element, view) {
      return this._events.map(function (event) {
        return event.bind(element, view);
      });
    },

    bindAccessors: function(element) {
      return this._accessors.map(function (accessor) {
        return accessor.bind(element);
      });
    }

  });

});
