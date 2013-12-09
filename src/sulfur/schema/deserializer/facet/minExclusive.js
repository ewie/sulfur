/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/deserializer/facet',
  'sulfur/schema/facet/minExclusive',
  'sulfur/util'
], function (FacetResolver, MinExclusiveFacet, util) {

  'use strict';

  return FacetResolver.create(MinExclusiveFacet,
    function (values) {
      values = util.sort(values, function (x, y) { return y.cmp(x) });
      return values[0];
    });

});
