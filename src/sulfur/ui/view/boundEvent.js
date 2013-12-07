/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define(['sulfur/util/factory'], function (Factory) {

  'use strict';

  return Factory.derive({

    /**
     * @param {Element} element
     * @param {function} handler
     * @param {string} type
     * @param {string} selector (optional)
     */
    initialize: function (element, handler, type, selector) {
      this._element = element;
      this._handler = handler;
      this._type = type;
      this._selector = selector;
    },

    attach: function () {
      if (this._selector) {
        var e = this._element.querySelectorAll(this._selector);
        for (var i = 0; i < e.length; i += 1) {
          e.item(i).addEventListener(this._type, this._handler);
        }
      } else {
        this._element.addEventListener(this._type, this._handler);
      }
    },

    detach: function () {
      if (this._selector) {
        var e = this._element.querySelectorAll(this._selector);
        for (var i = 0; i < e.length; i += 1) {
          e.item(i).removeEventListener(this._type, this._handler);
        }
      } else {
        this._element.removeEventListener(this._type, this._handler);
      }
    }

  });

});
