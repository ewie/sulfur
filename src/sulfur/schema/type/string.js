/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/facet/enumeration',
  'sulfur/schema/facet/length',
  'sulfur/schema/facet/maxLength',
  'sulfur/schema/facet/minLength',
  'sulfur/schema/facet/pattern',
  'sulfur/schema/type/_simple',
  'sulfur/schema/type/string',
  'sulfur/schema/value/string'
], function (
    $enumerationFacet,
    $lengthFacet,
    $maxLengthFacet,
    $minLengthFacet,
    $patternFacet,
    $_simpleType,
    $stringType,
    $stringValue
) {

  'use strict';

  return $_simpleType.clone({

    getValueType: function () {
      return $stringValue;
    },

    getLegalFacets: function () {
      return [
        $enumerationFacet,
        $lengthFacet,
        $maxLengthFacet,
        $minLengthFacet,
        $patternFacet
      ];
    }

  });

});
