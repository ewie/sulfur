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
    shared,
    Facet,
    Facets,
    QName,
    PrimitiveType,
    RestrictedType,
    AllValidator
) {

  'use strict';

  var expect = shared.expect;
  var sinon = shared.sinon;
  var bind = shared.bind;
  var returns = shared.returns;

  describe('sulfur/schema/facet', function () {

    function mockFacet(qname, options) {
      options || (options = {});
      var shadowing = typeof options.shadowing === 'undefined' ? true : options.shadowing;
      var facet = Facet.clone({
        qname: qname,
        mutualExclusiveFacets: options.mutex || [],
        isShadowingLowerRestrictions: returns(shadowing)
      });
      facet.augment({
        isRestrictionOf: returns(true),
        createValidator: returns({})
      });
      return facet;
    }

    var DerivedFacet;
    var MutexFacet;
    var facet;

    beforeEach(function () {
      MutexFacet = mockFacet(QName.create('xxx', 'urn:void'));
      DerivedFacet = mockFacet(QName.create('foo', 'urn:void'),
        { mutex: [ MutexFacet ] });
      facet = DerivedFacet.create();
    });

    describe('.getEffectiveFacets()', function () {

      it("should return undefined when no facet of this factory is defined in any restriction step", function () {
        var dummyFacet = mockFacet(QName.create('x', 'urn:y'));
        var base = PrimitiveType.create({
          facets: Facets.create([ dummyFacet ])
        });
        var restriction = RestrictedType.create(base,
          Facets.create([ dummyFacet.create() ]));
        expect(DerivedFacet.getEffectiveFacets(restriction)).to.be.undefined;
      });

      it("should return undefined when a mutual exclusive facet is defined in a higher restriction step", function () {
        var base = PrimitiveType.create({
          facets: Facets.create([ MutexFacet ])
        });
        var restriction = RestrictedType.create(base,
          Facets.create([ MutexFacet.create() ]));
        expect(DerivedFacet.getEffectiveFacets(restriction)).to.be.undefined;
      });

      context("when no mutual exclusive facet is defined in a higher restriction step", function () {

        it("should return an array containing only the most restrictive facet when shadowing", function () {
          var base = PrimitiveType.create({
            facets: Facets.create([ DerivedFacet ])
          });
          var restriction = RestrictedType.create(base,
            Facets.create([ facet ]));
          expect(DerivedFacet.getEffectiveFacets(restriction)).to.eql([ facet ]);
        });

        it("should return the facets of all restriction steps when not shadowing", function () {
          var nonShadowingFacet = mockFacet(QName.create('x', 'urn:y'), { shadowing: false });
          var primitive = PrimitiveType.create({
            facets: Facets.create([ nonShadowingFacet ])
          });
          var baseFacet = nonShadowingFacet.create();
          var base = RestrictedType.create(primitive,
            Facets.create([ baseFacet ]));
          var facet = nonShadowingFacet.create();
          var restriction = RestrictedType.create(base,
            Facets.create([ facet ]));
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
          expect(AllValidator.prototype).to.be.prototypeOf(v);
          spies.forEach(function (spy, i) {
            expect(spy).to.have.returned(sinon.match.same(v.validators[i]));
          });
        });

      });

    });

    describe('#initialize()', function () {

      it("should initialize with a value", function () {
        var value = {};
        var facet = Facet.create(value);
        expect(facet.value).to.equal(value);
      });

    });

    describe('#qname', function () {

      it("should return the value of .qname", function () {
        expect(facet.qname).to.equal(DerivedFacet.qname);
      });

    });

    describe('#isShadowingLowerRestrictions()', function () {

      it("should return the value of .isShadowingLowerRestrictions()", function () {
        var spy = sinon.spy(DerivedFacet, 'isShadowingLowerRestrictions');
        expect(spy).to.have.returned(facet.isShadowingLowerRestrictions());
      });

    });

    describe('#value', function () {

      it("should return the facet value", function () {
        var value = {};
        var facet = Facet.create(value);
        expect(facet.value).to.equal(value);
      });

    });

  });

});
