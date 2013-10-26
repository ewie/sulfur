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
    shared,
    sulfur,
    Facet,
    MediaTypeFacet,
    MediaType,
    Facets,
    QName,
    PrimitiveType,
    RestrictedType,
    EnumerationValidator
) {

  'use strict';

  var expect = shared.expect;
  var sinon = shared.sinon;
  var bind = shared.bind;

  describe('sulfur/schema/facet/mediaType', function () {

    it("should be derived from sulfur/schema/facet", function () {
      expect(Facet).to.be.prototypeOf(MediaTypeFacet);
    });

    describe('.qname', function () {

      it("should return {" + sulfur.namespaceURI + "}mediaType", function () {
        expect(MediaTypeFacet.qname)
          .to.eql(QName.create('mediaType', sulfur.namespaceURI));
      });

    });

    describe('.isShadowingLowerRestrictions()', function () {

      it("should return true", function () {
        expect(MediaTypeFacet.isShadowingLowerRestrictions()).to.be.true;
      });

    });

    describe('.mutualExclusiveFacets', function () {

      it("should return an empty array", function () {
        expect(MediaTypeFacet.mutualExclusiveFacets).to.eql([]);
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
        var spy = sandbox.spy(Facet.prototype, 'initialize');
        var value = [ MediaType.create() ];
        var facet = MediaTypeFacet.create(value);
        expect(spy).to.be.calledOn(facet).to.be.calledWith(value);
      });

      it("should ignore duplicate media types", function () {
        var value = [
          MediaType.create('text', 'plain'),
          MediaType.create('text', 'plain')
        ];
        var facet = MediaTypeFacet.create(value);
        expect(facet.value).to.eql(value.slice(0, 1));
      });

      it("should reject an empty array", function () {
        expect(bind(MediaTypeFacet, 'create', []))
          .to.throw("expecting at least one sulfur/schema/mediaType value");
      });

      it("should reject any value not of type sulfur/schema/mediaType", function () {
        var value = [ {} ];
        expect(bind(MediaTypeFacet, 'create', value))
          .to.throw("expecting only sulfur/schema/mediaType values");
      });

    });

    describe('#isRestrictionOf()', function () {

      it("should return true when the type does not define facet 'mediaType'", function () {
        var type = PrimitiveType.create({});
        var facet = MediaTypeFacet.create([ MediaType.create() ]);
        expect(facet.isRestrictionOf(type)).to.be.true;
      });

      context("when the type has effective facet 'mediaType'", function () {

        var type;

        beforeEach(function () {
          var base = PrimitiveType.create({
            facets: Facets.create([ MediaTypeFacet ])
          });
          type = RestrictedType.create(base,
            Facets.create([
              MediaTypeFacet.create([ MediaType.create('text') ])
            ])
          );
        });

        it("should return true when all media types are matched by any media type of the type's facet", function () {
          var facet = MediaTypeFacet.create([ MediaType.create('text', 'plain') ]);
          expect(facet.isRestrictionOf(type)).to.be.true;
        });

        it("should return false when any media type is not matched by any media type of the type's facet", function () {
          var facet = MediaTypeFacet.create([ MediaType.create('audio') ]);
          expect(facet.isRestrictionOf(type)).to.be.false;
        });

      });

    });

    describe('#validate()', function () {

      it("should return true", function () {
        var facet = MediaTypeFacet.create([ MediaType.create() ]);
        expect(facet.validate()).to.be.true;
      });

    });

    describe('#createValidator()', function () {

      it("should return a validator/enumeration using test method 'matches'", function () {
        var value = [ MediaType.create() ];
        var type = MediaTypeFacet.create(value);
        var v = type.createValidator();
        var x = EnumerationValidator.create(value, { testMethod: 'matches' });
        expect(v).to.eql(x);
      });

    });

  });

});
