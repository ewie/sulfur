/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global afterEach, beforeEach, describe, it */

define([
  'shared',
  'sulfur/schema/value/simple/double'
],function (shared, DoubleValue) {

  'use strict';

  var expect = shared.expect;
  var bind = shared.bind;
  var sinon = shared.sinon;

  describe('sulfur/schema/value/simple/double', function () {

    var sandbox;

    beforeEach(function () {
      sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
      sandbox.restore();
    });

    describe('.isValidLiteral()', function () {

      it("should call .parse() with the given literal", function () {
        var spy = sandbox.spy(DoubleValue, 'parse');
        var s = '123';
        DoubleValue.isValidLiteral(s);
        expect(spy).to.be.calledWith(s);
      });

      it("should return true when .parse() does not throw", function () {
        sandbox.stub(DoubleValue, 'parse');
        expect(DoubleValue.isValidLiteral()).to.be.true;
      });

      it("should return false when .parse() does throw", function () {
        sandbox.stub(DoubleValue, 'parse').throws();
        expect(DoubleValue.isValidLiteral()).to.be.false;
      });

    });

    describe('.parse()', function () {

      it("should reject an invalid literal", function () {
        expect(bind(DoubleValue, 'parse', '123abc'))
          .to.throw('invalid literal "123abc"');
      });

      it("should ignore leading and trailing white space", function () {
        var f = DoubleValue.parse('\x09\x0A\x0D 0 \x09\x0A\x0D');
        expect(f).to.eql(DoubleValue.create());
      });

      it("should parse NaN", function () {
        var f = DoubleValue.parse('NaN');
        expect(f.isNaN()).to.be.true;
      });

      it("should parse INF", function () {
        var f = DoubleValue.parse('INF');
        expect(f.isFinite()).to.be.false;
        expect(f.isPositive()).to.be.true;
      });

      it("should parse -INF", function () {
        var f = DoubleValue.parse('-INF');
        expect(f.isFinite()).to.be.false;
        expect(f.isPositive()).to.be.false;
      });

      it("should parse an integer literal", function () {
        var f = DoubleValue.parse('123');
        expect(f.getValue()).to.equal(123);
      });

      it("should parse an optional fractional part", function () {
        var f = DoubleValue.parse('0.123');
        expect(f.getValue()).to.equal(0.123);
      });

      it("should parse optional leading zeros", function () {
        var f = DoubleValue.parse('01');
        expect(f.getValue()).to.equal(1);
      });

      it("should parse optional trailing zeros", function () {
        var f = DoubleValue.parse('0.1230');
        expect(f.getValue()).to.equal(0.123);
      });

      it("should parse a negative literal", function () {
        var f = DoubleValue.parse('-1');
        expect(f.getValue()).to.equal(-1);
      });

      it("should parse an optional positive sign", function () {
        var f = DoubleValue.parse('+1');
        expect(f.getValue()).to.equal(1);
      });

      it("should parse 'E' as exponent mark", function () {
        var f = DoubleValue.parse('1E0');
        expect(f.getValue()).to.equal(1);
      });

      it("should parse 'e' as exponent mark", function () {
        var f = DoubleValue.parse('1e0');
        expect(f.getValue()).to.equal(1);
      });

      it("should parse a negative exponent", function () {
        var f = DoubleValue.parse('1E-1');
        expect(f.getValue()).to.equal(0.1);
      });

      it("should parse an exponent with optional positive sign", function () {
        var f = DoubleValue.parse('1E+1');
        expect(f.getValue()).to.equal(10);
      });

      it("should parse an exponent with leading zeros", function () {
        var f = DoubleValue.parse('1E01');
        expect(f.getValue()).to.equal(10);
      });

      it("should reject a value less than -(.getMaxValue())", function () {
        expect(bind(DoubleValue, 'parse', '-1.8E309'))
          .to.throw("must not be less than " + -DoubleValue.getMaxValue());
      });

      it("should reject a value greater than .getMaxValue()", function () {
        expect(bind(DoubleValue, 'parse', '1.8E309'))
          .to.throw("must not be greater than " + DoubleValue.getMaxValue());
      });

    });

    describe('.getMaxValue()', function () {

      it("should return 1.7976931348623157e+308", function () {
        expect(DoubleValue.getMaxValue()).to.equal(1.7976931348623157e+308);
      });

    });

    describe('#initialize()', function () {

      it("should use zero as default value", function () {
        var f = DoubleValue.create();
        expect(f.getValue()).to.equal(0);
      });

      it("should use the provided value", function () {
        var f = DoubleValue.create(123);
        expect(f.getValue()).to.equal(123);
      });

      it("should reject a value not of type number", function () {
        expect(bind(DoubleValue, 'create', '123'))
          .to.throw("must be initialized with a proper number");
      });

    });

    describe('#getValue()', function () {

      it("should return the initialization value", function () {
        var f = DoubleValue.create(123.456);
        expect(f.getValue()).to.equal(123.456);
      });

    });

    describe('#isFinite()', function () {

      it("should return true when finite", function () {
        var f = DoubleValue.create();
        expect(f.isFinite()).to.be.true;
      });

      it("should return false when not finite", function () {
        var f = DoubleValue.create(Number.POSITIVE_INFINITY);
        expect(f.isFinite()).to.be.false;
      });

    });

    describe('#isNaN()', function () {

      it("should return true when NaN", function () {
        var f = DoubleValue.create(Number.NaN);
        expect(f.isNaN()).to.be.true;
      });

      it("should return false when not NaN", function () {
        var f = DoubleValue.create();
        expect(f.isNaN()).to.be.false;
      });

    });

    describe('#isPositive()', function () {

      it("should return true when positive", function () {
        var f = DoubleValue.create(1);
        expect(f.isPositive()).to.be.true;
      });

      it("should return false when zero", function () {
        var f = DoubleValue.create();
        expect(f.isPositive()).to.be.false;
      });

      it("should return false when negative", function () {
        var f = DoubleValue.create(-1);
        expect(f.isPositive()).to.be.false;
      });

    });

    describe('#toString()', function () {

      it("should use 'E' as exponent mark", function () {
        var f = DoubleValue.create();
        expect(f.toString()).to.equal('0.0E0');
      });

      it("should use a single digit to the left", function () {
        var f = DoubleValue.create(123.456);
        expect(f.toString()).to.equal('1.23456E2');
      });

      it("should use a sign for a negative value", function () {
        var f = DoubleValue.create(-1);
        expect(f.toString()).to.equal('-1E0');
      });

      it("should use a sign for a negative exponent", function () {
        var f = DoubleValue.create(0.1);
        expect(f.toString()).to.equal('1E-1');
      });

    });

    describe('#cmp()', function () {

      it("should return zero when LHS and RHS are equal", function () {
        var lhs = DoubleValue.create();
        var rhs = DoubleValue.create();
        expect(lhs.cmp(rhs)).to.equal(0);
      });

      it("should return zero when LHS and RHS are both NaN", function () {
        var lhs = DoubleValue.create(Number.NaN);
        var rhs = DoubleValue.create(Number.NaN);
        expect(lhs.cmp(rhs)).to.equal(0);
      });

      it("should return undefined when LHS is NaN and RHS is not NaN", function () {
        var lhs = DoubleValue.create(Number.NaN);
        var rhs = DoubleValue.create();
        expect(lhs.cmp(rhs)).to.be.undefined;
      });

      it("should return undefined when LHS is not NaN and RHS is NaN", function () {
        var lhs = DoubleValue.create();
        var rhs = DoubleValue.create(Number.NaN);
        expect(lhs.cmp(rhs)).to.be.undefined;
      });

      it("should return -1 when LHS is less than RHS", function () {
        var lhs = DoubleValue.create(1);
        var rhs = DoubleValue.create(2);
        expect(lhs.cmp(rhs)).to.equal(-1);
      });

      it("should return 1 when LHS is greater than RHS", function () {
        var lhs = DoubleValue.create(2);
        var rhs = DoubleValue.create(1);
        expect(lhs.cmp(rhs)).to.equal(1);
      });

    });

    describe('#eq()', function () {

      var lhs;
      var rhs;

      beforeEach(function () {
        lhs = DoubleValue.create();
        rhs = DoubleValue.create();
      });

      it("should return true if #cmp() returns zero", function () {
        var cmpStub = sandbox.stub(DoubleValue.prototype, 'cmp').returns(0);
        expect(lhs.eq(rhs)).to.be.true;
        expect(cmpStub).to.be.calledOn(lhs).and.calledWith(rhs);
      });

      it("should return false if #cmp() return non-zero", function () {
        var cmpStub = sandbox.stub(DoubleValue.prototype, 'cmp').returns(1);
        expect(lhs.eq(rhs)).to.be.false;
        expect(cmpStub).to.be.calledOn(lhs).and.calledWith(rhs);
      });

    });

    describe('#lt()', function () {

      var lhs;
      var rhs;

      beforeEach(function () {
        lhs = DoubleValue.create();
        rhs = DoubleValue.create();
      });

      it("should return true if #cmp() returns less than zero", function () {
        var cmpStub = sandbox.stub(DoubleValue.prototype, 'cmp').returns(-1);
        expect(lhs.lt(rhs)).to.be.true;
        expect(cmpStub).to.be.calledOn(lhs).and.calledWith(rhs);
      });

      it("should return false if #cmp() returns non-negative", function () {
        var cmpStub = sandbox.stub(DoubleValue.prototype, 'cmp').returns(0);
        expect(lhs.lt(rhs)).to.be.false;
        expect(cmpStub).to.be.calledOn(lhs).and.calledWith(rhs);
      });

    });

    describe('#gt()', function () {

      var lhs;
      var rhs;

      beforeEach(function () {
        lhs = DoubleValue.create();
        rhs = DoubleValue.create();
      });

      it("should return true if #cmp() returns greater than zero", function () {
        var cmpStub = sandbox.stub(DoubleValue.prototype, 'cmp').returns(1);
        expect(lhs.gt(rhs)).to.be.true;
        expect(cmpStub).to.be.calledOn(lhs).and.calledWith(rhs);
      });

      it("should return false if #cmp() returns non-positive", function () {
        var cmpStub = sandbox.stub(DoubleValue.prototype, 'cmp').returns(0);
        expect(lhs.gt(rhs)).to.be.false;
        expect(cmpStub).to.be.calledOn(lhs).and.calledWith(rhs);
      });

    });

    describe('#lteq()', function () {

      var lhs;
      var rhs;

      beforeEach(function () {
        lhs = DoubleValue.create();
        rhs = DoubleValue.create();
      });

      it("should return false if #gt() returns true", function () {
        var gtStub = sandbox.stub(DoubleValue.prototype, 'gt').returns(true);
        expect(lhs.lteq(rhs)).to.be.false;
        expect(gtStub).to.be.calledOn(lhs).and.calledWith(rhs);
      });

      it("should return true if #gt() returns false", function () {
        var gtStub = sandbox.stub(DoubleValue.prototype, 'gt').returns(false);
        expect(lhs.lteq(rhs)).to.be.true;
        expect(gtStub).to.be.calledOn(lhs).and.calledWith(rhs);
      });

    });

    describe('#gteq()', function () {

      var lhs;
      var rhs;

      beforeEach(function () {
        lhs = DoubleValue.create();
        rhs = DoubleValue.create();
      });

      it("should return false if #lt() returns true", function () {
        var ltStub = sandbox.stub(DoubleValue.prototype, 'lt').returns(true);
        expect(lhs.gteq(rhs)).to.be.false;
        expect(ltStub).to.be.calledOn(lhs).and.calledWith(rhs);
      });

      it("should return true if #lt() returns false", function () {
        var ltStub = sandbox.stub(DoubleValue.prototype, 'lt').returns(false);
        expect(lhs.gteq(rhs)).to.be.true;
        expect(ltStub).to.be.calledOn(lhs).and.calledWith(rhs);
      });

    });

  });

});