/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/deserializer/facet',
  'sulfur/schema/facet/pattern'
], function (FacetResolver, PatternFacet) {

  'use strict';

  return FacetResolver.create(PatternFacet,
    function (values) { return values });

});
