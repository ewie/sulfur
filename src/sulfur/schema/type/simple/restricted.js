/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define(['sulfur/factory'], function ($factory) {

  'use strict';

  var $ = $factory.derive({

    initialize: function (base, facets) {

      var allowedFacets = base.getAllowedFacets();

      allowedFacets.toArray().forEach(function (allowedFacet) {
        if (facets.hasFacet(allowedFacet.getQName())) {
          allowedFacet.getMutualExclusiveFacets().forEach(function (mutexFacet) {
            if (facets.hasFacet(mutexFacet.getQName())) {
              throw new Error("facets " + allowedFacet.getQName() + " and " +
                mutexFacet.getQName() + " are mutual exclusive");
            }
          });
        }
      });

      var hasUnexpectedFacets = facets.toArray().some(function (facet) {
        return !allowedFacets.getFacet(facet.getQName());
      });
      if (hasUnexpectedFacets) {
        throw new Error("expecting only facets defined by the base");
      }

      var isNoRestriction = facets.toArray().some(function (facet) {
        return facet.isRestrictionOf(base) === false;
      });
      if (isNoRestriction) {
        throw new Error("expecting the facets to be equal to or more restrictive than the base facets");
      }

      this._base = base;
      this._facets = facets;
    },

    getBasePrimitive: function () {
      if (this._base.getBasePrimitive) {
        return this._base.getBasePrimitive();
      }
      return this._base;
    },

    getBase: function () {
      return this._base;
    },

    getFacets: function () {
      return this._facets;
    },

    getValueType: function () {
      return this._base.getValueType();
    },

    getAllowedFacets: function () {
      return this._base.getAllowedFacets();
    },

    isRestrictionOf: function (other) {
      var basePrimitive = this.getBasePrimitive();

      // Trivial if the other type is this restriction's base primitive.
      if (basePrimitive === other) {
        return true;
      }

      // Assert if the other type is a restriction and has the same base
      // primitive as this restriction.
      if (!other.getBasePrimitive || basePrimitive !== other.getBasePrimitive()) {
        return false;
      }

      return other.getAllowedFacets().toArray().every(function (allowedFacet) {
        // Ignore allowed facets when the other type has no effective instances.
        // This also checks any mutual exclusive facet, because the allowed
        // facets must include all mutual exclusive facets.
        if (!allowedFacet.getEffectiveFacets(other)) {
          return true;
        }

        // Check if an effective facet is also effective in this restriction.
        var effectiveFacets = allowedFacet.getEffectiveFacets(this);
        if (effectiveFacets) {
          // Check if that effective facet is a restriction of the other type.
          return effectiveFacets[0].isRestrictionOf(other);
        }

        // Check if any mutual exclusive facet is in effect and, if so, a
        // restriction of the other type.
        var mutexFacets = allowedFacet.getMutualExclusiveFacets();
        return mutexFacets.some(function (mutexFacet) {
          var effectiveFacets = mutexFacet.getEffectiveFacets(this);
          return effectiveFacets && effectiveFacets[0].isRestrictionOf(other);
        }.bind(this));
      }.bind(this));
    },

    createValidator: function () {
      return this.getBasePrimitive().createRestrictionValidator(this);
    }

  });

  return $;

});
