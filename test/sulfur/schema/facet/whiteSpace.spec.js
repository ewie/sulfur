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
    $shared,
    $facet,
    $whiteSpaceFacet,
    $facets,
    $qname,
    $primitiveType,
    $restrictedType
) {

  'use strict';

  var expect = $shared.expect;
  var sinon = $shared.sinon;
  var bind = $shared.bind;

  describe('sulfur/schema/facet/whiteSpace', function () {

    it("should be derived from sulfur/schema/facet", function () {
      expect($facet).to.be.prototypeOf($whiteSpaceFacet);
    });

    describe('.getQName()', function () {

      it("should return {http://www.w3.org/2001/XMLSchema}whiteSpace", function () {
        expect($whiteSpaceFacet.getQName()).to.eql(
          $qname.create('whiteSpace', 'http://www.w3.org/2001/XMLSchema'));
      });

    });

    describe('.isShadowingLowerRestrictions()', function () {

      it("should return true", function () {
        expect($whiteSpaceFacet.isShadowingLowerRestrictions()).to.be.true;
      });

    });

    describe('.getMutualExclusiveFacets()', function () {

      it("should return an empty array", function () {
        expect($whiteSpaceFacet.getMutualExclusiveFacets()).to.eql([]);
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
        expect(bind($whiteSpaceFacet, 'create', ''))
          .to.throw('expecting either "collapse", "preserve" or "replace"');
      });

      it("should call sulfur/schema/facet#initialize()", function () {
        var spy = sandbox.spy($facet.prototype, 'initialize');
        var facet = $whiteSpaceFacet.create('collapse');
        expect(spy)
          .to.be.calledOn(sinon.match.same(facet))
          .to.be.calledWith('collapse');
      });

    });

    describe('#isRestrictionOf()', function () {

      it("should return true when the type does not define facet 'whiteSpace'", function () {
        var type = $primitiveType.create({});
        var facet = $whiteSpaceFacet.create('collapse');
        expect(facet.isRestrictionOf(type)).to.be.true;
      });

      context("when the type has effective facet 'whiteSpace'", function () {

        var base;

        beforeEach(function () {
          base = $primitiveType.create({
            facets: $facets.create([ $whiteSpaceFacet ])
          });
        });

        it("should return true when the type's facet value is 'preserve'", function () {
          var type = $restrictedType.create(base,
            $facets.create([ $whiteSpaceFacet.create('preserve') ]));
          var facet = $whiteSpaceFacet.create('preserve');
          expect(facet.isRestrictionOf(type)).to.be.true;
        });

        context("when the type's facet value is 'collapse'", function () {

          var type;

          beforeEach(function () {
            type = $restrictedType.create(base,
              $facets.create([ $whiteSpaceFacet.create('collapse') ]));
          });

          [
            [ 'preserve', false ],
            [ 'replace', false ],
            [ 'collapse', true ]
          ].forEach(function (pair) {

            var value = pair[0];
            var result = pair[1];

            it("should return " + result + " when the value is '" + value + "'", function () {
              var facet = $whiteSpaceFacet.create(value);
              expect(facet.isRestrictionOf(type)).to.be[result];
            });

          });

        });

        context("when the type's facet value is 'replace'", function () {

          var type;

          beforeEach(function () {
            type = $restrictedType.create(base,
              $facets.create([ $whiteSpaceFacet.create('replace') ]));
          });

          [
            [ 'preserve', false ],
            [ 'replace', true ],
            [ 'collapse', true ]
          ].forEach(function (pair) {

            var value = pair[0];
            var result = pair[1];

            it("should return " + result + " when the value is '" + value + "'", function () {
              var facet = $whiteSpaceFacet.create(value);
              expect(facet.isRestrictionOf(type)).to.be[result];
            });

          });

        });

      });

    });

    describe('#validate()', function () {

      it("should return true", function () {
        var facet = $whiteSpaceFacet.create('collapse');
        expect(facet.validate()).to.be.true;
      });

    });

    describe('#createValidator()', function () {

      it("should reject", function () {
        var facet = $whiteSpaceFacet.create('replace');
        expect(bind(facet, 'createValidator'))
          .to.throw("validator creation is not allowed");
      });

    });

  });

});
