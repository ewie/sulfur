/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'app/common/model/value/integer',
  'sulfur/schema/facet/maxLength',
  'sulfur/ui/model'
], function (IntegerValueModel, MaxLengthFacet, Model) {

  'use strict';

  return Model.clone({

    attributes: {
      value: { default: function () { return IntegerValueModel.create() } }
    },

    withValueModel: function () { return this },

    _extract: function (facet) {
      return {
        value: IntegerValueModel.createFromObject(facet.value)
      };
    }

  }).augment({

    get valueModel() { return this.factory.valueModel },

    validateWithBaseTypeAndFacets: function (_, facets) {
      var err = false;
      var valueModel = this.get('value');
      var value = valueModel.object;
      if (value && value.isNegative) {
        err = "must be non-negative";
      } else {
        var facet = this.object;
        if (facet) {
          var errors = [];
          facet.validateAmongFacets(facets, errors);
          errors.length && (err = errors[0]);
        }
      }
      valueModel.updateExternalErrors({ value: err });
    },

    _construct: function () {
      var value = this.get('value').object;
      if (value && !value.isNegative) {
        return MaxLengthFacet.create(value);
      }
    }

  });

});
