/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define(['sulfur/util/factory'], function (Factory) {

  'use strict';

  return Factory.derive({

    initialize: function (facet, reduce) {
      this._facet = facet;
      this._reduce = reduce;
    },

    get facet() { return this._facet },

    get reduce() { return this._reduce },

    parseValue: function (s, type) {
      return this.facet.getValueType(type).parse(s);
    },

    createFacet: function (values) {
      var value = this.reduce(values);
      return this.facet.create(value);
    }

  });

});
