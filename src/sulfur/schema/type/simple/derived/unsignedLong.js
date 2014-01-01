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
  'sulfur/schema/type/simple/derived/nonNegativeInteger',
  'sulfur/schema/value/simple/integer'
], function (
    MaxInclusiveFacet,
    Facets,
    QName,
    DerivedType,
    NonNegativeIntegerType,
    IntegerValue
) {

  'use strict';

  return DerivedType.create({
    base: NonNegativeIntegerType,
    qname: QName.create('unsignedLong', 'http://www.w3.org/2001/XMLSchema'),
    valueType: IntegerValue,
    facets: Facets.create([
      MaxInclusiveFacet.create(IntegerValue.parse('18446744073709551615'))
    ])
  });

});
