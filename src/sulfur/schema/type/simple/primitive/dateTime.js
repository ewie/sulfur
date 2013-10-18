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
  'sulfur/schema/value/simple/dateTime'
], function (
    $enumerationFacet,
    $maxExclusiveFacet,
    $maxInclusiveFacet,
    $minExclusiveFacet,
    $minInclusiveFacet,
    $patternFacet,
    $facets,
    $qname,
    $primitiveType,
    $dateTimeValue
) {

  'use strict';

  return $primitiveType.create({
    qname: $qname.create('dateTime', 'http://www.w3.org/2001/XMLSchema'),
    valueType: $dateTimeValue,
    facets: $facets.create([
      $enumerationFacet,
      $maxExclusiveFacet,
      $maxInclusiveFacet,
      $minExclusiveFacet,
      $minInclusiveFacet,
      $patternFacet
    ])
  });

});
