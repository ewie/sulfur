/* Copyright (c) 2013, Erik Wienhold
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
  'sulfur/schema/validator/property'
], function (
    require,
    Facet,
    LengthFacet,
    MinLengthFacet,
    QName,
    MaximumValidator,
    PropertyValidator
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

    get mutualExclusiveFacets() { return [ requireLengthFacet() ] }

  }).augment({

    isRestrictionOf: function (type) {
      var lengthFacet = requireLengthFacet().getEffectiveFacet(type);
      if (lengthFacet) {
        return false;
      }

      var maxLengthFacet = this.factory.getEffectiveFacet(type);
      if (maxLengthFacet && this.value > maxLengthFacet.value) {
        return false;
      }

      var minLengthFacet = requireMinLengthFacet().getEffectiveFacet(type);
      if (minLengthFacet && this.value < minLengthFacet.value) {
        return false;
      }

      return true;
    },

    validate: function (type, errors) {
      var minLengthFacet = type.getByQName(requireMinLengthFacet().qname);
      if (minLengthFacet && this._value < minLengthFacet.value) {
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
