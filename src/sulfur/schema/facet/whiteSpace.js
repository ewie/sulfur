/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/facet',
  'sulfur/schema/qname',
  'sulfur/util'
], function ($facet, $qname, $util) {

  'use strict';

  var $ = $facet.clone({

    getQName: $util.returns(
      $qname.create('whiteSpace', 'http://www.w3.org/2001/XMLSchema')),

    isShadowingLowerRestrictions: $util.returns(true),

    getMutualExclusiveFacets: $util.returns([])

  });

  $.augment({

    initialize: function (value) {
      if (value !== 'collapse' && value !== 'preserve' && value !== 'replace') {
        throw new Error('expecting either "collapse", "preserve" or "replace"');
      }
      $facet.prototype.initialize.call(this, value);
    },

    isRestrictionOf: function (type) {
      var whiteSpaceFacet = this.factory.getEffectiveFacet(type);
      if (!whiteSpaceFacet) {
        return true;
      }
      var thisValue = this.getValue();
      var otherValue = whiteSpaceFacet.getValue();
      if (otherValue === 'collapse') {
        return thisValue === 'collapse';
      }
      if (otherValue === 'replace') {
        return thisValue !== 'preserve';
      }
      return true;
    },

    validate: function () {
      return true;
    },

    createValidator: function () {
      throw new Error("validator creation is not allowed");
    }

  });

  return $;

});
