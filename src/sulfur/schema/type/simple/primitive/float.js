/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/facet/enumeration',
  'sulfur/schema/facet/maxExclusive',
  'sulfur/schema/facet/maxInclusive',
  'sulfur/schema/facet/minExclusive',
  'sulfur/schema/facet/minInclusive',
  'sulfur/schema/facet/pattern',
  'sulfur/schema/facets',
  'sulfur/schema/qname',
  'sulfur/schema/type/simple/primitive',
  'sulfur/schema/value/simple/float'
], function (
    EnumerationFacet,
    MaxExclusiveFacet,
    MaxInclusiveFacet,
    MinExclusiveFacet,
    MinInclusiveFacet,
    PatternFacet,
    Facets,
    QName,
    PrimitiveType,
    FloatValue
) {

  'use strict';

  return PrimitiveType.create({
    qname: QName.create('float', 'http://www.w3.org/2001/XMLSchema'),
    valueType: FloatValue,
    facets: Facets.create([
      EnumerationFacet,
      MaxExclusiveFacet,
      MaxInclusiveFacet,
      MinExclusiveFacet,
      MinInclusiveFacet,
      PatternFacet
    ])
  });

});
