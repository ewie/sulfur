/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/facet/minInclusive',
  'sulfur/util'
], function (MinInclusiveFacet, util) {

  'use strict';

  return {

    getFacet: util.returns(MinInclusiveFacet),

    parseValue: function (s, p) {
      return p.parse(s);
    },

    createFacet: function (values) {
      values = util.sort(values, function (x, y) { return -x.cmp(y); });
      return MinInclusiveFacet.create(values[0]);
    }

  };

});
