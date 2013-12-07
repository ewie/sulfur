/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/ui/view/boundEvent',
  'sulfur/util/factory'
], function (BoundEvent, Factory) {

  'use strict';

  return Factory.derive({

    /**
     * @param {string} type
     * @param {string} selector (optional)
     * @param {.bind()} handler
     */
    initialize: function (type, selector, handler) {
      this._type = type;
      if (typeof selector === 'string') {
        this._selector = selector;
        this._handler = handler;
      } else {
        this._handler = selector;
      }
    },

    bind: function (element, view) {
      return BoundEvent.create(element, this._handler.bind(view),
        this._type, this._selector);
    }

  });

});
