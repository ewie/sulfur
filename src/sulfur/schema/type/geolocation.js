/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/factory',
  'sulfur/schema/type/double',
  'sulfur/schema/validators',
  'sulfur/schema/value/double',
  'sulfur/schema/value/geolocation',
  'sulfur/util'
], function (
    $factory,
    $doubleValueType,
    $validators,
    $doubleValue,
    $geolocationValue,
    $util
) {

  'use strict';

  var DEFAULT_LONGITUDE_TYPE = $doubleValueType.create({
    minInclusive: $doubleValue.create(-180),
    maxInclusive: $doubleValue.create(180)
  });

  var DEFAULT_LATITUDE_TYPE = $doubleValueType.create({
    minInclusive: $doubleValue.create(-90),
    maxInclusive: $doubleValue.create(90)
  });

  function assertPropertyType(name, type, min, max) {
    if (!$doubleValueType.prototype.isPrototypeOf(type)) {
      throw new Error(name + " type must be a sulfur/schema/type/double");
    }
    var value = type.getMinExclusiveValue() || type.getMinInclusiveValue();
    if (value && value.lt(min)) {
      throw new Error(name + " type must not allow values outside [" +
        min.getValue() + ", " + max.getValue() + "]");
    }
    value = type.getMaxExclusiveValue() || type.getMaxInclusiveValue();
    if (value && value.gt(max)) {
      throw new Error(name + " type must not allow values outside [" +
        min.getValue() + ", " + max.getValue() + "]");
    }
  }

  function getLongitudeType(type) {
    $util.isUndefined(type) && (type = DEFAULT_LONGITUDE_TYPE);
    assertPropertyType('longitude', type,
      DEFAULT_LONGITUDE_TYPE.getMinInclusiveValue(),
      DEFAULT_LONGITUDE_TYPE.getMaxInclusiveValue());
    return type;
  }

  function getLatitudeType(type) {
    $util.isUndefined(type) && (type = DEFAULT_LATITUDE_TYPE);
    assertPropertyType('latitude', type,
      DEFAULT_LATITUDE_TYPE.getMinInclusiveValue(),
      DEFAULT_LATITUDE_TYPE.getMaxInclusiveValue());
    return type;
  }

  return $factory.derive({

    /**
     * Initialize this geolocation type with a type each for its longitude and
     * latitude properties.
     *
     * @param [object] properties (optional)
     *
     * @option properties [sulfur/schema/type/double] longitude (optional)
     *   defaults to a double type restricting values to [-180, 180]
     * @option properties [sulfur/schema/type/double] latitude (optional)
     *   defaults to a double type restricting values to [-90, 90]
     *
     * @throw [Error] if either type is not a double type
     * @throw [Error] if either custom type is less restrictive than the
     *   respective default type
     */
    initialize: function (properties) {
      properties || (properties = {});

      var longitude = getLongitudeType(properties.longitude);
      var latitude = getLatitudeType(properties.latitude);

      this._longitude = longitude;
      this._latitude = latitude;
    },

    /**
     * @return [sulfur/schema/type/double] the type for the longitude property
     */
    getLongitudeType: function () {
      return this._longitude;
    },

    /**
     * @return [sulfur/schema/type/double] the type for the latitude property
     */
    getLatitudeType: function () {
      return this._latitude;
    },

    /**
     * @return [#validate()] the validator
     */
    validator: function () {
      return $validators.all.create([
        $validators.prototype.create($geolocationValue.prototype),
        $validators.property.create('getLongitude',
          this._longitude.validator()),
        $validators.property.create('getLatitude',
          this._latitude.validator())
      ]);
    }

  });

});
