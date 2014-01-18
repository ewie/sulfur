/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/deserializer/facet',
  'sulfur/schema/facet/fractionDigits',
  'sulfur/util'
], function (FacetResolver, FractionDigitsFacet, util) {

  'use strict';

  return FacetResolver.create(FractionDigitsFacet,
    function (values) {
      values = util.sort(values, function (x, y) { return x.cmp(y) });
      return values[0];
    });

});
