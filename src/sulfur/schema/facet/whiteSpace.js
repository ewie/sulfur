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
  'sulfur/schema/value/simple/whiteSpace'
], function (Facet, QName, WhiteSpaceValue) {

  'use strict';

  var qname = QName.create('whiteSpace', 'http://www.w3.org/2001/XMLSchema');

  return Facet.clone({

    get qname() { return qname },

    get isShadowingLowerRestrictions() { return true },

    get mutexFacets() { return [] },

    getValueType: function () { return WhiteSpaceValue }

  }).augment({

    initialize: function (value) {
      if (!WhiteSpaceValue.prototype.isPrototypeOf(value)) {
        throw new Error("expecting a sulfur/schema/value/simple/whiteSpace");
      }
      Facet.prototype.initialize.call(this, value);
    },

    isRestrictionOf: function (type) {
      var whiteSpaceFacet = this.factory.getEffectiveFacet(type);
      if (!whiteSpaceFacet) {
        return true;
      }
      return this.value.isEqualOrStricter(whiteSpaceFacet.value);
    },

    validateAmongFacets: function () { return true },

    createValidator: function () {
      throw new Error("validator creation is not allowed");
    }

  });

});
