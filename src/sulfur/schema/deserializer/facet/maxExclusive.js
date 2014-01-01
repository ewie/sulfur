/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/deserializer/facet',
  'sulfur/schema/facet/maxExclusive',
  'sulfur/util'
], function (FacetResolver, MaxExclusiveFacet, util) {

  'use strict';

  return FacetResolver.create(MaxExclusiveFacet,
    function (values) {
      values = util.sort(values, function (x, y) { return x.cmp(y) });
      return values[0];
    });

});
