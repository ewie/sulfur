/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define(['sulfur/util/factory'], function (Factory) {

  'use strict';

  var attrName = 'data-error-message';

  return Factory.derive({

    initialize: function (element) {
      var wrap = element.ownerDocument.createElement('div');
      wrap.className = 'errorable';
      element.parentNode.replaceChild(wrap, element);
      wrap.appendChild(element);
      this._element = wrap;
    },

    get error() {
      if (this._element.hasAttribute(attrName)) {
        return this._element.getAttribute(attrName);
      }
    },

    set error(value) {
      if (value) {
        this._element.classList.add('error');
      } else {
        this._element.classList.remove('error');
      }
      if (value && typeof value === 'string') {
        this._element.setAttribute(attrName, value);
      } else {
        this._element.removeAttribute(attrName);
      }
    }

  });

});
