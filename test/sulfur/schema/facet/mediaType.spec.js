/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global afterEach, beforeEach, describe, it */

define([
  'shared',
  'sulfur/schema/facet/_any',
  'sulfur/schema/facet/mediaType',
  'sulfur/schema/mediaType',
  'sulfur/schema/validator/enumeration'
], function (
    $shared,
    $_anyFacet,
    $mediaTypeFacet,
    $mediaType,
    $enumerationValidator
) {

  'use strict';

  var expect = $shared.expect;
  var bind = $shared.bind;
  var sinon = $shared.sinon;

  describe('sulfur/schema/facet/mediaType', function () {

    it("should be derived from sulfur/schema/facet/_any", function () {
      expect($_anyFacet).to.be.prototypeOf($mediaTypeFacet);
    });

    describe('.getName()', function () {

      it("should return 'mediaType'", function () {
        expect($mediaTypeFacet.getName()).to.equal('mediaType');
      });

    });

    describe('.getNamespace()', function () {

      it("should return 'https://vsr.informatik.tu-chemnitz.de/projects/2013/sulfur'", function () {
        expect($mediaTypeFacet.getNamespace()).to.equal('https://vsr.informatik.tu-chemnitz.de/projects/2013/sulfur');
      });

    });

    describe('#initialize()', function () {

      var sandbox;

      beforeEach(function () {
        sandbox = sinon.sandbox.create();
      });

      afterEach(function () {
        sandbox.restore();
      });

      it("should call sulfur/schema/facet/_any#initialize() with the value", function () {
        var spy = sandbox.spy($_anyFacet.prototype, 'initialize');
        var value = [ $mediaType.create() ];
        var facet = $mediaTypeFacet.create(value);
        expect(spy).to.be.calledOn(facet).to.be.calledWith(value);
      });

      it("should ignore duplicate media types", function () {
        var value = [
          $mediaType.create('text', 'plain'),
          $mediaType.create('text', 'plain')
        ];
        var facet = $mediaTypeFacet.create(value);
        expect(facet.getValue()).to.eql(value.slice(0, 1));
      });

      it("should reject an empty array", function () {
        expect(bind($mediaTypeFacet, 'create', []))
          .to.throw("expecting at least one sulfur/schema/mediaType value");
      });

      it("should reject any value not of type sulfur/schema/mediaType", function () {
        var value = [ {} ];
        expect(bind($mediaTypeFacet, 'create', value))
          .to.throw("expecting only sulfur/schema/mediaType values");
      });

    });

    describe('#validate()', function () {

      it("should return true", function () {
        var facet = $mediaTypeFacet.create([ $mediaType.create() ]);
        expect(facet.validate()).to.be.true;
      });

    });

    describe('#createValidator()', function () {

      it("should return a validator/enumeration using test method 'matches'", function () {
        var value = [ $mediaType.create() ];
        var type = $mediaTypeFacet.create(value);
        var v = type.createValidator();
        var x = $enumerationValidator.create(value, { testMethod: 'matches' });
        expect(v).to.eql(x);
      });

    });

  });

});
