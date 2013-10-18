/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/facet/pattern',
  'sulfur/schema/pattern',
  'sulfur/util'
], function ($patternFacet, $pattern, $util) {

  'use strict';

  return {

    getFacet: $util.returns($patternFacet),

    parseValue: function (s) {
      return $pattern.create(s);
    },

    createFacet: function (values) {
      return $patternFacet.create(values);
    }

  };

});
