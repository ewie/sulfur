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
  'sulfur/schema/facet/maxExclusive',
  'sulfur/schema/facet/maxInclusive',
  'sulfur/schema/facet/minInclusive',
  'sulfur/schema/qname',
  'sulfur/schema/validator/minimum'
], function (
    require,
    Facet,
    MaxExclusiveFacet,
    MaxInclusiveFacet,
    MinInclusiveFacet,
    QName,
    MinimumValidator
) {

  'use strict';

  function requireFacet(name) {
    return function () {
      return require('sulfur/schema/facet/' + name);
    };
  }

  var requireMaxExclusiveFacet = requireFacet('maxExclusive');
  var requireMaxInclusiveFacet = requireFacet('maxInclusive');
  var requireMinInclusiveFacet = requireFacet('minInclusive');

  var qname = QName.create('minExclusive', 'http://www.w3.org/2001/XMLSchema');

  return Facet.clone({

    get qname() { return qname },

    get isShadowingLowerRestrictions() { return true },

    get mutexFacets() { return [ requireMinInclusiveFacet() ] },

    getValueType: function (type) { return type.valueType }

  }).augment({

    isRestrictionOf: function (type) {
      return type.createValidator().validate(this.value);
    },

    validateAmongFacets: function (facets, errors) {
      if (facets.hasByQName(requireMinInclusiveFacet().qname)) {
        if (errors) {
          errors.push("cannot be used along with facet 'minInclusive'");
        }
        return false;
      }

      var maxExclusiveFacet = facets.getByQName(requireMaxExclusiveFacet().qname);
      if (maxExclusiveFacet && this.value.gt(maxExclusiveFacet.value)) {
        if (errors) {
          errors.push("must be less than or equal to facet 'maxExclusive'");
        }
        return false;
      }

      var maxInclusiveFacet = facets.getByQName(requireMaxInclusiveFacet().qname);
      if (maxInclusiveFacet && this.value.gteq(maxInclusiveFacet.value)) {
        if (errors) {
          errors.push("must be less than facet 'maxInclusive'");
        }
        return false;
      }

      return true;
    },

    createValidator: function () {
      return MinimumValidator.create(this.value, { exclusive: true });
    }

  });

});
