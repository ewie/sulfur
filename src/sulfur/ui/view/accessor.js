/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/ui/view/boundAccessor',
  'sulfur/util/factory'
], function (BoundAccessor, Factory) {

  'use strict';

  return Factory.derive({

    /**
     * @param {string} name
     * @param {string} selector (optional)
     * @param {.create()} access
     */
    initialize: function (name, selector, access) {
      this._name = name;
      if (arguments.length === 3) {
        this._selector = selector;
        this._access = access;
      } else {
        this._access = selector;
      }
    },

    bind: function (element) {
      var e = this._selector ? this._selectElement(element) : element;
      return BoundAccessor.create(this._name, this._access.create(e));
    },

    _selectElement: function (e) {
      e = e.querySelectorAll(this._selector);
      if (e.length === 0) {
        throw new Error("no element matching selector {" + this._selector + "}");
      }
      if (e.length > 1) {
        throw new Error("expecting selector {" + this._selector + "} to match exactly one element");
      }
      return e.item(0);
    }

  });

});
