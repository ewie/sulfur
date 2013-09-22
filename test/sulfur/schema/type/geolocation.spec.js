/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global context, describe, it */

define([
  'shared',
  'sulfur/schema/facet/maxExclusive',
  'sulfur/schema/facet/maxInclusive',
  'sulfur/schema/facet/minExclusive',
  'sulfur/schema/facet/minInclusive',
  'sulfur/schema/type/double',
  'sulfur/schema/type/geolocation',
  'sulfur/schema/validator/all',
  'sulfur/schema/validator/property',
  'sulfur/schema/validator/prototype',
  'sulfur/schema/value/double',
  'sulfur/schema/value/geolocation'
], function (
    $shared,
    $maxExclusiveFacet,
    $maxInclusiveFacet,
    $minExclusiveFacet,
    $minInclusiveFacet,
    $doubleType,
    $geolocationType,
    $allValidator,
    $propertyValidator,
    $prototypeValidator,
    $doubleValue,
    $geolocationValue
) {

  'use strict';

  var expect = $shared.expect;
  var bind = $shared.bind;

  describe('sulfur/schema/type/geolocation', function () {

    describe('#initialize()', function () {

      it("should use a default longitude type", function () {
        var type = $geolocationType.create();
        expect(type.getLongitudeType()).to.eql(
          $doubleType.create([
            $minInclusiveFacet.create($doubleValue.create(-180)),
            $maxInclusiveFacet.create($doubleValue.create(180))
          ]));
      });

      it("should use a default latitude type", function () {
        var type = $geolocationType.create();
        expect(type.getLatitudeType()).to.eql(
          $doubleType.create([
            $minInclusiveFacet.create($doubleValue.create(-90)),
            $maxInclusiveFacet.create($doubleValue.create(90))
          ]));
      });

      context("with a custom longitude type", function () {

        it("should accept a sulfur/schema/type/double", function () {
          var lngType = $doubleType.create();
          var type = $geolocationType.create({ longitude: lngType });
          expect(type.getLongitudeType()).to.equal(lngType);
        });

        it("should reject a type other than sulfur/schema/type/double", function () {
          expect(bind($geolocationType, 'create', { longitude: '' }))
            .to.throw("longitude type must be a sulfur/schema/type/double");
        });

        it("should reject facet `minExclusive` with a value less than -180", function () {
          var lngType = $doubleType.create([
            $minExclusiveFacet.create($doubleValue.create(-181))
          ]);
          expect(bind($geolocationType, 'create', { longitude: lngType }))
            .to.throw("longitude type must not allow values outside [-180, 180]");
        });

        it("should reject facet `minInclusive` with a value is less than -180", function () {
          var lngType = $doubleType.create([
            $minInclusiveFacet.create($doubleValue.create(-181))
          ]);
          expect(bind($geolocationType, 'create', { longitude: lngType }))
            .to.throw("longitude type must not allow values outside [-180, 180]");
        });

        it("should reject facet `maxExclusive` with a value greater than 180", function () {
          var lngType = $doubleType.create([
            $maxExclusiveFacet.create($doubleValue.create(181))
          ]);
          expect(bind($geolocationType, 'create', { longitude: lngType }))
            .to.throw("longitude type must not allow values outside [-180, 180]");
        });

        it("should reject facet `maxInclusive` with a value is less than 180", function () {
          var lngType = $doubleType.create([
            $maxInclusiveFacet.create($doubleValue.create(181))
          ]);
          expect(bind($geolocationType, 'create', { longitude: lngType }))
            .to.throw("longitude type must not allow values outside [-180, 180]");
        });

      });

      context("with a custom latitude type", function () {

        it("should accept a sulfur/schema/type/double", function () {
          var latType = $doubleType.create();
          var type = $geolocationType.create({ latitude: latType });
          expect(type.getLatitudeType()).to.equal(latType);
        });

        it("should reject a type other than sulfur/schema/type/double", function () {
          expect(bind($geolocationType, 'create', { latitude: '' }))
            .to.throw("latitude type must be a sulfur/schema/type/double");
        });

        it("should reject facet `minExclusive` with a value less than -90", function () {
          var latType = $doubleType.create([
            $minExclusiveFacet.create($doubleValue.create(-91))
          ]);
          expect(bind($geolocationType, 'create', { latitude: latType }))
            .to.throw("latitude type must not allow values outside [-90, 90]");
        });

        it("should reject facet `minInclusive` with a value is less than -90", function () {
          var latType = $doubleType.create([
            $minInclusiveFacet.create($doubleValue.create(-91))
          ]);
          expect(bind($geolocationType, 'create', { latitude: latType }))
            .to.throw("latitude type must not allow values outside [-90, 90]");
        });

        it("should reject facet `maxExclusive` with a value greater than 90", function () {
          var latType = $doubleType.create([
            $maxExclusiveFacet.create($doubleValue.create(91))
          ]);
          expect(bind($geolocationType, 'create', { latitude: latType }))
            .to.throw("latitude type must not allow values outside [-90, 90]");
        });

        it("should reject facet `maxInclusive` with a value is less than 90", function () {
          var latType = $doubleType.create([
            $maxInclusiveFacet.create($doubleValue.create(91))
          ]);
          expect(bind($geolocationType, 'create', { latitude: latType }))
            .to.throw("latitude type must not allow values outside [-90, 90]");
        });

      });

    });

    describe('#getLongitudeType()', function () {

      it("should return the longitude type", function () {
        var type = $geolocationType.create();
        expect(type.getLongitudeType()).to.eql(
          $doubleType.create([
            $minInclusiveFacet.create($doubleValue.create(-180)),
            $maxInclusiveFacet.create($doubleValue.create(180))
          ]));
      });

    });

    describe('#getLatitudeType()', function () {

      it("should return the latitude type", function () {
        var type = $geolocationType.create();
        expect(type.getLatitudeType()).to.eql(
          $doubleType.create([
            $minInclusiveFacet.create($doubleValue.create(-90)),
            $maxInclusiveFacet.create($doubleValue.create(90))
          ]));
      });

    });

    describe('#createValidator()', function () {

      it("should return the validator", function () {
        var type = $geolocationType.create();
        var v = type.createValidator();
        expect(v).to.eql($allValidator.create([
          $prototypeValidator.create($geolocationValue.prototype),
          $propertyValidator.create('getLongitude',
            type.getLongitudeType().createValidator()),
          $propertyValidator.create('getLatitude',
            type.getLatitudeType().createValidator())
        ]));
      });

    });

  });

});
