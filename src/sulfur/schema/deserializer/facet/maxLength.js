/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/facet/maxLength',
  'sulfur/util'
], function (MaxLengthFacet, util) {

  'use strict';

  return {

    get facet() { return MaxLengthFacet; },

    parseValue: function (s) {
      return parseInt(s, 10);
    },

    createFacet: function (values) {
      values = util.sort(values, function (x, y) { return x - y; });
      return MaxLengthFacet.create(values[0]);
    }

  };

});
