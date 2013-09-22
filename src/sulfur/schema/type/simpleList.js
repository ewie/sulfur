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
  'sulfur/schema/type/_faceted',
  'sulfur/schema/validator/all',
  'sulfur/schema/validator/each'
], function (
    $enumerationFacet,
    $lengthFacet,
    $maxLengthFacet,
    $minLengthFacet,
    $patternFacet,
    $_facetedType,
    $allValidator,
    $eachValidator
) {

  'use strict';

  var $ = $_facetedType.clone({

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

  $.augment({

    initialize: function (valueType) {
      this._valueType = valueType;
    },

    getValueType: function () {
      return this._valueType;
    },

    createValidator: function () {
      return $allValidator.create([
        $_facetedType.prototype.createValidator.call(this),
        $eachValidator.create(this.getValueType().createValidator())
      ]);
    }

  });

  return $;

});
