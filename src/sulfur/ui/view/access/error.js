/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define(['sulfur/util/factory'], function (Factory) {

  'use strict';

  var ATTR_NAME = 'data-error-message';
  var ERRORABLE_CLASS = 'errorable';
  var ERROR_CLASS = 'error';

  function findErrorableWrapper(e) {
    do {
      e = e.parentElement;
    } while (e && !e.classList.contains(ERRORABLE_CLASS));
    return e;
  }

  return Factory.derive({

    initialize: function (element) {
      var wrap = findErrorableWrapper(element);
      if (!wrap) {
        wrap = element.ownerDocument.createElement('div');
        wrap.className = ERRORABLE_CLASS;
        element.parentNode.replaceChild(wrap, element);
        wrap.appendChild(element);
      }
      this._element = wrap;
    },

    get error() {
      if (this._element.hasAttribute(ATTR_NAME)) {
        return this._element.getAttribute(ATTR_NAME);
      }
    },

    set error(value) {
      var cl = this._element.classList;
      value ? cl.add(ERROR_CLASS) : cl.remove(ERROR_CLASS);
      if (value && typeof value === 'string') {
        this._element.setAttribute(ATTR_NAME, value);
      } else {
        this._element.removeAttribute(ATTR_NAME);
      }
    }

  });

});
