/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/value/list',
  'sulfur/ui/collection',
  'sulfur/ui/model'
], function (ListValue, Collection, Model) {

  'use strict';

  return Model.clone({

    attributes: {
      values: { default: function () { return Collection.create() } }
    },

    withItemValueModel: function (itemValueModel) {
      return this.clone({ get itemValueModel() { return itemValueModel } });
    },

    _extract: function (value) {
      var values = value.toArray().map(function (value) {
        return this.itemValueModel.createFromObject(value);
      }.bind(this));
      return { values: Collection.create(values) };
    }

  }).augment({

    get itemValueModel() { return this.factory.itemValueModel },

    get valueType() {
      return ListValue.withItemValueType(this.factory.itemValueModel.valueType);
    },

    validateWithType: function (type) {
      var itemType = type.element.type;
      this.get('values').items.forEach(function (value) {
        value.validateWithType(itemType);
      });

      if (this.isInternallyValid()) {
        var value = this.object;
        var err = false;
        if (value) {
          var v = type.createValidator();
          var errors = [];
          var isValid = v.validate(value, errors);
          isValid || (err = errors.join('\n'));
        }
        this.updateExternalErrors({ values: err });
      }
    },

    _construct: function () {
      var values = this.get('values').items.reduce(function (values, m) {
        var value = m.object;
        value && values.push(value);
        return values;
      }, []);
      if (values.length) {
        return this.valueType.create(values);
      }
    }

  });

});
