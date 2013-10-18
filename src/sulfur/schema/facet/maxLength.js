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
  'sulfur/schema/validator/maximum',
  'sulfur/schema/validator/property',
  'sulfur/util'
], function (
    require,
    $facet,
    $qname,
    $restrictedType,
    $maximumValidator,
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
  var requireMinLengthFacet = requireFacet('minLength');

  var $ = $facet.clone({

    getQName: $util.returns(
      $qname.create('maxLength', 'http://www.w3.org/2001/XMLSchema')),

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

      var maxLengthFacet = this.factory.getEffectiveFacet(type);
      if (maxLengthFacet && this.getValue() > maxLengthFacet.getValue()) {
        return false;
      }

      var minLengthFacet = requireMinLengthFacet().getEffectiveFacet(type);
      if (minLengthFacet && this.getValue() < minLengthFacet.getValue()) {
        return false;
      }

      return true;
    },

    validate: function (type, errors) {
      var minLengthFacet = type.getFacet(requireMinLengthFacet().getQName());
      if (minLengthFacet && this._value < minLengthFacet.getValue()) {
        if (errors) {
          errors.push("must not be less than facet 'minLength'");
        }
        return false;
      }
      return true;
    },

    createValidator: function () {
      return $propertyValidator.create(
        'getLength',
        $maximumValidator.create(this.getValue())
      );
    }

  });

  return $;

});
