/* Copyright (c) 2013, Erik Wienhold
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
  'sulfur/util'
], function (Facet, QName, MaximumValidator, PropertyValidator, util) {

  'use strict';

  var qname = QName.create('totalDigits', 'http://www.w3.org/2001/XMLSchema');

  return Facet.clone({

    get qname() { return qname },

    get isShadowingLowerRestrictions() { return true },

    get mutualExclusiveFacets() { return [] }

  }).augment({

    initialize: function (value) {
      if (!util.isInteger(value) || value < 1) {
        throw new Error("expecting a positive integer less than 2^53");
      }
      Facet.prototype.initialize.call(this, value);
    },

    isRestrictionOf: function (type) {
      var totalDigitsFacet = this.factory.getEffectiveFacet(type);
      if (totalDigitsFacet) {
        return this.value <= totalDigitsFacet.value;
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
