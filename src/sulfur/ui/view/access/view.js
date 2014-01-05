/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define(['sulfur/util/factory'], function (Factory) {

  'use strict';

  return Factory.derive({

    /**
     * @param {Element} element an empty element as parent of a view element
     */
    initialize: function (element) {
      this._element = element;
    },

    get view() {
      return this._view;
    },

    set view(view) {
      if (view === this._view) {
        return;
      }
      if (view.hasParent()) {
        throw new Error("expecting a view without parent");
      }
      if (this._view) {
        this._element.replaceChild(view.element, this._view.element);
        this._view.removed();
      } else {
        this._element.appendChild(view.element);
      }
      this._view = view;
      this._view.inserted();
    },

    remove: function () {
      this._element.removeChild(this._view.element);
      this._view.removed();
      this._view = undefined;
    }

  });

});
