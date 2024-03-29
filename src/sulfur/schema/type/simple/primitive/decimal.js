/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/facet/enumeration',
  'sulfur/schema/facet/fractionDigits',
  'sulfur/schema/facet/maxExclusive',
  'sulfur/schema/facet/maxInclusive',
  'sulfur/schema/facet/minExclusive',
  'sulfur/schema/facet/minInclusive',
  'sulfur/schema/facet/pattern',
  'sulfur/schema/facet/totalDigits',
  'sulfur/schema/facets',
  'sulfur/schema/qname',
  'sulfur/schema/type/simple/primitive',
  'sulfur/schema/value/simple/decimal'
], function (
    EnumerationFacet,
    FractionDigitsFacet,
    MaxExclusiveFacet,
    MaxInclusiveFacet,
    MinExclusiveFacet,
    MinInclusiveFacet,
    PatternFacet,
    TotalDigitsFacet,
    Facets,
    QName,
    PrimitiveType,
    DecimalValue
) {

  'use strict';

  return PrimitiveType.create({
    qname: QName.create('decimal', 'http://www.w3.org/2001/XMLSchema'),
    valueType: DecimalValue,
    facets: Facets.create([
      EnumerationFacet,
      FractionDigitsFacet,
      MaxExclusiveFacet,
      MaxInclusiveFacet,
      MinExclusiveFacet,
      MinInclusiveFacet,
      PatternFacet,
      TotalDigitsFacet
    ])
  });

});
