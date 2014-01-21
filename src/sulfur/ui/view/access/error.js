/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define(['sulfur/util/factory'], function (Factory) {

  'use strict';

  var ERRORABLE_ATTR = 'data-errorable';
  var MESSAGE_ATTR = 'data-error-message';
  var ERRORABLE_CLASS = 'errorable';
  var ERROR_CLASS = 'error';

  function findErrorableWrapper(e) {
    do {
      e = e.parentElement;
    } while (e && !e.classList.contains(ERRORABLE_CLASS));
    return e;
  }

  function isErrorable(e) {
    return !e.hasAttribute(ERRORABLE_ATTR) ||
      e.getAttribute(ERRORABLE_ATTR) === 'true';
  }

  return Factory.derive({

    initialize: function (element) {
      if (isErrorable(element)) {
        var wrap = findErrorableWrapper(element);
        if (!wrap) {
          wrap = element.ownerDocument.createElement('div');
          wrap.className = ERRORABLE_CLASS;
          element.parentNode.replaceChild(wrap, element);
          wrap.appendChild(element);
        }
        this._element = wrap;
      }
    },

    get error() {
      if (this._element && this._element.hasAttribute(MESSAGE_ATTR)) {
        return this._element.getAttribute(MESSAGE_ATTR);
      }
    },

    set error(value) {
      if (this._element) {
        var cl = this._element.classList;
        value ? cl.add(ERROR_CLASS) : cl.remove(ERROR_CLASS);
        if (value && typeof value === 'string') {
          this._element.setAttribute(MESSAGE_ATTR, value);
        } else {
          this._element.removeAttribute(MESSAGE_ATTR);
        }
      }
    }

  });

});
