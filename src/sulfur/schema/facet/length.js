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
  'sulfur/schema/validator/equal',
  'sulfur/schema/validator/property',
  'sulfur/util'
], function (
    require,
    Facet,
    QName,
    EqualValidator,
    PropertyValidator,
    util
) {

  'use strict';

  function requireFacet(name) {
    return function () {
      return require('sulfur/schema/facet/' + name);
    };
  }

  var requireMaxLengthFacet = requireFacet('maxLength');
  var requireMinLengthFacet = requireFacet('minLength');

  var $ = Facet.clone({

    getQName: util.returns(
      QName.create('length', 'http://www.w3.org/2001/XMLSchema')),

    isShadowingLowerRestrictions: util.returns(true),

    getMutualExclusiveFacets: util.once(function () {
      return [
        requireMaxLengthFacet(),
        requireMinLengthFacet()
      ];
    })

  });

  $.augment({

    /**
     * @param {number} value
     *
     * @throw {Error} if `value` is not an integer within [0, 2^53)
     */
    initialize: function (value) {
      if (!util.isInteger(value) || value < 0) {
        throw new Error("expecting a non-negative integer less than 2^53");
      }
      Facet.prototype.initialize.call(this, value);
    },

    isRestrictionOf: function (type) {
      var lengthFacet = this.factory.getEffectiveFacet(type);
      if (lengthFacet && this.getValue() !== lengthFacet.getValue()) {
        return false;
      }

      var maxLengthFacet = requireMaxLengthFacet().getEffectiveFacet(type);
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
      if (type.hasFacet(requireMaxLengthFacet().getQName())) {
        if (errors) {
          errors.push("cannot be used along with facet 'maxLength'");
        }
        return false;
      }
      if (type.hasFacet(requireMinLengthFacet().getQName())) {
        if (errors) {
          errors.push("cannot be used along with facet 'minLength'");
        }
        return false;
      }
      return true;
    },

    createValidator: function () {
      return PropertyValidator.create('getLength',
        EqualValidator.create(this.getValue()));
    }

  });

  return $;

});
