/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/deserializer/facet',
  'sulfur/schema/facet/totalDigits',
  'sulfur/util'
], function (FacetResolver, TotalDigitsFacet, util) {

  'use strict';

  return FacetResolver.create(TotalDigitsFacet,
    function (values) {
      values = util.sort(values, function (x, y) { return x.cmp(y) });
      return values[0];
    });

});
