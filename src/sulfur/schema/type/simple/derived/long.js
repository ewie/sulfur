/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/facet/maxInclusive',
  'sulfur/schema/facet/minInclusive',
  'sulfur/schema/facets',
  'sulfur/schema/qname',
  'sulfur/schema/type/simple/derived',
  'sulfur/schema/type/simple/derived/integer',
  'sulfur/schema/value/simple/integer'
], function (
    MaxInclusiveFacet,
    MinInclusiveFacet,
    Facets,
    QName,
    DerivedType,
    IntegerType,
    IntegerValue
) {

  'use strict';

  return DerivedType.create({
    base: IntegerType,
    qname: QName.create('long', 'http://www.w3.org/2001/XMLSchema'),
    valueType: IntegerValue,
    facets: Facets.create([
      MaxInclusiveFacet.create(IntegerValue.parse('9223372036854775807')),
      MinInclusiveFacet.create(IntegerValue.parse('-9223372036854775808'))
    ])
  });

});
