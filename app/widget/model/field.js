/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'app/widget/config',
  'sulfur/ui/model'
], function (config, Model) {

  'use strict';

  return Model.clone({

    attributes: {
      name: { default: '' },
      value: { default: null },
      required: { default: false }
    },

    _extract: function () {
      throw new Error("not implemented");
    }

  }).augment({

    _validate: function (errors) {
      Model.prototype._validate.call(this, errors);
      var schema = config.resource.schema;
      var element = schema.elements.getByName(this.get('name'));
      var value = this.get('value');
      if (element && value) {
        errors.value || (this.get('required') && !value.object && (errors.value = "is required"));
        value.validateWithType(element.type);
      }
    },

    _construct: function () {
      var name = this.get('name');
      var value = this.get('value');
      if (name && value) {
        return {
          name: name,
          value: value.object
        };
      }
    }

  });

});
