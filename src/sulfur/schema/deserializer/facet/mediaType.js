/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/deserializer/facet',
  'sulfur/schema/facet/mediaType'
], function (FacetResolver, MediaTypeFacet) {

  'use strict';

  return FacetResolver.create(MediaTypeFacet,
    function (values) { return values });

});
