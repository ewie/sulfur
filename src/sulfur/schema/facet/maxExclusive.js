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
  'sulfur/schema/facet/maxInclusive',
  'sulfur/schema/facet/minExclusive',
  'sulfur/schema/facet/minInclusive',
  'sulfur/schema/qname',
  'sulfur/schema/validator/maximum'
], function (
    require,
    Facet,
    MaxInclusiveFacet,
    MinExclusiveFacet,
    MinInclusiveFacet,
    QName,
    MaximumValidator
) {

  'use strict';

  function requireFacet(name) {
    return function () {
      return require('sulfur/schema/facet/' + name);
    };
  }

  var requireMinExclusiveFacet = requireFacet('minExclusive');
  var requireMaxInclusiveFacet = requireFacet('maxInclusive');
  var requireMinInclusiveFacet = requireFacet('minInclusive');

  var qname = QName.create('maxExclusive', 'http://www.w3.org/2001/XMLSchema');

  return Facet.clone({

    get qname() { return qname },

    get isShadowingLowerRestrictions() { return true },

    get mutexFacets() { return [ requireMaxInclusiveFacet() ] },

    getValueType: function (type) { return type.valueType }

  }).augment({

    isRestrictionOf: function (type) {
      return type.createValidator().validate(this.value);
    },

    validateAmongFacets: function (facets, errors) {
      if (facets.hasByQName(requireMaxInclusiveFacet().qname)) {
        if (errors) {
          errors.push("cannot be used along with facet 'maxInclusive'");
        }
        return false;
      }

      var minExclusiveFacet = facets.getByQName(requireMinExclusiveFacet().qname);
      if (minExclusiveFacet && this.value.lt(minExclusiveFacet.value)) {
        if (errors) {
          errors.push("must be greater than or equal to facet 'minExclusive'");
        }
        return false;
      }

      var minInclusiveFacet = facets.getByQName(requireMinInclusiveFacet().qname);
      if (minInclusiveFacet && this.value.lteq(minInclusiveFacet.value)) {
        if (errors) {
          errors.push("must be greater than facet 'minInclusive'");
        }
        return false;
      }

      return true;
    },

    createValidator: function () {
      return MaximumValidator.create(this.value, { exclusive: true });
    }

  });

});
