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
  'sulfur/schema/facet/length',
  'sulfur/schema/facet/minLength',
  'sulfur/schema/qname',
  'sulfur/schema/validator/maximum',
  'sulfur/schema/validator/property',
  'sulfur/schema/value/simple/integer'
], function (
    require,
    Facet,
    LengthFacet,
    MinLengthFacet,
    QName,
    MaximumValidator,
    PropertyValidator,
    IntegerValue
) {

  'use strict';

  function requireFacet(name) {
    return function () {
      return require('sulfur/schema/facet/' + name);
    };
  }

  var requireLengthFacet = requireFacet('length');
  var requireMinLengthFacet = requireFacet('minLength');

  var qname = QName.create('maxLength', 'http://www.w3.org/2001/XMLSchema');

  return Facet.clone({

    get qname() { return qname },

    get isShadowingLowerRestrictions() { return true },

    get mutexFacets() { return [ requireLengthFacet() ] },

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
      var lengthFacet = requireLengthFacet().getEffectiveFacet(type);
      if (lengthFacet) {
        return false;
      }

      var maxLengthFacet = this.factory.getEffectiveFacet(type);
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
      var minLengthFacet = facets.getByQName(requireMinLengthFacet().qname);
      if (minLengthFacet && this.value.lt(minLengthFacet.value)) {
        if (errors) {
          errors.push("must not be less than facet 'minLength'");
        }
        return false;
      }
      return true;
    },

    createValidator: function () {
      return PropertyValidator.create(
        'length',
        MaximumValidator.create(this.value)
      );
    }

  });

});
