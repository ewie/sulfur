/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'app/editor/model/value/pattern',
  'sulfur/schema/facet/pattern',
  'sulfur/ui/collection',
  'sulfur/ui/model'
], function (PatternValueModel, PatternFacet, Collection, Model) {

  'use strict';

  return Model.clone({

    attributes: {
      groups: { default: function () { return Collection.create() } }
    },

    withValueModel: function () { return this },

    _extract: function (facets) {
      var groups = facets.map(function (facet) {
        var values = facet.value.map(function (value) {
          return PatternValueModel.createFromObject(value);
        });
        return Collection.create(values);
      });
      return { groups: Collection.create(groups) };
    }

  }).augment({

    validateWithBaseTypeAndFacets: function () {
      // empty
    },

    _construct: function () {
      return this.get('groups').items.reduce(function (facets, group) {
        if (group.size > 0) {
          var values = group.items.map(function (value) {
            return value.object;
          });
          facets.push(PatternFacet.create(values));
        }
        return facets;
      }, []);
    }

  });

});
