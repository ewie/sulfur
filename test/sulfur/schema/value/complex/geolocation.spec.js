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
], function (shared, ComplexValue, GeolocationValue, DoubleValue) {

  'use strict';

  var expect = shared.expect;
  var sinon = shared.sinon;
  var bind = shared.bind;

  describe('sulfur/schema/value/complex/geolocation', function () {

    it("should be derived from sulfur/schema/value/complex", function () {
      expect(ComplexValue).to.be.prototypeOf(GeolocationValue);
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
        var spy = sandbox.spy(ComplexValue.prototype, 'initialize');
        var values = [
          [ 'longitude', DoubleValue.create() ],
          [ 'latitude', DoubleValue.create() ]
        ];
        var value = GeolocationValue.create(values);
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
        expect(bind(GeolocationValue, 'create', values))
          .to.throw("expecting only longitude and latitude");
      });

      it("should reject a missing longitude value", function () {
        expect(bind(GeolocationValue, 'create', [ [ 'latitude', {} ] ]))
          .to.throw("expecting a longitude value");
      });

      it("should reject a missing latitude value", function () {
        expect(bind(GeolocationValue, 'create', [ [ 'longitude', {} ] ]))
          .to.throw("expecting a latitude value");
      });

      it("should reject a longitude with type other than sulfur/schema/double", function () {
        var values = [
          [ 'longitude', {} ],
          [ 'latitude', DoubleValue.create() ]
        ];
        expect(bind(GeolocationValue, 'create', values))
          .to.throw("longitude must be a sulfur/schema/double");
      });

      it("should reject a latitude with type other than sulfur/schema/double", function () {
        var values = [
          [ 'longitude', DoubleValue.create() ],
          [ 'latitude', {} ]
        ];
        expect(bind(GeolocationValue, 'create', values))
          .to.throw("latitude must be a sulfur/schema/double");
      });

      it("should reject a longitude with NaN", function () {
        var values = [
          [ 'longitude', DoubleValue.create(Number.NaN) ],
          [ 'latitude', DoubleValue.create() ]
        ];
        expect(bind(GeolocationValue, 'create', values))
          .to.throw("longitude must not be NaN");
      });

      it("should reject a latitude with NaN", function () {
        var values = [
          [ 'longitude', DoubleValue.create() ],
          [ 'latitude', DoubleValue.create(Number.NaN) ]
        ];
        expect(bind(GeolocationValue, 'create', values))
          .to.throw("latitude must not be NaN");
      });

      it("should reject a longitude less than -180", function () {
        var values = [
          [ 'longitude', DoubleValue.create(-181) ],
          [ 'latitude', DoubleValue.create() ]
        ];
        expect(bind(GeolocationValue, 'create', values))
          .to.throw("longitude must not be less than -180");
      });

      it("should reject a longitude greater than 180", function () {
        var values = [
          [ 'longitude', DoubleValue.create(181) ],
          [ 'latitude', DoubleValue.create() ]
        ];
        expect(bind(GeolocationValue, 'create', values))
          .to.throw("longitude must not be greater than 180");
      });

      it("should reject a latitude less than -90", function () {
        var values = [
          [ 'longitude', DoubleValue.create() ],
          [ 'latitude', DoubleValue.create(-91) ]
        ];
        expect(bind(GeolocationValue, 'create', values))
          .to.throw("latitude must not be less than -90");
      });

      it("should reject a latitude greater than 90", function () {
        var values = [
          [ 'longitude', DoubleValue.create() ],
          [ 'latitude', DoubleValue.create(91) ]
        ];
        expect(bind(GeolocationValue, 'create', values))
          .to.throw("latitude must not be greater than 90");
      });

    });

  });

});
