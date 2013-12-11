/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global afterEach, beforeEach, describe, it */

define([
  'shared',
  'sulfur/schema/facet',
  'sulfur/schema/facet/enumeration',
  'sulfur/schema/qname',
  'sulfur/schema/validator/enumeration',
  'sulfur/schema/value/simple/integer',
  'sulfur/schema/value/simple/string'
], function (
    shared,
    Facet,
    EnumerationFacet,
    QName,
    EnumerationValidator,
    IntegerValue,
    StringValue
) {

  'use strict';

  var expect = shared.expect;
  var sinon = shared.sinon;
  var bind = shared.bind;
  var returns = shared.returns;

  describe('sulfur/schema/facet/enumeration', function () {

    it("should be derived from sulfur/schema/facet", function () {
      expect(Facet).to.be.prototypeOf(EnumerationFacet);
    });

    describe('.qname', function () {

      it("should return {http://www.w3.org/2001/XMLSchema}enumeration", function () {
        expect(EnumerationFacet.qname)
          .to.eql(QName.create('enumeration',
            'http://www.w3.org/2001/XMLSchema'));
      });

    });

    describe('.isShadowingLowerRestrictions', function () {

      it("should return true", function () {
        expect(EnumerationFacet.isShadowingLowerRestrictions).to.be.true;
      });

    });

    describe('.mutexFacets', function () {

      it("should return an empty array", function () {
        expect(EnumerationFacet.mutexFacets).to.eql([]);
      });

    });

    describe('.getValueType()', function () {

      it("should return .valueType of the given object", function () {
        var type = { valueType: {} };
        expect(EnumerationFacet.getValueType(type)).to.equal(type.valueType);
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

      it("should call sulfur/schema/facet#initialize()", function () {
        var spy = sandbox.spy(Facet.prototype, 'initialize');
        var values = [ 'foo' ];
        var facet = EnumerationFacet.create(values);
        expect(spy).to.be.calledOn(facet).to.be.calledWith(values);
      });

      it("should ignore duplicate values based on each value's string representation", function () {
        var values = [
          { toString: function () { return 'x'; } },
          { toString: function () { return 'x'; } }
        ];
        var facet = EnumerationFacet.create(values);
        expect(facet.value).to.eql(values.slice(0, 1));
      });

      it("should reject an empty array", function () {
        expect(bind(EnumerationFacet, 'create', []))
          .to.throw("must provide at least one value");
      });

    });

    describe('#isRestrictionOf()', function () {

      var facet;
      var values;
      var validator;
      var type;

      beforeEach(function () {
        validator = { validate: function () {} };
        type = { createValidator: returns(validator) };
        values = [ StringValue.create('a') ];
        facet = EnumerationFacet.create(values);
      });

      it("should check each value using the validator of the given type", function () {
        var spy = sinon.spy(validator, 'validate');
        facet.isRestrictionOf(type);
        expect(spy.callCount).to.eql(values.length);
        values.forEach(function (value, i) {
          expect(spy.getCall(i).args[0]).to.equal(value);
        });
      });

      it("should return true when all values satisfy the validator", function () {
        validator.validate = returns(true);
        expect(facet.isRestrictionOf(type)).to.be.true;
      });

      it("should return false when any value does not satisfy the validator", function () {
        validator.validate = returns(false);
        expect(facet.isRestrictionOf(type)).to.be.false;
      });

    });

    describe('#validate()', function () {

      var facet;

      beforeEach(function () {
        facet = EnumerationFacet.create([ StringValue.create('') ]);
      });

      it("should return true when all values are of the given type", function () {
        var type = { valueType: StringValue };
        expect(facet.validate(type)).to.be.true;
      });

      it("should return false when any value is not of the given type", function () {
        var type = { valueType: IntegerValue };
        expect(facet.validate(type)).to.be.false;
      });

    });

    describe('#createValidator()', function () {

      it("should return a validator/enumeration with the facets values and #eq() as test method", function () {
        var facet = EnumerationFacet.create([{ eq: function () {} }]);
        var v = facet.createValidator();
        expect(v).to.eql(
          EnumerationValidator.create(
            facet.value,
            { testMethod: 'eq' }
          )
        );
      });

    });

  });

});
