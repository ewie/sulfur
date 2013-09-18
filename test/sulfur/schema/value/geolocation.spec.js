/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global describe, it */

define([
  'shared',
  'sulfur/schema/value/double',
  'sulfur/schema/value/geolocation'
], function ($shared, $doubleValue, $geolocationValue) {

  'use strict';

  var expect = $shared.expect;
  var bind = $shared.bind;

  describe('sulfur/schema/geolocation', function () {

    describe('#initialize()', function () {

      it("should accept two sulfur/schema/double values", function () {
        var l = $geolocationValue.create($doubleValue.create(), $doubleValue.create());
        expect(l.getLongitude()).to.eql($doubleValue.create());
        expect(l.getLatitude()).to.eql($doubleValue.create());
      });

      it("should reject a longitude with type other than sulfur/schema/double", function () {
        expect(bind($geolocationValue, 'create', 0, $doubleValue.create()))
          .to.throw("longitude must be a sulfur/schema/double");
      });

      it("should reject a latitude with type other than sulfur/schema/double", function () {
        expect(bind($geolocationValue, 'create', $doubleValue.create(), 0))
          .to.throw("latitude must be a sulfur/schema/double");
      });

      it("should reject a longitude with NaN", function () {
        expect(bind($geolocationValue, 'create', $doubleValue.create(Number.NaN), $doubleValue.create()))
          .to.throw("longitude must not be NaN");
      });

      it("should reject a latitude with NaN", function () {
        expect(bind($geolocationValue, 'create', $doubleValue.create(), $doubleValue.create(Number.NaN)))
          .to.throw("latitude must not be NaN");
      });

      it("should reject a longitude less than -180", function () {
        expect(bind($geolocationValue, 'create', $doubleValue.create(-181)))
          .to.throw("longitude must not be less than -180");
      });

      it("should reject a longitude greater than 180", function () {
        expect(bind($geolocationValue, 'create', $doubleValue.create(181)))
          .to.throw("longitude must not be greater than 180");
      });

      it("should reject a latitude less than -90", function () {
        expect(bind($geolocationValue, 'create', $doubleValue.create(), $doubleValue.create(-91)))
          .to.throw("latitude must not be less than -90");
      });

      it("should reject a latitude greater than 90", function () {
        expect(bind($geolocationValue, 'create', $doubleValue.create(), $doubleValue.create(91)))
          .to.throw("latitude must not be greater than 90");
      });

    });

    describe('#getLongitude()', function () {

      it("should return the longitude", function () {
        var l = $geolocationValue.create($doubleValue.create(13), $doubleValue.create());
        expect(l.getLongitude()).to.eql($doubleValue.create(13));
      });

    });

    describe('#getLatitude()', function () {

      it("should return the latitude", function () {
        var l = $geolocationValue.create($doubleValue.create(), $doubleValue.create(37));
        expect(l.getLatitude()).to.eql($doubleValue.create(37));
      });

    });

  });

});
