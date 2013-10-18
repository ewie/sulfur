/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/facet/maxInclusive',
  'sulfur/util'
], function ($maxInclusiveFacet, $util) {

  'use strict';

  return {

    getFacet: $util.returns($maxInclusiveFacet),

    parseValue: function (s, p) {
      return p.parse(s);
    },

    createFacet: function (values) {
      values = $util.sort(values, function (x, y) { return x.cmp(y); });
      return $maxInclusiveFacet.create(values[0]);
    }

  };

});
