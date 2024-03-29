/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/deserializer/facet',
  'sulfur/schema/facet/length'
], function (FacetResolver, LengthFacet) {

  'use strict';

  return FacetResolver.create(LengthFacet,
    function (values) { return values[0] });

});
