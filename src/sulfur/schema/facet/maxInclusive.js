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
  'sulfur/schema/facet/minExclusive',
  'sulfur/schema/facet/minInclusive',
  'sulfur/schema/qname',
  'sulfur/schema/validator/maximum',
  'sulfur/util'
], function (
    require,
    Facet,
    MaxExclusiveFacet,
    MinExclusiveFacet,
    MinInclusiveFacet,
    QName,
    MaximumValidator,
    util
) {

  'use strict';

  function requireFacet(name) {
    return function () {
      return require('sulfur/schema/facet/' + name);
    };
  }

  var requireMaxExclusiveFacet = requireFacet('maxExclusive');
  var requireMinExclusiveFacet = requireFacet('minExclusive');
  var requireMinInclusiveFacet = requireFacet('minInclusive');

  var qname = QName.create('maxInclusive', 'http://www.w3.org/2001/XMLSchema');

  return Facet.clone({

    get qname() { return qname; },

    isShadowingLowerRestrictions: util.returns(true),

    get mutualExclusiveFacets() {
      return [ requireMaxExclusiveFacet() ];
    }

  }).augment({

    isRestrictionOf: function (type) {
      return type.createValidator().validate(this.value);
    },

    validate: function (type, errors) {
      if (!type.valueType.prototype.isPrototypeOf(this.value)) {
        return false;
      }

      if (type.hasByQName(requireMaxExclusiveFacet().qname)) {
        if (errors) {
          errors.push("cannot be used along with facet 'maxExclusive'");
        }
        return false;
      }

      var minExclusiveFacet = type.getByQName(requireMinExclusiveFacet().qname);
      if (minExclusiveFacet && this.value.lteq(minExclusiveFacet.value)) {
        if (errors) {
          errors.push("must be greater than facet 'minExclusive'");
        }
        return false;
      }

      var minInclusiveFacet = type.getByQName(requireMinInclusiveFacet().qname);
      if (minInclusiveFacet && this.value.lt(minInclusiveFacet.value)) {
        if (errors) {
          errors.push("must be greater than or equal to facet 'minInclusive'");
        }
        return false;
      }

      return true;
    },

    createValidator: function () {
      return MaximumValidator.create(this.value);
    }

  });

});
