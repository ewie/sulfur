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
  'sulfur/schema/type/_simple',
  'sulfur/schema/type/double',
  'sulfur/schema/value/double'
], function (
    $enumerationFacet,
    $maxExclusiveFacet,
    $maxInclusiveFacet,
    $minExclusiveFacet,
    $minInclusiveFacet,
    $patternFacet,
    $_simpleType,
    $doubleType,
    $doubleValue
) {

  'use strict';

  return $_simpleType.clone({

    getValueType: function () {
      return $doubleValue;
    },

    getLegalFacets: function () {
      return [
        $enumerationFacet,
        $maxExclusiveFacet,
        $maxInclusiveFacet,
        $minExclusiveFacet,
        $minInclusiveFacet,
        $patternFacet
      ];
    }

  });

});
