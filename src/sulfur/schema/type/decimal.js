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
  'sulfur/schema/type/_simple',
  'sulfur/schema/value/decimal'
], function (
    $enumerationFacet,
    $fractionDigitsFacet,
    $maxExclusiveFacet,
    $maxInclusiveFacet,
    $minExclusiveFacet,
    $minInclusiveFacet,
    $patternFacet,
    $totalDigitsFacet,
    $_simpleType,
    $decimalValue
) {

  'use strict';

  return $_simpleType.clone({

    getValueType: function () {
      return $decimalValue;
    },

    getLegalFacets: function () {
      return [
        $enumerationFacet,
        $fractionDigitsFacet,
        $maxExclusiveFacet,
        $maxInclusiveFacet,
        $minExclusiveFacet,
        $minInclusiveFacet,
        $patternFacet,
        $totalDigitsFacet
      ];
    }

  });

});
