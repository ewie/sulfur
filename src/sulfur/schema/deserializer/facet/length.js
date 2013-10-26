/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define(['sulfur/schema/facet/length'], function (LengthFacet) {

  'use strict';

  return {

    get facet() { return LengthFacet; },

    parseValue: function (s) {
      return parseInt(s, 10);
    },

    createFacet: function (values) {
      return LengthFacet.create(values[0]);
    }

  };

});
