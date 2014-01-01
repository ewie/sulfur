/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/facet/pattern',
  'sulfur/schema/facets',
  'sulfur/schema/qname',
  'sulfur/schema/type/simple/primitive',
  'sulfur/schema/value/simple/boolean'
], function (
    PatternFacet,
    Facets,
    QName,
    PrimitiveType,
    BooleanValue
) {

  'use strict';

  return PrimitiveType.create({
    qname: QName.create('boolean', 'http://www.w3.org/2001/XMLSchema'),
    valueType: BooleanValue,
    facets: Facets.create([ PatternFacet ])
  });

});
