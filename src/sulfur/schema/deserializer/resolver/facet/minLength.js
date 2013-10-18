/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/facet/minLength',
  'sulfur/util'
], function ($minLengthFacet, $util) {

  'use strict';

  return {

    getFacet: $util.returns($minLengthFacet),

    parseValue: function (s) {
      return parseInt(s, 10);
    },

    createFacet: function (values) {
      values = $util.sort(values, function (x, y) { return y - x; });
      return $minLengthFacet.create(values[0]);
    }

  };

});
