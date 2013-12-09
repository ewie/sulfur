/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/deserializer/facet',
  'sulfur/schema/facet/minLength',
  'sulfur/util'
], function (FacetResolver, MinLengthFacet, util) {

  'use strict';

  return FacetResolver.create(MinLengthFacet,
    function (values) {
      values = util.sort(values, function (x, y) { return y.cmp(x) });
      return values[0];
    });

});
