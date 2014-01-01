/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/facet/maxInclusive',
  'sulfur/schema/facets',
  'sulfur/schema/qname',
  'sulfur/schema/type/simple/derived',
  'sulfur/schema/type/simple/derived/unsignedLong',
  'sulfur/schema/value/simple/integer'
], function (
    MaxInclusiveFacet,
    Facets,
    QName,
    DerivedType,
    UnsignedLongType,
    IntegerValue
) {

  'use strict';

  return DerivedType.create({
    base: UnsignedLongType,
    qname: QName.create('unsignedInt', 'http://www.w3.org/2001/XMLSchema'),
    valueType: IntegerValue,
    facets: Facets.create([
      MaxInclusiveFacet.create(IntegerValue.parse('4294967295'))
    ])
  });

});
