/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'app/editor/model/value/mediaType',
  'sulfur/schema/facet/mediaType',
  'sulfur/ui/collection',
  'sulfur/ui/model'
], function (MediaTypeValueModel, MediaTypeFacet, Collection, Model) {

  'use strict';

  return Model.clone({

    attributes: {
      values: { default: function () { return Collection.create() } }
    },

    withValueModel: function () {
      return this;
    },

    get valueModel() { return MediaTypeValueModel },

    _extract: function (facet) {
      var values = facet.value.map(function (value) {
        return this.valueModel.createFromObject(value);
      }.bind(this));
      return { values: Collection.create(values) };
    }

  }).augment({

    get valueModel() { return this.factory.valueModel },

    validateWithBaseTypeAndFacets: function () {
      // empty
    },

    _construct: function () {
      var values = this.get('values').items.reduce(function (values, value) {
        value = value.object;
        value && values.push(value);
        return values;
      }, []);
      if (values.length) {
        return MediaTypeFacet.create(values);
      }
    }

  });

});
