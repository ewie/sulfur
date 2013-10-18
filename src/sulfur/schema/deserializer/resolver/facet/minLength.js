/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/facet/minLength',
  'sulfur/util'
], function (MinLengthFacet, util) {

  'use strict';

  return {

    getFacet: util.returns(MinLengthFacet),

    parseValue: function (s) {
      return parseInt(s, 10);
    },

    createFacet: function (values) {
      values = util.sort(values, function (x, y) { return y - x; });
      return MinLengthFacet.create(values[0]);
    }

  };

});
