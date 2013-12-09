/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/deserializer/facet',
  'sulfur/schema/facet/whiteSpace'
], function (FacetResolver, WhiteSpaceFacet) {

  'use strict';

  return FacetResolver.create(WhiteSpaceFacet,
    function (values) { return values[0] });

});
