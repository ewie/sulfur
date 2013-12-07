/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/ui/publisher',
  'sulfur/util/factory'
], function (Publisher, Factory) {

  'use strict';

  return Factory.derive({

    initialize: function () {
      var element = this.factory.blueprint.createElement();
      var fragment = element.ownerDocument.createDocumentFragment();
      fragment.appendChild(element);

      this._publisher = Publisher.create();
      this._boundEvents = this.factory.blueprint.bindEvents(element, this);

      this._boundAccessors = this.factory.blueprint.bindAccessors(element)
        .reduce(function (index, boundAccessor) {
          index[boundAccessor.name] = boundAccessor;
          return index;
        }, Object.create(null));

      while (element.parentNode !== fragment) {
        element = element.parentNode;
      }

      this._element = element;

      this._boundEvents.forEach(function (e) {
        e.attach();
      });
    },

    detach: function () {
      this._boundEvents.forEach(function (e) {
        e.detach();
      });
    },

    get publisher() {
      return this._publisher;
    },

    get element() {
      return this._element;
    },

    access: function (name) {
      var boundAccessor = this._boundAccessors[name];
      if (boundAccessor) {
        return boundAccessor.access;
      }
      throw new Error('unknown accessor for "' + name + '"');
    },

    hasParent: function () {
      var p = this._element.parentNode;
      return p !== null && p.nodeType !== Node.DOCUMENT_FRAGMENT_NODE;
    }

  });

});
