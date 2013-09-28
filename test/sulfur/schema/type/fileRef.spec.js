/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global afterEach, beforeEach, describe, it */

define([
  'shared',
  'sulfur/schema/facet/mediaType',
  'sulfur/schema/mediaType',
  'sulfur/schema/type/_simple',
  'sulfur/schema/type/fileRef',
  'sulfur/schema/validator/all',
  'sulfur/schema/validator/presence',
  'sulfur/schema/validator/property',
  'sulfur/schema/validator/prototype',
  'sulfur/schema/value/fileRef'
], function (
    $shared,
    $mediaTypeFacet,
    $mediaType,
    $_simpleType,
    $fileRefType,
    $allValidator,
    $presenceValidator,
    $propertyValidator,
    $prototypeValidator,
    $fileRefValue
) {

  'use strict';

  var expect = $shared.expect;
  var sinon = $shared.sinon;

  describe('sulfur/schema/type/fileRef', function () {

    it("should be derived from sulfur/schema/type/_simple", function () {
      expect($_simpleType).to.be.prototypeOf($fileRefType);
    });

    describe('.getLegalFacets()', function () {

      it("should include sulfur/schema/facet/mediaType", function () {
        expect($fileRefType.getLegalFacets()).to.include($mediaTypeFacet);
      });

    });

    describe('.getValueType()', function () {

      it("should be sulfur/schema/value/fileRef", function () {
        expect($fileRefType.getValueType()).to.equal($fileRefValue);
      });

    });

    describe('#createValidator()', function () {

      var sandbox;

      beforeEach(function () {
        sandbox = sinon.sandbox.create();
      });

      afterEach(function () {
        sandbox.restore();
      });

      it("should return sulfur/schema/type/_simple#createValidator() when facet 'mediaType' is not defined", function () {
        var spy = sandbox.spy($_simpleType.prototype, 'createValidator');
        var type = $fileRefType.create();
        var v = type.createValidator();
        expect(spy).to.have.returned(sinon.match.same(v));
      });

      it("should use a validator/all using a validator/prototype matching sulfur/schema/valud/fileRef, and a validator/presence on 'getFile' with a validator/property on 'getMediaType' wrapping the validator of facet 'mediaType' when defined", function () {
        var facets = [ $mediaTypeFacet.create([ $mediaType.create() ]) ];
        var type = $fileRefType.create(facets);
        var v = type.createValidator();
        expect(v).to.eql(
          $allValidator.create([
            $prototypeValidator.create(type.getValueType().prototype),
            $presenceValidator.create(
              'getFile',
              $propertyValidator.create(
                'getMediaType',
                facets[0].createValidator()
              )
            )
          ])
        );
      });

    });

  });

});
