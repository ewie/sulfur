/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/facet',
  'sulfur/schema/qname',
  'sulfur/schema/validator/maximum',
  'sulfur/schema/validator/property',
  'sulfur/schema/value/simple/integer'
], function (
    Facet,
    QName,
    MaximumValidator,
    PropertyValidator,
    IntegerValue
) {

  'use strict';

  var qname = QName.create('fractionDigits', 'http://www.w3.org/2001/XMLSchema');

  return Facet.clone({

    get qname() { return qname },

    get isShadowingLowerRestrictions() { return true },

    get mutexFacets() { return [] },

    getValueType: function () { return IntegerValue }

  }).augment({

    /**
     * @param {sulfur/schema/value/simple/integer} value
     *
     * @throw {Error} when the value is not a non-negative integer
     */
    initialize: function (value) {
      if (!IntegerValue.prototype.isPrototypeOf(value) || value.isNegative) {
        throw new Error("expecting a non-negative sulfur/schema/value/simple/integer");
      }
      Facet.prototype.initialize.call(this, value);
    },

    isRestrictionOf: function (type) {
      var fractionDigitsFacet = this.factory.getEffectiveFacet(type);
      if (fractionDigitsFacet) {
        return this.value.lteq(fractionDigitsFacet.value);
      }
      return true;
    },

    validate: function () {
      return true;
    },

    createValidator: function () {
      return PropertyValidator.create(
        'countFractionDigits',
        MaximumValidator.create(this.value)
      );
    }

  });

});
