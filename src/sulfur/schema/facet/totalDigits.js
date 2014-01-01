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
], function (Facet, QName, MaximumValidator, PropertyValidator, IntegerValue) {

  'use strict';

  var qname = QName.create('totalDigits', 'http://www.w3.org/2001/XMLSchema');

  return Facet.clone({

    get qname() { return qname },

    get isShadowingLowerRestrictions() { return true },

    get mutexFacets() { return [] },

    getValueType: function () { return IntegerValue }

  }).augment({

    initialize: function (value) {
      if (!IntegerValue.prototype.isPrototypeOf(value) || !value.isPositive) {
        throw new Error("expecting a positive sulfur/schema/value/simple/integer");
      }
      Facet.prototype.initialize.call(this, value);
    },

    isRestrictionOf: function (type) {
      var totalDigitsFacet = this.factory.getEffectiveFacet(type);
      if (totalDigitsFacet) {
        return this.value.lteq(totalDigitsFacet.value);
      }
      return true;
    },

    validate: function () {
      return true;
    },

    createValidator: function () {
      return PropertyValidator.create(
        'countDigits',
        MaximumValidator.create(this.value)
      );
    }

  });

});
