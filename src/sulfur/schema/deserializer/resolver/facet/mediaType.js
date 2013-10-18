/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/facet/mediaType',
  'sulfur/schema/mediaType',
  'sulfur/util'
], function ($mediaTypeFacet, $mediaType, $util) {

  'use strict';

  return {

    getFacet: $util.returns($mediaTypeFacet),

    parseValue: function (s) {
      return $mediaType.parse(s);
    },

    createFacet: function (values) {
      return $mediaTypeFacet.create(values);
    }

  };

});
