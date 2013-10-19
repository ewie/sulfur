/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/util/factory',
  'sulfur/schema/validator/all',
  'sulfur/schema/validator/prototype'
], function (Factory, AllValidator, PrototypeValidator) {

  'use strict';

  return Factory.derive({

    initialize: function (options) {
      this._valueType = options.valueType;
      this._allowedFacets = options.facets;
      this._qname = options.qname;
    },

    getQName: function () {
      return this._qname;
    },

    getValueType: function () {
      return this._valueType;
    },

    getAllowedFacets: function () {
      return this._allowedFacets;
    },

    isRestrictionOf: function (other) {
      return this === other;
    },

    createValidator: function () {
      return PrototypeValidator.create(this.getValueType().prototype);
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