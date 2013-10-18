/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/facet/maxLength',
  'sulfur/util'
], function ($maxLengthFacet, $util) {

  'use strict';

  return {

    getFacet: $util.returns($maxLengthFacet),

    parseValue: function (s) {
      return parseInt(s, 10);
    },

    createFacet: function (values) {
      values = $util.sort(values, function (x, y) { return x - y; });
      return $maxLengthFacet.create(values[0]);
    }

  };

});
