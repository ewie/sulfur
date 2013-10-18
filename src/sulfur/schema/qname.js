/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define(['sulfur/factory'], function ($factory) {

  'use strict';

  return $factory.derive({

    initialize: function (localName, namespaceURI) {
      this._localName = localName;
      this._namespaceURI = namespaceURI;
    },

    getLocalName: function () {
      return this._localName;
    },

    getNamespaceURI: function () {
      return this._namespaceURI;
    },

    toString: function () {
      return '{' + this._namespaceURI + '}' + this._localName;
    }

  });

});
