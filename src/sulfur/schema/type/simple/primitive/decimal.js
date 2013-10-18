/* Copyright (c) 2013, Erik Wienhold
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
    $enumerationFacet,
    $fractionDigitsFacet,
    $maxExclusiveFacet,
    $maxInclusiveFacet,
    $minExclusiveFacet,
    $minInclusiveFacet,
    $patternFacet,
    $totalDigitsFacet,
    $facets,
    $qname,
    $primitiveType,
    $decimalValue
) {

  'use strict';

  return $primitiveType.create({
    qname: $qname.create('decimal', 'http://www.w3.org/2001/XMLSchema'),
    valueType: $decimalValue,
    facets: $facets.create([
      $enumerationFacet,
      $fractionDigitsFacet,
      $maxExclusiveFacet,
      $maxInclusiveFacet,
      $minExclusiveFacet,
      $minInclusiveFacet,
      $patternFacet,
      $totalDigitsFacet
    ])
  });

});
