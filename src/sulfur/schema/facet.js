/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/util/factory',
  'sulfur/schema/validator/all',
  'sulfur/util'
], function (Factory, AllValidator, util) {

  'use strict';

  /**
   * @abstract
   *
   * @implement {sulfur/schema/qname} .qname
   * @implement {boolean} .isShadowingLowerRestrictions()
   * @implement {.validate()} #createValidator()
   * @implement {boolean} #validate({any})
   * @implement {boolean} #isRestrictionOf({sulfur/schema/facets})
   *
   * @api private
   */
  return Factory.clone({

    getEffectiveFacets: (function () {

      function anyMutexFacet(facets, mutexFacets) {
        return mutexFacets.some(function (mutexFacet) {
          return facets.hasByQName(mutexFacet.qname);
        });
      }

      return function (restriction) {
        var mutexFacets = this.mutualExclusiveFacets;
        var effectiveFacets = [];
        while (restriction.facets) {
          var facets = restriction.facets;
          if (anyMutexFacet(facets, mutexFacets)) {
            break;
          }
          var facet = facets.getByQName(this.qname);
          facet && effectiveFacets.push(facet);
          if (this.isShadowingLowerRestrictions()) {
            break;
          }
          restriction = restriction.base;
        }
        if (effectiveFacets.length > 0) {
          return effectiveFacets;
        }
      };

    }()),

    getEffectiveFacet: function (restriction) {
      if (!this.isShadowingLowerRestrictions()) {
        throw new Error("a non-shadowing facet could have multiple effective instances");
      }
      var effectiveFacets = this.getEffectiveFacets(restriction);
      return effectiveFacets && effectiveFacets[0];
    },

    createConjunctionValidator: function (facets) {
      if (this.isShadowingLowerRestrictions() || facets.length === 1) {
        return facets[0].createValidator();
      }
      return AllValidator.create(facets.map(util.method('createValidator')));
    }

  }).augment({

    /**
     * Initialize the facet with a value.
     *
     * @param {any} value
     *
     * @api public
     */
    initialize: function (value) {
      this._value = value;
    },

    /**
     * @api public
     *
     * @return {string} the facet's name
     */
    get qname() {
      return this.factory.qname;
    },

    isShadowingLowerRestrictions: function () {
      return this.factory.isShadowingLowerRestrictions();
    },

    /**
     * @api public
     *
     * @return {any} the facet's value
     */
    get value() {
      return this._value;
    }

  });

});
