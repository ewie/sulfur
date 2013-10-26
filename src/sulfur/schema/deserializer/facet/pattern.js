/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/facet/pattern',
  'sulfur/schema/pattern'
], function (PatternFacet, Pattern) {

  'use strict';

  return {

    get facet() { return PatternFacet; },

    parseValue: function (s) {
      return Pattern.create(s);
    },

    createFacet: function (values) {
      return PatternFacet.create(values);
    }

  };

});
