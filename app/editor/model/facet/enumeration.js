/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/facet/enumeration',
  'sulfur/ui/collection',
  'sulfur/ui/model'
], function (EnumerationFacet, Collection, Model) {

  'use strict';

  return Model.clone({

    attributes: {
      values: { default: function () { return Collection.create() } }
    },

    withValueModel: function (valueModel) {
      return this.clone({ get valueModel() { return valueModel } });
    },

    _extract: function (facet) {
      var values = facet.value.map(function (value) {
        return this.valueModel.createFromObject(value);
      }.bind(this));
      return { values: Collection.create(values) };
    }

  }).augment({

    get valueModel() { return this.factory.valueModel },

    validateWithBaseTypeAndFacets: function (baseType) {
      this.get('values').items.forEach(function (value) {
        value.validateWithType(baseType);
      });
    },

    _construct: function () {
      var values = this.get('values');
      if (values.size > 0) {
        values = values.items.reduce(function (values, value) {
          value.object && values.push(value.object);
          return values;
        }, []);
        if (values.length > 0) {
          return EnumerationFacet.create(values);
        }
      }
    }

  });

});
