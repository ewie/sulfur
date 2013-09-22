/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/facet/enumeration',
  'sulfur/schema/facet/pattern',
  'sulfur/schema/type/_simple',
  'sulfur/schema/value/boolean'
], function (
    $enumerationFacet,
    $patternFacet,
    $_simpleType,
    $booleanValue
) {

  'use strict';

  return $_simpleType.clone({

    getValueType: function () {
      return $booleanValue;
    },

    getLegalFacets: function () {
      return [
        $enumerationFacet,
        $patternFacet
      ];
    }

  });

});
