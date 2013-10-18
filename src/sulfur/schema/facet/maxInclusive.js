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
  'sulfur/schema/validator/maximum',
  'sulfur/util'
], function (require, Facet, QName, MaximumValidator, util) {

  'use strict';

  function requireFacet(name) {
    return function () {
      return require('sulfur/schema/facet/' + name);
    };
  }

  var requireMaxExclusiveFacet = requireFacet('maxExclusive');
  var requireMinExclusiveFacet = requireFacet('minExclusive');
  var requireMinInclusiveFacet = requireFacet('minInclusive');

  var $ = Facet.clone({

    getQName: util.returns(
      QName.create('maxInclusive', 'http://www.w3.org/2001/XMLSchema')),

    isShadowingLowerRestrictions: util.returns(true),

    getMutualExclusiveFacets: util.once(function () {
      return [ requireMaxExclusiveFacet() ];
    })

  });

  $.augment({

    isRestrictionOf: function (type) {
      return type.createValidator().validate(this.getValue());
    },

    validate: function (type, errors) {
      if (!type.getValueType().prototype.isPrototypeOf(this.getValue())) {
        return false;
      }

      if (type.hasFacet(requireMaxExclusiveFacet().getQName())) {
        if (errors) {
          errors.push("cannot be used along with facet 'maxExclusive'");
        }
        return false;
      }

      var minExclusiveFacet = type.getFacet(requireMinExclusiveFacet().getQName());
      if (minExclusiveFacet && this.getValue().lteq(minExclusiveFacet.getValue())) {
        if (errors) {
          errors.push("must be greater than facet 'minExclusive'");
        }
        return false;
      }

      var minInclusiveFacet = type.getFacet(requireMinInclusiveFacet().getQName());
      if (minInclusiveFacet && this.getValue().lt(minInclusiveFacet.getValue())) {
        if (errors) {
          errors.push("must be greater than or equal to facet 'minInclusive'");
        }
        return false;
      }

      return true;
    },

    createValidator: function () {
      return MaximumValidator.create(this.getValue());
    }

  });

  return $;

});
