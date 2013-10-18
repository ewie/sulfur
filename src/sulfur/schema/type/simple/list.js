/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/factory',
  'sulfur/schema/facet/enumeration',
  'sulfur/schema/facet/length',
  'sulfur/schema/facet/maxLength',
  'sulfur/schema/facet/minLength',
  'sulfur/schema/facet/pattern',
  'sulfur/schema/facets',
  'sulfur/schema/value/simpleList',
  'sulfur/schema/validator/all',
  'sulfur/schema/validator/each',
  'sulfur/schema/validator/property',
  'sulfur/util'
], function (
    $factory,
    $enumerationFacet,
    $lengthFacet,
    $maxLengthFacet,
    $minLengthFacet,
    $patternFacet,
    $facets,
    $simpleListValue,
    $allValidator,
    $eachValidator,
    $propertyValidator,
    $util
) {

  'use strict';

  return $factory.derive({

    initialize: function (itemType) {
      this._itemType = itemType;
      this._valueType = $simpleListValue.typed(this._itemType.getValueType());
    },

    getItemType: function () {
      return this._itemType;
    },

    getValueType: function () {
      return this._valueType;
    },

    getAllowedFacets: $util.returns(
      $facets.create(
        [ $enumerationFacet,
          $lengthFacet,
          $maxLengthFacet,
          $minLengthFacet,
          $patternFacet
        ])),

    isRestrictionOf: function (other) {
      return this === other || this._itemType.isRestrictionOf(other._itemType);
    },

    createValidator: function () {
      return $propertyValidator.create('toArray',
        $eachValidator.create(this._itemType.createValidator()));
    },

    createRestrictionValidator: function (restriction) {
      var allowedFacets = this.getAllowedFacets().toArray();
      var validators = allowedFacets.reduce(function (validators, allowedFacet) {
        var facets = allowedFacet.getEffectiveFacets(restriction);
        if (facets) {
          validators.push(allowedFacet.createConjunctionValidator(facets));
        }
        return validators;
      }, [ this.createValidator() ]);
      return $allValidator.create(validators);
    }

  });

});
