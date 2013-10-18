/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global afterEach, beforeEach, context, describe, it */

define([
  'shared',
  'sulfur/schema/facet',
  'sulfur/schema/facet/whiteSpace',
  'sulfur/schema/facets',
  'sulfur/schema/qname',
  'sulfur/schema/type/simple/primitive',
  'sulfur/schema/type/simple/restricted'
], function (
    shared,
    Facet,
    WhiteSpaceFacet,
    Facets,
    QName,
    PrimitiveType,
    RestrictedType
) {

  'use strict';

  var expect = shared.expect;
  var sinon = shared.sinon;
  var bind = shared.bind;

  describe('sulfur/schema/facet/whiteSpace', function () {

    it("should be derived from sulfur/schema/facet", function () {
      expect(Facet).to.be.prototypeOf(WhiteSpaceFacet);
    });

    describe('.getQName()', function () {

      it("should return {http://www.w3.org/2001/XMLSchema}whiteSpace", function () {
        expect(WhiteSpaceFacet.getQName()).to.eql(
          QName.create('whiteSpace', 'http://www.w3.org/2001/XMLSchema'));
      });

    });

    describe('.isShadowingLowerRestrictions()', function () {

      it("should return true", function () {
        expect(WhiteSpaceFacet.isShadowingLowerRestrictions()).to.be.true;
      });

    });

    describe('.getMutualExclusiveFacets()', function () {

      it("should return an empty array", function () {
        expect(WhiteSpaceFacet.getMutualExclusiveFacets()).to.eql([]);
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

      it("should reject a value other than 'collapse', 'preserve' or 'replace'", function () {
        expect(bind(WhiteSpaceFacet, 'create', ''))
          .to.throw('expecting either "collapse", "preserve" or "replace"');
      });

      it("should call sulfur/schema/facet#initialize()", function () {
        var spy = sandbox.spy(Facet.prototype, 'initialize');
        var facet = WhiteSpaceFacet.create('collapse');
        expect(spy)
          .to.be.calledOn(sinon.match.same(facet))
          .to.be.calledWith('collapse');
      });

    });

    describe('#isRestrictionOf()', function () {

      it("should return true when the type does not define facet 'whiteSpace'", function () {
        var type = PrimitiveType.create({});
        var facet = WhiteSpaceFacet.create('collapse');
        expect(facet.isRestrictionOf(type)).to.be.true;
      });

      context("when the type has effective facet 'whiteSpace'", function () {

        var base;

        beforeEach(function () {
          base = PrimitiveType.create({
            facets: Facets.create([ WhiteSpaceFacet ])
          });
        });

        it("should return true when the type's facet value is 'preserve'", function () {
          var type = RestrictedType.create(base,
            Facets.create([ WhiteSpaceFacet.create('preserve') ]));
          var facet = WhiteSpaceFacet.create('preserve');
          expect(facet.isRestrictionOf(type)).to.be.true;
        });

        context("when the type's facet value is 'collapse'", function () {

          var type;

          beforeEach(function () {
            type = RestrictedType.create(base,
              Facets.create([ WhiteSpaceFacet.create('collapse') ]));
          });

          [
            [ 'preserve', false ],
            [ 'replace', false ],
            [ 'collapse', true ]
          ].forEach(function (pair) {

            var value = pair[0];
            var result = pair[1];

            it("should return " + result + " when the value is '" + value + "'", function () {
              var facet = WhiteSpaceFacet.create(value);
              expect(facet.isRestrictionOf(type)).to.be[result];
            });

          });

        });

        context("when the type's facet value is 'replace'", function () {

          var type;

          beforeEach(function () {
            type = RestrictedType.create(base,
              Facets.create([ WhiteSpaceFacet.create('replace') ]));
          });

          [
            [ 'preserve', false ],
            [ 'replace', true ],
            [ 'collapse', true ]
          ].forEach(function (pair) {

            var value = pair[0];
            var result = pair[1];

            it("should return " + result + " when the value is '" + value + "'", function () {
              var facet = WhiteSpaceFacet.create(value);
              expect(facet.isRestrictionOf(type)).to.be[result];
            });

          });

        });

      });

    });

    describe('#validate()', function () {

      it("should return true", function () {
        var facet = WhiteSpaceFacet.create('collapse');
        expect(facet.validate()).to.be.true;
      });

    });

    describe('#createValidator()', function () {

      it("should reject", function () {
        var facet = WhiteSpaceFacet.create('replace');
        expect(bind(facet, 'createValidator'))
          .to.throw("validator creation is not allowed");
      });

    });

  });

});
