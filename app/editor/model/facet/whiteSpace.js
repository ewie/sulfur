/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/facet/whiteSpace',
  'sulfur/schema/value/simple/whiteSpace',
  'sulfur/ui/model'
], function (WhiteSpaceFacet, WhiteSpaceValue, Model) {

  'use strict';

  return Model.clone({

    attributes: {
      value: { default: null }
    },

    withValueModel: function () { return this },

    _extract: function (value) {
      return { value: value.value };
    }

  }).augment({

    get valueModel() { return this.factory.valueModel },

    validateWithBaseTypeAndFacets: function () {
      // empty
    },

    _construct: function () {
      var value = this.get('value');
      if (value) {
        value = WhiteSpaceValue.create(value);
        return WhiteSpaceFacet.create(value);
      }
    }

  });

});
