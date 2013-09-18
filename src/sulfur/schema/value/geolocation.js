/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/factory',
  'sulfur/schema/value/double'
], function ($factory, $doubleValue) {

  'use strict';

  function isDouble(x) {
    return $doubleValue.prototype.isPrototypeOf(x);
  }

  function assertValue(name, value, max) {
    if (!isDouble(value)) {
      throw new Error(name + " must be a sulfur/schema/double");
    }
    if (value.isNaN()) {
      throw new Error(name + " must not be NaN");
    }
    if (value.getValue() < -max) {
      throw new Error(name + " must not be less than -" + max);
    }
    if (value.getValue() > max) {
      throw new Error(name + " must not be greater than " + max);
    }
  }

  return $factory.derive({

    /**
     * Initialize the location with a longitude and latitude.
     *
     * @param [sulfur/schema/value/double] longitude
     * @param [sulfur/schema/value/double] latitude
     *
     * @throw [Error] when `longitude` or `latitude` is not a sulfur/schema/double
     * @throw [Error] when 'longitude` or `latitude` is NaN
     * @throw [Error] when `longitude` is not withing range [-180, 180]
     * @throw [Error] when `latitude` is not withing range [-90, 90]
     */
    initialize: function (longitude, latitude) {
      assertValue('longitude', longitude, 180);
      assertValue('latitude', latitude, 90);
      this._longitude = longitude;
      this._latitude = latitude;
    },

    /**
     * @return [sulfur/schema/value/double] the longitude
     */
    getLongitude: function () {
      return this._longitude;
    },

    /**
     * @return [sulfur/schema/value/double] the latitude
     */
    getLatitude: function () {
      return this._latitude;
    }

  });

});
