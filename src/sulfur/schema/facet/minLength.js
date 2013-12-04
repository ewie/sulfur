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
  'sulfur/schema/facet/maxLength',
  'sulfur/schema/qname',
  'sulfur/schema/validator/minimum',
  'sulfur/schema/validator/property',
  'sulfur/util'
], function (
    require,
    Facet,
    LengthFacet,
    MaxLengthFacet,
    QName,
    MinimumValidator,
    PropertyValidator,
    util
) {

  'use strict';

  function requireFacet(name) {
    return function () {
      return require('sulfur/schema/facet/' + name);
    };
  }

  var requireLengthFacet = requireFacet('length');
  var requireMaxLengthFacet = requireFacet('maxLength');

  var qname = QName.create('minLength', 'http://www.w3.org/2001/XMLSchema');

  return Facet.clone({

    get qname() { return qname; },

    isShadowingLowerRestrictions: util.returns(true),

    get mutualExclusiveFacets() {
      return [ requireLengthFacet() ];
    }

  }).augment({

    isRestrictionOf: function (type) {
      var lengthFacet = requireLengthFacet().getEffectiveFacet(type);
      if (lengthFacet) {
        return false;
      }

      var maxLengthFacet = requireMaxLengthFacet().getEffectiveFacet(type);
      if (maxLengthFacet && this.value > maxLengthFacet.value) {
        return false;
      }

      var minLengthFacet = this.factory.getEffectiveFacet(type);
      if (minLengthFacet && this.value < minLengthFacet.value) {
        return false;
      }

      return true;
    },

    validate: function (type, errors) {
      var maxLengthFacet = type.getByQName(requireMaxLengthFacet().qname);
      if (maxLengthFacet && this._value > maxLengthFacet.value) {
        if (errors) {
          errors.push("must not be greater than facet 'maxLength'");
        }
        return false;
      }
      return true;
    },

    createValidator: function () {
      return PropertyValidator.create(
        'length',
        MinimumValidator.create(this.value)
      );
    }

  });

});
