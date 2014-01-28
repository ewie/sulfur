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
      latitude: { default: function () { return DoubleValueModel.create() } },
      longitude: { default: function () { return DoubleValueModel.create() } }
    },

    _extract: function (value) {
      return {
        latitude: DoubleValueModel.createFromObject(value.value('latitude')),
        longitude: DoubleValueModel.createFromObject(value.value('longitude'))
      };
    },

    get valueType() { return GeolocationValue }

  }).augment({

    get valueType() { return this.factory.valueType },

    validateWithType: function (type) {
      if (this.isInternallyValid()) {
        var value = this.object;
        var err = false;
        if (value) {
          var v = type.createValidator();
          var errors = [];
          var isValid = v.validate(value, errors);
          isValid || (err = errors.join('\n'));
        }
        this.updateExternalErrors({ value: err });
      }
    },

    _construct: function () {
      var lat = this.get('latitude').object;
      var lng = this.get('longitude').object;
      if (lat && lng) {
        return GeolocationValue.create([
          [ 'latitude', lat ],
          [ 'longitude', lng ]
        ]);
      }
    }

  });

});
