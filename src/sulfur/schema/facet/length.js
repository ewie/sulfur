/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'require',
  'sulfur/schema/facet',
  'sulfur/schema/facet/maxLength',
  'sulfur/schema/facet/minLength',
  'sulfur/schema/qname',
  'sulfur/schema/validator/equal',
  'sulfur/schema/validator/property',
  'sulfur/schema/value/simple/integer'
], function (
    require,
    Facet,
    MaxLengthFacet,
    MinLengthFacet,
    QName,
    EqualValidator,
    PropertyValidator,
    IntegerValue
) {

  'use strict';

  function requireFacet(name) {
    return function () {
      return require('sulfur/schema/facet/' + name);
    };
  }

  var requireMaxLengthFacet = requireFacet('maxLength');
  var requireMinLengthFacet = requireFacet('minLength');

  var qname = QName.create('length', 'http://www.w3.org/2001/XMLSchema');

  return Facet.clone({

    get qname() { return qname },

    get isShadowingLowerRestrictions() { return true },

    get mutexFacets() {
      return [
        requireMaxLengthFacet(),
        requireMinLengthFacet()
      ];
    },

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
      var lengthFacet = this.factory.getEffectiveFacet(type);
      if (lengthFacet && !this.value.eq(lengthFacet.value)) {
        return false;
      }

      var maxLengthFacet = requireMaxLengthFacet().getEffectiveFacet(type);
      if (maxLengthFacet && this.value.gt(maxLengthFacet.value)) {
        return false;
      }

      var minLengthFacet = requireMinLengthFacet().getEffectiveFacet(type);
      if (minLengthFacet && this.value.lt(minLengthFacet.value)) {
        return false;
      }

      return true;
    },

    validateAmongFacets: function (facets, errors) {
      if (facets.hasByQName(requireMaxLengthFacet().qname)) {
        if (errors) {
          errors.push("cannot be used along with facet 'maxLength'");
        }
        return false;
      }
      if (facets.hasByQName(requireMinLengthFacet().qname)) {
        if (errors) {
          errors.push("cannot be used along with facet 'minLength'");
        }
        return false;
      }
      return true;
    },

    createValidator: function () {
      return PropertyValidator.create('length',
        EqualValidator.create(this.value));
    }

  });

});
