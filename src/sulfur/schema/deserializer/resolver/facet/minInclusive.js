/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/facet/minInclusive',
  'sulfur/util'
], function ($minInclusiveFacet, $util) {

  'use strict';

  return {

    getFacet: $util.returns($minInclusiveFacet),

    parseValue: function (s, p) {
      return p.parse(s);
    },

    createFacet: function (values) {
      values = $util.sort(values, function (x, y) { return -x.cmp(y); });
      return $minInclusiveFacet.create(values[0]);
    }

  };

});
