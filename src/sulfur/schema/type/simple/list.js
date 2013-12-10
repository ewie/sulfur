/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/util/factory',
  'sulfur/schema/facet/enumeration',
  'sulfur/schema/facet/length',
  'sulfur/schema/facet/maxLength',
  'sulfur/schema/facet/minLength',
  'sulfur/schema/facet/pattern',
  'sulfur/schema/facets',
  'sulfur/schema/value/simple/list',
  'sulfur/schema/validator/all',
  'sulfur/schema/validator/each',
  'sulfur/schema/validator/property'
], function (
    Factory,
    EnumerationFacet,
    LengthFacet,
    MaxLengthFacet,
    MinLengthFacet,
    PatternFacet,
    Facets,
    SimpleListValue,
    AllValidator,
    EachValidator,
    PropertyValidator
) {

  'use strict';

  var allowedFacets = Facets.create([
    EnumerationFacet,
    LengthFacet,
    MaxLengthFacet,
    MinLengthFacet,
    PatternFacet
  ]);

  return Factory.derive({

    initialize: function (itemType) {
      this._itemType = itemType;
      this._valueType = SimpleListValue.withItemValueType(itemType.valueType);
    },

    get itemType() {
      return this._itemType;
    },

    get valueType() {
      return this._valueType;
    },

    get allowedFacets() {
      return allowedFacets;
    },

    isRestrictionOf: function (other) {
      return this === other || this.itemType.isRestrictionOf(other.itemType);
    },

    createValidator: function () {
      return PropertyValidator.create('toArray',
        EachValidator.create(this.itemType.createValidator()));
    },

    createRestrictionValidator: function (restriction) {
      var allowedFacets = this.allowedFacets.toArray();
      var validators = allowedFacets.reduce(function (validators, allowedFacet) {
        var facets = allowedFacet.getEffectiveFacets(restriction);
        if (facets) {
          validators.push(allowedFacet.createConjunctionValidator(facets));
        }
        return validators;
      }, [ this.createValidator() ]);
      return AllValidator.create(validators);
    }

  });

});
