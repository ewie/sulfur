/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global describe, it */

define([
  'shared',
  'sulfur',
  'sulfur/schema/qname',
  'sulfur/schema/type/complex/primitive',
  'sulfur/schema/type/complex/primitive/geolocation',
  'sulfur/schema/value/complex/geolocation'
], function (
    shared,
    sulfur,
    QName,
    PrimitiveType,
    GeolocationType,
    GeolocationValue
) {

  'use strict';

  var expect = shared.expect;

  describe('sulfur/schema/type/complex/primitive/geolocation', function () {

    it("should be a sulfur/schema/type/complex/primitive", function () {
      expect(GeolocationType).to.eql(
        PrimitiveType.create(
          { qname: QName.create('geolocation', sulfur.namespaceURI),
            valueType: GeolocationValue,
          }));
    });

  });

});
