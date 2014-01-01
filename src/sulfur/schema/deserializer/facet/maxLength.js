/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/deserializer/facet',
  'sulfur/schema/facet/maxLength',
  'sulfur/util'
], function (FacetResolver, MaxLengthFacet, util) {

  'use strict';

  return FacetResolver.create(MaxLengthFacet,
    function (values) {
      values = util.sort(values, function (x, y) { return x.cmp(y) });
      return values[0];
    });

});
