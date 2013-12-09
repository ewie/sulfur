/* Copyright (c) 2013, Erik Wienhold
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
  'sulfur/schema/facet/minExclusive',
  'sulfur/schema/qname',
  'sulfur/schema/validator/minimum'
], function (
    require,
    Facet,
    MaxExclusiveFacet,
    MaxInclusiveFacet,
    MinExclusiveFacet,
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
  var requireMinExclusiveFacet = requireFacet('minExclusive');

  var qname = QName.create('minInclusive', 'http://www.w3.org/2001/XMLSchema');

  return Facet.clone({

    get qname() { return qname },

    get isShadowingLowerRestrictions() { return true },

    get mutualExclusiveFacets() { return [ requireMinExclusiveFacet() ] },

    getValueType: function (type) { return type.valueType }

  }).augment({

    isRestrictionOf: function (type) {
      return type.createValidator().validate(this.value);
    },

    validate: function (type, errors) {
      if (!type.valueType.prototype.isPrototypeOf(this.value)) {
        return false;
      }

      if (type.hasByQName(requireMinExclusiveFacet().qname)) {
        if (errors) {
          errors.push("cannot be used along with facet 'minExclusive'");
        }
        return false;
      }

      var maxExclusiveFacet = type.getByQName(requireMaxExclusiveFacet().qname);
      if (maxExclusiveFacet && this.value.gteq(maxExclusiveFacet.value)) {
        if (errors) {
          errors.push("must be less than facet 'maxExclusive'");
        }
        return false;
      }

      var maxInclusiveFacet = type.getByQName(requireMaxInclusiveFacet().qname);
      if (maxInclusiveFacet && this.value.gt(maxInclusiveFacet.value)) {
        if (errors) {
          errors.push("must be less than or equal to facet 'maxInclusive'");
        }
        return false;
      }

      return true;
    },

    createValidator: function () {
      return MinimumValidator.create(this.value);
    }

  });

});
