/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/facet/whiteSpace',
  'sulfur/util'
], function (WhiteSpaceFacet, util) {

  'use strict';

  return {

    getFacet: util.returns(WhiteSpaceFacet),

    parseValue: function (s) {
      return s;
    },

    createFacet: function (values) {
      return WhiteSpaceFacet.create(values[0]);
    }

  };

});
