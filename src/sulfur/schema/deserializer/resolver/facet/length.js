/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/facet/length',
  'sulfur/util'
], function ($lengthFacet, $util) {

  'use strict';

  return {

    getFacet: $util.returns($lengthFacet),

    parseValue: function (s) {
      return parseInt(s, 10);
    },

    createFacet: function (values) {
      return $lengthFacet.create(values[0]);
    }

  };

});
