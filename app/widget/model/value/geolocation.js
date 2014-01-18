/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'app/common/model/value/double',
  'sulfur/schema/value/complex/geolocation',
  'sulfur/ui/model'
], function (DoubleValueModel, GeolocationValue, Model) {

  'use strict';

  return Model.clone({

    attributes: {
      longitude: { default: function () { return DoubleValueModel.create() } },
      latitude: { default: function () { return DoubleValueModel.create() } }
    },

    _extract: function (value) {
      return {
        longitude: DoubleValueModel.createFromObject(value.value('longitude')),
        latitude: DoubleValueModel.createFromObject(value.value('latitude'))
      };
    },

    get valueType() { return GeolocationValue }

  }).augment({

    get valueType() { return this.factory.valueType },

    validateWithType: function (type) {
      var value = this.object;
      var err = false;
      if (value) {
        var v = type.createValidator();
        var errors = [];
        var isValid = v.validate(value, errors);
        isValid || (err = errors.join('\n'));
      }
      this.updateExternalErrors({ value: err });
    },

    _construct: function () {
      var lng = this.get('longitude').object;
      var lat = this.get('latitude').object;
      if (lat && lng) {
        return GeolocationValue.create([
          [ 'longitude', lng ],
          [ 'latitude', lat ]
        ]);
      }
    }

  });

});
