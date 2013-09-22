/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/factory',
  'sulfur/schema/facet/maxExclusive',
  'sulfur/schema/facet/maxInclusive',
  'sulfur/schema/facet/minExclusive',
  'sulfur/schema/facet/minInclusive',
  'sulfur/schema/type/double',
  'sulfur/schema/validator/all',
  'sulfur/schema/validator/property',
  'sulfur/schema/validator/prototype',
  'sulfur/schema/value/double',
  'sulfur/schema/value/geolocation',
  'sulfur/util'
], function (
    $factory,
    $maxExclusiveFacet,
    $maxInclusiveFacet,
    $minExclusiveFacet,
    $minInclusiveFacet,
    $doubleType,
    $allValidator,
    $propertyValidator,
    $prototypeValidator,
    $doubleValue,
    $geolocationValue,
    $util
) {

  'use strict';

  var MIN_LONGITUDE = $doubleValue.create(-180);
  var MAX_LONGITUDE = $doubleValue.create(180);

  var MIN_LATITUDE = $doubleValue.create(-90);
  var MAX_LATITUDE = $doubleValue.create(90);

  var DEFAULT_LONGITUDE_TYPE = $doubleType.create([
    $minInclusiveFacet.create(MIN_LONGITUDE),
    $maxInclusiveFacet.create(MAX_LONGITUDE)
  ]);

  var DEFAULT_LATITUDE_TYPE = $doubleType.create([
    $minInclusiveFacet.create(MIN_LATITUDE),
    $maxInclusiveFacet.create(MAX_LATITUDE)
  ]);

  function getFacetValue(type, facetName) {
    var facet = type.getStandardFacet(facetName);
    return facet && facet.getValue();
  }

  function assertPropertyType(name, type, min, max) {
    if (!$doubleType.prototype.isPrototypeOf(type)) {
      throw new Error(name + " type must be a sulfur/schema/type/double");
    }
    var value = getFacetValue(type, 'minExclusive') || getFacetValue(type, 'minInclusive');
    if (value && value.lt(min)) {
      throw new Error(name + " type must not allow values outside [" +
        min.getValue() + ", " + max.getValue() + "]");
    }
    value = getFacetValue(type, 'maxExclusive') || getFacetValue(type, 'maxInclusive');
    if (value && value.gt(max)) {
      throw new Error(name + " type must not allow values outside [" +
        min.getValue() + ", " + max.getValue() + "]");
    }
  }

  function getLongitudeType(type) {
    $util.isUndefined(type) && (type = DEFAULT_LONGITUDE_TYPE);
    assertPropertyType('longitude', type, MIN_LONGITUDE, MAX_LONGITUDE);
    return type;
  }

  function getLatitudeType(type) {
    $util.isUndefined(type) && (type = DEFAULT_LATITUDE_TYPE);
    assertPropertyType('latitude', type, MIN_LATITUDE, MAX_LATITUDE);
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
    createValidator: function () {
      return $allValidator.create([
        $prototypeValidator.create($geolocationValue.prototype),
        $propertyValidator.create('getLongitude',
          this._longitude.createValidator()),
        $propertyValidator.create('getLatitude',
          this._latitude.createValidator())
      ]);
    }

  });

});
