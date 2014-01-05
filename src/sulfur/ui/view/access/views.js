/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/util/factory',
  'sulfur/util/objectMap'
], function (Factory, ObjectMap) {

  'use strict';

  function assertView(accessor, view) {
    if (view.hasParent()) {
      throw new Error("expecting a view with no parent");
    }
    if (accessor.contains(view)) {
      throw new Error("already contains the given view");
    }
  }

  function assertRef(accessor, ref) {
    if (!accessor.contains(ref)) {
      throw new Error("expecting a present view as reference");
    }
  }

  return Factory.derive({

    initialize: function (element) {
      this._element = element;
      this._index = ObjectMap.create();
    },

    contains: function (view) {
      return this._index.contains(view);
    },

    remove: function (view) {
      if (this.contains(view)) {
        this._index.remove(view);
        this._element.removeChild(view.element);
        view.removed();
      }
    },

    clear: function () {
      while (this._element.firstElementChild) {
        this._element.removeChild(this._element.firstElementChild);
      }
      this._index.keys.forEach(function (view) { view.removed() });
      this._index.clear();
    },

    prepend: function (view) {
      assertView(this, view);
      this._index.set(view);
      this._element.insertBefore(view.element, this._element.firstElementChild);
      view.inserted();
    },

    append: function (view) {
      assertView(this, view);
      this._index.set(view);
      this._element.appendChild(view.element);
      view.inserted();
    },

    after: function (view, ref) {
      assertView(this, view);
      assertRef(this, ref);
      this._index.set(view);
      ref.element.insertBefore(view.element, ref.element.nextSibling);
      view.inserted();
    },

    before: function (view, ref) {
      assertView(this, view);
      assertRef(this, ref);
      this._index.set(view);
      ref.element.insertBefore(view.element, ref.element);
      view.inserted();
    }

  });

});
