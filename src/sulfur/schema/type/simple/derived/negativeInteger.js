/* Copyright (c) 2013, Erik Wienhold
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
  'sulfur/schema/type/simple/derived/nonPositiveInteger',
  'sulfur/schema/value/simple/integer'
], function (
    MaxInclusiveFacet,
    Facets,
    QName,
    DerivedType,
    NonPositiveIntegerType,
    IntegerValue
) {

  'use strict';

  return DerivedType.create({
    base: NonPositiveIntegerType,
    qname: QName.create('negativeInteger', 'http://www.w3.org/2001/XMLSchema'),
    valueType: IntegerValue,
    facets: Facets.create([
      MaxInclusiveFacet.create(IntegerValue.parse('-1'))
    ])
  });

});
