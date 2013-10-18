/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global beforeEach, context, describe, it */

define([
  'shared',
  'sulfur/schema/facet',
  'sulfur/schema/facets',
  'sulfur/schema/qname',
  'sulfur/schema/type/simple/primitive',
  'sulfur/schema/type/simple/restricted',
  'sulfur/schema/validator/all'
], function (
    $shared,
    $facet,
    $facets,
    $qname,
    $primitiveType,
    $restrictedType,
    $allValidator
) {

  'use strict';

  var expect = $shared.expect;
  var sinon = $shared.sinon;
  var bind = $shared.bind;
  var returns = $shared.returns;

  describe('sulfur/schema/facet', function () {

    function mockFacet(qname, options) {
      options || (options = {});
      var shadowing = typeof options.shadowing === 'undefined' ? true : options.shadowing;
      var facet = $facet.clone({
        getQName: returns(qname),
        getMutualExclusiveFacets: returns(options.mutex || []),
        isShadowingLowerRestrictions: returns(shadowing)
      });
      facet.augment({
        isRestrictionOf: returns(true),
        createValidator: returns({})
      });
      return facet;
    }

    var $derivedFacet;
    var $mutexFacet;
    var facet;

    beforeEach(function () {
      $mutexFacet = mockFacet($qname.create('xxx', 'urn:void'));
      $derivedFacet = mockFacet($qname.create('foo', 'urn:void'),
        { mutex: [ $mutexFacet ] });
      facet = $derivedFacet.create();
    });

    describe('.getEffectiveFacets()', function () {

      it("should return undefined when no facet of this factory is defined in any restriction step", function () {
        var dummyFacet = mockFacet($qname.create('x', 'urn:y'));
        var base = $primitiveType.create({
          facets: $facets.create([ dummyFacet ])
        });
        var restriction = $restrictedType.create(base,
          $facets.create([ dummyFacet.create() ]));
        expect($derivedFacet.getEffectiveFacets(restriction)).to.be.undefined;
      });

      it("should return undefined when a mutual exclusive facet is defined in a higher restriction step", function () {
        var base = $primitiveType.create({
          facets: $facets.create([ $mutexFacet ])
        });
        var restriction = $restrictedType.create(base,
          $facets.create([ $mutexFacet.create() ]));
        expect($derivedFacet.getEffectiveFacets(restriction)).to.be.undefined;
      });

      context("when no mutual exclusive facet is defined in a higher restriction step", function () {

        it("should return an array containing only the most restrictive facet when shadowing", function () {
          var base = $primitiveType.create({
            facets: $facets.create([ $derivedFacet ])
          });
          var restriction = $restrictedType.create(base,
            $facets.create([ facet ]));
          expect($derivedFacet.getEffectiveFacets(restriction)).to.eql([ facet ]);
        });

        it("should return the facets of all restriction steps when not shadowing", function () {
          var nonShadowingFacet = mockFacet($qname.create('x', 'urn:y'), { shadowing: false });
          var primitive = $primitiveType.create({
            facets: $facets.create([ nonShadowingFacet ])
          });
          var baseFacet = nonShadowingFacet.create();
          var base = $restrictedType.create(primitive,
            $facets.create([ baseFacet ]));
          var facet = nonShadowingFacet.create();
          var restriction = $restrictedType.create(base,
            $facets.create([ facet ]));
          expect(nonShadowingFacet.getEffectiveFacets(restriction))
            .to.eql([ facet, baseFacet ]);
        });

      });

    });

    describe('.getEffectiveFacet()', function () {

      it("should reject when the facet does not shadow lower restrictions", function () {
        var facet = mockFacet({}, { shadowing: false });
        var restriction = {};
        expect(bind(facet, 'getEffectiveFacet', restriction))
          .to.throw("a non-shadowing facet could have multiple effective instances");
      });

      context("when .getEffectiveFacet() returns an array", function () {

        it("should return undefined when .getEffectiveFacet() returns undefined", function () {
          var facet = mockFacet();
          var spy = sinon.stub(facet, 'getEffectiveFacets').returns(undefined);
          var restriction = {};
          expect(facet.getEffectiveFacet(restriction)).to.be.undefined;
          expect(spy).to.be.calledWith(sinon.match.same(restriction));
        });

        it("should return the first instance when the facet is shadowing lower restrictions", function () {
          var first = {};
          var facet = mockFacet();
          sinon.stub(facet, 'getEffectiveFacets').returns([ first ]);
          var restriction = {};
          expect(facet.getEffectiveFacet(restriction)).to.equal(first);
        });

      });

    });

    describe('.createConjunctionValidator()', function () {

      it("should return the validator of the first instance when the facet is shadowing lower restrictions", function () {
        var facet = mockFacet();
        var instance = facet.create();
        var spy = sinon.spy(instance, 'createValidator');
        var v = facet.createConjunctionValidator([ instance ]);
        expect(spy).to.have.returned(sinon.match.same(v));
      });

      context("when the facet does not shadow lower restrictions", function () {

        var facet;

        beforeEach(function () {
          facet = mockFacet(undefined, { shadowing: false });
        });

        it("should return the validator of the first instance when only one instance is given", function () {
          var instance = facet.create();
          var spy = sinon.spy(instance, 'createValidator');
          var v = facet.createConjunctionValidator([ instance ]);
          expect(spy).to.have.returned(sinon.match.same(v));
        });

        it("should return a sulfur/schema/validator/all including each instance's validator when more than one instances ae given", function () {
          var instances = [ facet.create(), facet.create() ];
          var spies = instances.map(function (instance) {
            return sinon.spy(instance, 'createValidator');
          });
          var v = facet.createConjunctionValidator(instances);
          expect($allValidator.prototype).to.be.prototypeOf(v);
          spies.forEach(function (spy, i) {
            expect(spy).to.have.returned(sinon.match.same(v.getValidators()[i]));
          });
        });

      });

    });

    describe('#initialize()', function () {

      it("should initialize with a value", function () {
        var value = {};
        var facet = $facet.create(value);
        expect(facet.getValue()).to.equal(value);
      });

    });

    describe('#getQName()', function () {

      it("should return the value of .getQName()", function () {
        var spy = sinon.spy($derivedFacet, 'getQName');
        expect(spy).to.have.returned(facet.getQName());
      });

    });

    describe('#isShadowingLowerRestrictions()', function () {

      it("should return the value of .isShadowingLowerRestrictions()", function () {
        var spy = sinon.spy($derivedFacet, 'isShadowingLowerRestrictions');
        expect(spy).to.have.returned(facet.isShadowingLowerRestrictions());
      });

    });

    describe('#getValue()', function () {

      it("should return the facet value", function () {
        var value = {};
        var facet = $facet.create(value);
        expect(facet.getValue()).to.equal(value);
      });

    });

  });

});
