/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/facet',
  'sulfur/schema/qname',
  'sulfur/schema/type/simple/restricted',
  'sulfur/schema/validator/maximum',
  'sulfur/schema/validator/property',
  'sulfur/util'
], function ($facet, $qname, $restrictedType, $maximumValidator, $propertyValidator, $util) {

  'use strict';

  var $ = $facet.clone({

    getQName: $util.returns(
      $qname.create('fractionDigits', 'http://www.w3.org/2001/XMLSchema')),

    isShadowingLowerRestrictions: $util.returns(true),

    getMutualExclusiveFacets: $util.returns([])

  });

  $.augment({

    initialize: function (value) {
      if (!$util.isInteger(value) || value < 0) {
        throw new Error("expecting a non-negative integer less than 2^53");
      }
      $facet.prototype.initialize.call(this, value);
    },

    getValueArray: function () {
      return [ this.getValue() ];
    },

    isRestrictionOf: function (type) {
      var fractionDigitsFacet = this.factory.getEffectiveFacet(type);
      if (fractionDigitsFacet) {
        return this.getValue() <= fractionDigitsFacet.getValue();
      }
      return true;
    },

    validate: function () {
      return true;
    },

    createValidator: function () {
      return $propertyValidator.create(
        'countFractionDigits',
        $maximumValidator.create(this.getValue())
      );
    }

  });

  return $;

});
