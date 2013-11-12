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
], function (Facet, QName, util) {

  'use strict';

  var qname = QName.create('whiteSpace', 'http://www.w3.org/2001/XMLSchema');

  return Facet.clone({

    get qname() { return qname; },

    isShadowingLowerRestrictions: util.returns(true),

    get mutualExclusiveFacets() { return []; }

  }).augment({

    initialize: function (value) {
      if (value !== 'collapse' && value !== 'preserve' && value !== 'replace') {
        throw new Error('expecting either "collapse", "preserve" or "replace"');
      }
      Facet.prototype.initialize.call(this, value);
    },

    isRestrictionOf: function (type) {
      var whiteSpaceFacet = this.factory.getEffectiveFacet(type);
      if (!whiteSpaceFacet) {
        return true;
      }
      var thisValue = this.value;
      var otherValue = whiteSpaceFacet.value;
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

});
