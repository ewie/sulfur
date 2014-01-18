/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/facet/minExclusive',
  'sulfur/schema/facet/minInclusive',
  'sulfur/ui/model'
], function (MinExclusiveFacet, MinInclusiveFacet, Model) {

  'use strict';

  return Model.clone({

    attributes: {
      value: { default: function (factory) { return factory.valueModel.create() } },
      exclusive: { default: true }
    },

    withValueModel: function (valueModel) {
      return this.clone({ get valueModel() { return valueModel } });
    },

    _extract: function (facet) {
      var exclusive = MinExclusiveFacet.prototype.isPrototypeOf(facet);
      return {
        value: this.valueModel.createFromObject(facet.value),
        exclusive: exclusive
      };
    }

  }).augment({

    get valueModel() { return this.factory.valueModel },

    validateWithBaseTypeAndFacets: function (baseType, facets) {
      var facet = this.object;
      if (facet) {
        var err = false;
        var errors = [];
        facet.isRestrictionOf(baseType) || (err = "must restrict the base type");
        if (!err) {
          facet.validateAmongFacets(facets, errors);
          errors.length && (err = errors[0]);
        }
        this.get('value').updateExternalErrors({ value: err });
      }
    },

    _construct: function () {
      var value = this.get('value').object;
      if (value) {
        if (this.get('exclusive')) {
          return MinExclusiveFacet.create(value);
        } else {
          return MinInclusiveFacet.create(value);
        }
      }
    }

  });

});
