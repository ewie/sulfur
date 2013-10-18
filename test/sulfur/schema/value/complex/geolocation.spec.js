/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global afterEach, beforeEach, describe, it */

define([
  'shared',
  'sulfur/schema/value/complex',
  'sulfur/schema/value/complex/geolocation',
  'sulfur/schema/value/simple/double'
], function ($shared, $complexValue, $geolocationValue, $doubleValue) {

  'use strict';

  var expect = $shared.expect;
  var sinon = $shared.sinon;
  var bind = $shared.bind;

  describe('sulfur/schema/value/complex/geolocation', function () {

    it("should be derived from sulfur/schema/value/complex", function () {
      expect($complexValue).to.be.prototypeOf($geolocationValue);
    });

    describe('#initialize()', function () {

      var sandbox;

      beforeEach(function () {
        sandbox = sinon.sandbox.create();
      });

      afterEach(function () {
        sandbox.restore();
      });

      it("should call sulfur/schema/value/_complex#initialize()", function () {
        var spy = sandbox.spy($complexValue.prototype, 'initialize');
        var values = [
          [ 'longitude', $doubleValue.create() ],
          [ 'latitude', $doubleValue.create() ]
        ];
        var value = $geolocationValue.create(values);
        expect(spy)
          .to.be.calledOn(sinon.match.same(value))
          .to.be.calledWith(sinon.match.same(values));
      });

      it("should reject any values other than longitude and latitude", function () {
        var values = [
          [ 'longitude', {} ],
          [ 'latitude', {} ],
          [ 'xxx', {} ]
        ];
        expect(bind($geolocationValue, 'create', values))
          .to.throw("expecting only longitude and latitude");
      });

      it("should reject a missing longitude value", function () {
        expect(bind($geolocationValue, 'create', [ [ 'latitude', {} ] ]))
          .to.throw("expecting a longitude value");
      });

      it("should reject a missing latitude value", function () {
        expect(bind($geolocationValue, 'create', [ [ 'longitude', {} ] ]))
          .to.throw("expecting a latitude value");
      });

      it("should reject a longitude with type other than sulfur/schema/double", function () {
        var values = [
          [ 'longitude', {} ],
          [ 'latitude', $doubleValue.create() ]
        ];
        expect(bind($geolocationValue, 'create', values))
          .to.throw("longitude must be a sulfur/schema/double");
      });

      it("should reject a latitude with type other than sulfur/schema/double", function () {
        var values = [
          [ 'longitude', $doubleValue.create() ],
          [ 'latitude', {} ]
        ];
        expect(bind($geolocationValue, 'create', values))
          .to.throw("latitude must be a sulfur/schema/double");
      });

      it("should reject a longitude with NaN", function () {
        var values = [
          [ 'longitude', $doubleValue.create(Number.NaN) ],
          [ 'latitude', $doubleValue.create() ]
        ];
        expect(bind($geolocationValue, 'create', values))
          .to.throw("longitude must not be NaN");
      });

      it("should reject a latitude with NaN", function () {
        var values = [
          [ 'longitude', $doubleValue.create() ],
          [ 'latitude', $doubleValue.create(Number.NaN) ]
        ];
        expect(bind($geolocationValue, 'create', values))
          .to.throw("latitude must not be NaN");
      });

      it("should reject a longitude less than -180", function () {
        var values = [
          [ 'longitude', $doubleValue.create(-181) ],
          [ 'latitude', $doubleValue.create() ]
        ];
        expect(bind($geolocationValue, 'create', values))
          .to.throw("longitude must not be less than -180");
      });

      it("should reject a longitude greater than 180", function () {
        var values = [
          [ 'longitude', $doubleValue.create(181) ],
          [ 'latitude', $doubleValue.create() ]
        ];
        expect(bind($geolocationValue, 'create', values))
          .to.throw("longitude must not be greater than 180");
      });

      it("should reject a latitude less than -90", function () {
        var values = [
          [ 'longitude', $doubleValue.create() ],
          [ 'latitude', $doubleValue.create(-91) ]
        ];
        expect(bind($geolocationValue, 'create', values))
          .to.throw("latitude must not be less than -90");
      });

      it("should reject a latitude greater than 90", function () {
        var values = [
          [ 'longitude', $doubleValue.create() ],
          [ 'latitude', $doubleValue.create(91) ]
        ];
        expect(bind($geolocationValue, 'create', values))
          .to.throw("latitude must not be greater than 90");
      });

    });

  });

});
