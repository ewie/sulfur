/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/facet/maxExclusive',
  'sulfur/util'
], function (MaxExclusiveFacet, util) {

  'use strict';

  return {

    getFacet: util.returns(MaxExclusiveFacet),

    parseValue: function (s, p) {
      return p.parse(s);
    },

    createFacet: function (values) {
      values = util.sort(values, function (x, y) { return x.cmp(y); });
      return MaxExclusiveFacet.create(values[0]);
    }

  };

});