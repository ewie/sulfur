/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define(['sulfur/util/factory'], function (Factory) {

  'use strict';

  return Factory.derive({

    initialize: function (base, facets) {
      var allowedFacets = base.allowedFacets;

      allowedFacets.toArray().forEach(function (allowedFacet) {
        if (facets.hasByQName(allowedFacet.qname)) {
          allowedFacet.mutexFacets.forEach(function (mutexFacet) {
            if (facets.hasByQName(mutexFacet.qname)) {
              throw new Error("facets " + allowedFacet.qname + " and " +
                mutexFacet.qname + " are mutual exclusive");
            }
          });
        }
      });

      var hasUnexpectedFacets = facets.toArray().some(function (facet) {
        return !allowedFacets.hasByQName(facet.qname);
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

    get primitive() { return this.base.primitive || this.base },

    get namedBaseOrSelf() { return this.base.namedBaseOrSelf },

    get base() { return this._base },

    get facets() { return this._facets },

    get valueType() { return this.base.valueType },

    get allowedFacets() { return this.base.allowedFacets },

    isRestrictionOf: function (other) {
      var primitive = this.primitive;

      // Trivial if the other type is this restriction's base primitive.
      if (primitive === other) {
        return true;
      }

      // Assert if the other type is a restriction and has the same base
      // primitive as this restriction.
      if (!other.primitive || primitive !== other.primitive) {
        return false;
      }

      return other.allowedFacets.toArray().every(function (allowedFacet) {
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
        var mutexFacets = allowedFacet.mutexFacets;
        return mutexFacets.some(function (mutexFacet) {
          var effectiveFacets = mutexFacet.getEffectiveFacets(this);
          if (effectiveFacets) {
            return effectiveFacets[0].isRestrictionOf(other);
          } else {
            return true;
          }
        }.bind(this));
      }.bind(this));
    },

    createValidator: function () {
      return this.primitive.createRestrictionValidator(this);
    }

  });

});
