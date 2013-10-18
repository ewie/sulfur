/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'require',
  'sulfur/schema/facet',
  'sulfur/schema/qname',
  'sulfur/schema/type/simple/restricted',
  'sulfur/schema/validator/minimum',
  'sulfur/schema/validator/property',
  'sulfur/util'
], function (
    require,
    $facet,
    $qname,
    $restrictedType,
    $minimumValidator,
    $propertyValidator,
    $util
) {

  'use strict';

  function requireFacet(name) {
    return function () {
      return require('sulfur/schema/facet/' + name);
    };
  }

  var requireLengthFacet = requireFacet('length');
  var requireMaxLengthFacet = requireFacet('maxLength');

  var $ = $facet.clone({

    getQName: $util.returns(
      $qname.create('minLength', 'http://www.w3.org/2001/XMLSchema')),

    isShadowingLowerRestrictions: $util.returns(true),

    getMutualExclusiveFacets: $util.once(function () {
      return [ requireLengthFacet() ];
    })

  });

  $.augment({

    isRestrictionOf: function (type) {
      var lengthFacet = requireLengthFacet().getEffectiveFacet(type);
      if (lengthFacet) {
        return false;
      }

      var maxLengthFacet = requireMaxLengthFacet().getEffectiveFacet(type);
      if (maxLengthFacet && this.getValue() > maxLengthFacet.getValue()) {
        return false;
      }

      var minLengthFacet = this.factory.getEffectiveFacet(type);
      if (minLengthFacet && this.getValue() < minLengthFacet.getValue()) {
        return false;
      }

      return true;
    },

    validate: function (type, errors) {
      var maxLengthFacet = type.getFacet(requireMaxLengthFacet().getQName());
      if (maxLengthFacet && this._value > maxLengthFacet.getValue()) {
        if (errors) {
          errors.push("must not be greater than facet 'maxLength'");
        }
        return false;
      }
      return true;
    },

    createValidator: function () {
      return $propertyValidator.create(
        'getLength',
        $minimumValidator.create(this.getValue())
      );
    }

  });

  return $;

});
