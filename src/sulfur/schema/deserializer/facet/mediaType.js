/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/facet/mediaType',
  'sulfur/schema/mediaType'
], function (MediaTypeFacet, MediaType) {

  'use strict';

  return {

    get facet() { return MediaTypeFacet; },

    parseValue: function (s) {
      return MediaType.parse(s);
    },

    createFacet: function (values) {
      return MediaTypeFacet.create(values);
    }

  };

});
