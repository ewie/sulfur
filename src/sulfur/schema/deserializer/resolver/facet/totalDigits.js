/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/facet/totalDigits',
  'sulfur/util'
], function ($totalDigitsFacet, $util) {

  'use strict';

  return {

    getFacet: $util.returns($totalDigitsFacet),

    parseValue: function (s) {
      return parseInt(s, 10);
    },

    createFacet: function (values) {
      values = $util.sort(values, function (x, y) { return x - y; });
      return $totalDigitsFacet.create(values[0]);
    }

  };

});
