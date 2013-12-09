/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur',
  'sulfur/schema/facet',
  'sulfur/schema/qname',
  'sulfur/schema/mediaType',
  'sulfur/schema/validator/enumeration',
  'sulfur/util'
], function (
    sulfur,
    Facet,
    QName,
    MediaType,
    EnumerationValidator,
    util
) {

  'use strict';

  function isMediaType(x) {
    return MediaType.prototype.isPrototypeOf(x);
  }

  var qname = QName.create('mediaType', sulfur.namespaceURI);

  return Facet.clone({

    get qname() { return qname },

    get isShadowingLowerRestrictions() { return true },

    get mutualExclusiveFacets() { return [] },

    getValueType: function () { return MediaType }

  }).augment({

    initialize: function (value) {
      if (value.length === 0) {
        throw new Error("expecting at least one sulfur/schema/mediaType value");
      }
      if (!value.every(isMediaType)) {
        throw new Error("expecting only sulfur/schema/mediaType values");
      }
      value = util.uniq(value);
      Facet.prototype.initialize.call(this, value);
    },

    isRestrictionOf: function (type) {
      var mediaTypeFacet = this.factory.getEffectiveFacet(type);
      if (!mediaTypeFacet) {
        return true;
      }
      var baseMediaTypes = mediaTypeFacet.value;
      return this.value.every(function (mediaType) {
        return baseMediaTypes.some(function (baseMediaType) {
          return baseMediaType.matches(mediaType);
        });
      });
    },

    validate: function () {
      return true;
    },

    createValidator: function () {
      return EnumerationValidator.create(
        this.value,
        { testMethod: 'matches' });
    }

  });

});
