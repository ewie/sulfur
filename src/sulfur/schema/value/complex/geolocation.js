/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/factory',
  'sulfur/schema/value/complex',
  'sulfur/schema/value/simple/double',
  'sulfur/util'
], function (Factory, ComplexValue, DoubleValue, util) {

  'use strict';

  function isDouble(x) {
    return DoubleValue.prototype.isPrototypeOf(x);
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

  function getValue(name, values) {
    var value = util.first(values, function (value) {
      return value[0] === name;
    });
    return value && value[1];
  }

  return ComplexValue.derive({

    /**
     * Initialize the location with a longitude and latitude.
     *
     * @param {array} values an array of name/value pairs
     *
     * @throw {Error} when longitude or latitude is not a sulfur/schema/double
     * @throw {Error} when longitude or latitude is NaN
     * @throw {Error} when longitude is not withing range [-180, 180]
     * @throw {Error} when latitude is not withing range [-90, 90]
     */
    initialize: function (values) {
      var longitude = getValue('longitude', values);
      var latitude = getValue('latitude', values);
      if (!longitude) {
        throw new Error("expecting a longitude value");
      }
      if (!latitude) {
        throw new Error("expecting a latitude value");
      }
      if (values.length > 2) {
        throw new Error("expecting only longitude and latitude");
      }
      assertValue('longitude', longitude, 180);
      assertValue('latitude', latitude, 90);
      ComplexValue.prototype.initialize.call(this, values);
    }

  });

});
