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
    PropertyValidator,
    util
) {

  'use strict';

  return Factory.derive({

    initialize: function (itemType) {
      this._itemType = itemType;
      this._valueType = SimpleListValue.typed(this._itemType.getValueType());
    },

    getItemType: function () {
      return this._itemType;
    },

    getValueType: function () {
      return this._valueType;
    },

    getAllowedFacets: util.returns(
      Facets.create(
        [ EnumerationFacet,
          LengthFacet,
          MaxLengthFacet,
          MinLengthFacet,
          PatternFacet
        ])),

    isRestrictionOf: function (other) {
      return this === other || this._itemType.isRestrictionOf(other._itemType);
    },

    createValidator: function () {
      return PropertyValidator.create('toArray',
        EachValidator.create(this._itemType.createValidator()));
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
      return AllValidator.create(validators);
    }

  });

});
