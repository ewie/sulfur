/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/deserializer/facet',
  'sulfur/schema/facet/minInclusive',
  'sulfur/util'
], function (FacetResolver, MinInclusiveFacet, util) {

  'use strict';

  return FacetResolver.create(MinInclusiveFacet,
    function (values) {
      values = util.sort(values, function (x, y) { return y.cmp(x) });
      return values[0];
    });

});
