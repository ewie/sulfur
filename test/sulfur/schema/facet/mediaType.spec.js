/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global afterEach, beforeEach, context, describe, it */

define([
  'shared',
  'sulfur',
  'sulfur/schema/facet',
  'sulfur/schema/facet/mediaType',
  'sulfur/schema/mediaType',
  'sulfur/schema/facets',
  'sulfur/schema/qname',
  'sulfur/schema/type/simple/primitive',
  'sulfur/schema/type/simple/restricted',
  'sulfur/schema/validator/enumeration'
], function (
    $shared,
    $sulfur,
    $facet,
    $mediaTypeFacet,
    $mediaType,
    $facets,
    $qname,
    $primitiveType,
    $restrictedType,
    $enumerationValidator
) {

  'use strict';

  var expect = $shared.expect;
  var sinon = $shared.sinon;
  var bind = $shared.bind;

  describe('sulfur/schema/facet/mediaType', function () {

    it("should be derived from sulfur/schema/facet", function () {
      expect($facet).to.be.prototypeOf($mediaTypeFacet);
    });

    describe('.getQName()', function () {

      it("should return {" + $sulfur.getNamespaceURI() + "}mediaType", function () {
        expect($mediaTypeFacet.getQName())
          .to.eql($qname.create('mediaType', $sulfur.getNamespaceURI()));
      });

    });

    describe('.isShadowingLowerRestrictions()', function () {

      it("should return true", function () {
        expect($mediaTypeFacet.isShadowingLowerRestrictions()).to.be.true;
      });

    });

    describe('.getMutualExclusiveFacets()', function () {

      it("should return an empty array", function () {
        expect($mediaTypeFacet.getMutualExclusiveFacets()).to.eql([]);
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

      it("should call sulfur/schema/facet#initialize() with the value", function () {
        var spy = sandbox.spy($facet.prototype, 'initialize');
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

    describe('#isRestrictionOf()', function () {

      it("should return true when the type does not define facet 'mediaType'", function () {
        var type = $primitiveType.create({});
        var facet = $mediaTypeFacet.create([ $mediaType.create() ]);
        expect(facet.isRestrictionOf(type)).to.be.true;
      });

      context("when the type has effective facet 'mediaType'", function () {

        var type;

        beforeEach(function () {
          var base = $primitiveType.create({
            facets: $facets.create([ $mediaTypeFacet ])
          });
          type = $restrictedType.create(base,
            $facets.create([
              $mediaTypeFacet.create([ $mediaType.create('text') ])
            ])
          );
        });

        it("should return true when all media types are matched by any media type of the type's facet", function () {
          var facet = $mediaTypeFacet.create([ $mediaType.create('text', 'plain') ]);
          expect(facet.isRestrictionOf(type)).to.be.true;
        });

        it("should return false when any media type is not matched by any media type of the type's facet", function () {
          var facet = $mediaTypeFacet.create([ $mediaType.create('audio') ]);
          expect(facet.isRestrictionOf(type)).to.be.false;
        });

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
