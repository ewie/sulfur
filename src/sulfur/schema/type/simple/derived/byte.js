/* Copyright (c) 2013, Erik Wienhold
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
  'sulfur/schema/type/simple/derived/short',
  'sulfur/schema/value/simple/integer'
], function (
    MaxInclusiveFacet,
    MinInclusiveFacet,
    Facets,
    QName,
    DerivedType,
    ShortType,
    IntegerValue
) {

  'use strict';

  return DerivedType.create({
    base: ShortType,
    qname: QName.create('byte', 'http://www.w3.org/2001/XMLSchema'),
    valueType: IntegerValue,
    facets: Facets.create([
      MaxInclusiveFacet.create(IntegerValue.parse('127')),
      MinInclusiveFacet.create(IntegerValue.parse('-128'))
    ])
  });

});
