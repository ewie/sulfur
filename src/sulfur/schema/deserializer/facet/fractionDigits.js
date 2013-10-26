/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/facet/fractionDigits',
  'sulfur/util'
], function (FractionDigitsFacet, util) {

  'use strict';

  return {

    get facet() { return FractionDigitsFacet; },

    parseValue: function (s) {
      return parseInt(s, 10);
    },

    createFacet: function (values) {
      values = util.sort(values, function (x, y) { return x - y; });
      return FractionDigitsFacet.create(values[0]);
    }

  };

});
