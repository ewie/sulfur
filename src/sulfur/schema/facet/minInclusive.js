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
  'sulfur/schema/validator/minimum',
  'sulfur/util'
], function (require, $facet, $qname, $minimumValidator, $util) {

  'use strict';

  function requireFacet(name) {
    return function () {
      return require('sulfur/schema/facet/' + name);
    };
  }

  var requireMaxExclusiveFacet = requireFacet('maxExclusive');
  var requireMaxInclusiveFacet = requireFacet('maxInclusive');
  var requireMinExclusiveFacet = requireFacet('minExclusive');

  var $ = $facet.clone({

    getQName: $util.returns(
      $qname.create('minInclusive', 'http://www.w3.org/2001/XMLSchema')),

    isShadowingLowerRestrictions: $util.returns(true),

    getMutualExclusiveFacets: $util.once(function () {
      return [ requireMinExclusiveFacet() ];
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

      if (type.hasFacet(requireMinExclusiveFacet().getQName())) {
        if (errors) {
          errors.push("cannot be used along with facet 'minExclusive'");
        }
        return false;
      }

      var maxExclusiveFacet = type.getFacet(requireMaxExclusiveFacet().getQName());
      if (maxExclusiveFacet && this.getValue().gteq(maxExclusiveFacet.getValue())) {
        if (errors) {
          errors.push("must be less than facet 'maxExclusive'");
        }
        return false;
      }

      var maxInclusiveFacet = type.getFacet(requireMaxInclusiveFacet().getQName());
      if (maxInclusiveFacet && this.getValue().gt(maxInclusiveFacet.getValue())) {
        if (errors) {
          errors.push("must be less than or equal to facet 'maxInclusive'");
        }
        return false;
      }

      return true;
    },

    createValidator: function () {
      return $minimumValidator.create(this.getValue());
    }

  });

  return $;

});
