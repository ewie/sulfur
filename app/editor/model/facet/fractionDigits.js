/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'app/common/model/value/integer',
  'sulfur/schema/facet/fractionDigits',
  'sulfur/ui/model'
], function (IntegerValueModel, FractionDigitsFacet, Model) {

  'use strict';

  return Model.clone({

    attributes: {
      value: { default: function () { return IntegerValueModel.create() } }
    },

    withValueModel: function () { return this },

    get valueModel() { return IntegerValueModel },

    _extract: function (facet) {
      return {
        value: IntegerValueModel.createFromObject(facet.value)
      };
    }

  }).augment({

    get valueModel() { return this.factory.valueModel },

    validateWithBaseTypeAndFacets: function (baseType) {
      var valueModel = this.get('value');
      var err = false;
      var value = valueModel.object;
      if (value && value.isNegative) {
        err = "must be non-negative";
      }
      var facet = this.object;
      if (facet  && !facet.isRestrictionOf(baseType)) {
        err = "must restrict the base type";
      }
      valueModel.updateExternalErrors({ value: err });
    },

    _construct: function () {
      var value = this.get('value').object;
      if (value && !value.isNegative) {
        return FractionDigitsFacet.create(value);
      }
    }

  });

});
