/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/facet/whiteSpace',
  'sulfur/util'
], function ($whiteSpaceFacet, $util) {

  'use strict';

  return {

    getFacet: $util.returns($whiteSpaceFacet),

    parseValue: function (s) {
      return s;
    },

    createFacet: function (values) {
      return $whiteSpaceFacet.create(values[0]);
    }

  };

});
