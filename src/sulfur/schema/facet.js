/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/factory',
  'sulfur/schema/validator/all',
  'sulfur/util'
], function ($factory, $allValidator, $util) {

  'use strict';

  /**
   * @abstract
   *
   * @implement [sulfur/schema/qname] .getQName()
   * @implement [boolean] .isShadowingLowerRestrictions()
   * @implement [#validate()] #createValidator()
   * @implement [boolean] #validate([any])
   * @implement [boolean] #isRestrictionOf([sulfur/schema/facets])
   *
   * @api private
   */
  var $ = $factory.clone({

    getEffectiveFacets: (function () {

      function anyMutexFacet(facets, mutexFacets) {
        return mutexFacets.some(function (mutexFacet) {
          return facets.hasFacet(mutexFacet.getQName());
        });
      }

      return function (restriction) {
        var mutexFacets = this.getMutualExclusiveFacets();
        var effectiveFacets = [];
        while (restriction.getFacets) {
          var facets = restriction.getFacets();
          if (anyMutexFacet(facets, mutexFacets)) {
            break;
          }
          var facet = facets.getFacet(this.getQName());
          facet && effectiveFacets.push(facet);
          if (this.isShadowingLowerRestrictions()) {
            break;
          }
          restriction = restriction.getBase();
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
      return $allValidator.create(facets.map($util.method('createValidator')));
    }

  });

  $.augment({

    /**
     * Initialize the facet with a value.
     *
     * @param [any] value
     *
     * @api public
     */
    initialize: function (value) {
      this._value = value;
    },

    /**
     * @api public
     *
     * @return [string] the facet's name
     */
    getQName: function () {
      return this.factory.getQName();
    },

    isShadowingLowerRestrictions: function () {
      return this.factory.isShadowingLowerRestrictions();
    },

    /**
     * @api public
     *
     * @return [any] the facet's value
     */
    getValue: function () {
      return this._value;
    }

  });

  return $;

});
