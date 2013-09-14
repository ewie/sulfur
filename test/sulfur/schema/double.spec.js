/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global afterEach, beforeEach, describe, it */

define([
  'shared',
  'sulfur/schema/double'
],function ($shared, $double) {

  'use strict';

  var expect = $shared.expect;
  var bind = $shared.bind;
  var sinon = $shared.sinon;

  describe('sulfur/schema/double', function () {

    var sandbox;

    beforeEach(function () {
      sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
      sandbox.restore();
    });

    describe('.isValidLiteral()', function () {

      it("should call .parse() with the given literal", function () {
        var spy = sandbox.spy($double, 'parse');
        var s = '123';
        $double.isValidLiteral(s);
        expect(spy).to.be.calledWith(s);
      });

      it("should return true when .parse() does not throw", function () {
        sandbox.stub($double, 'parse');
        expect($double.isValidLiteral()).to.be.true;
      });

      it("should return false when .parse() does throw", function () {
        sandbox.stub($double, 'parse').throws();
        expect($double.isValidLiteral()).to.be.false;
      });

    });

    describe('.parse()', function () {

      it("should reject an invalid literal", function () {
        expect(bind($double, 'parse', '123abc'))
          .to.throw('invalid literal "123abc"');
      });

      it("should parse NaN", function () {
        var f = $double.parse('NaN');
        expect(f.isNaN()).to.be.true;
      });

      it("should parse INF", function () {
        var f = $double.parse('INF');
        expect(f.isFinite()).to.be.false;
        expect(f.isPositive()).to.be.true;
      });

      it("should parse -INF", function () {
        var f = $double.parse('-INF');
        expect(f.isFinite()).to.be.false;
        expect(f.isPositive()).to.be.false;
      });

      it("should parse an integer literal", function () {
        var f = $double.parse('123');
        expect(f.getValue()).to.equal(123);
      });

      it("should parse an optional fractional part", function () {
        var f = $double.parse('0.123');
        expect(f.getValue()).to.equal(0.123);
      });

      it("should parse optional leading zeros", function () {
        var f = $double.parse('01');
        expect(f.getValue()).to.equal(1);
      });

      it("should parse optional trailing zeros", function () {
        var f = $double.parse('0.1230');
        expect(f.getValue()).to.equal(0.123);
      });

      it("should parse a negative literal", function () {
        var f = $double.parse('-1');
        expect(f.getValue()).to.equal(-1);
      });

      it("should parse an optional positive sign", function () {
        var f = $double.parse('+1');
        expect(f.getValue()).to.equal(1);
      });

      it("should parse 'E' as exponent mark", function () {
        var f = $double.parse('1E0');
        expect(f.getValue()).to.equal(1);
      });

      it("should parse 'e' as exponent mark", function () {
        var f = $double.parse('1e0');
        expect(f.getValue()).to.equal(1);
      });

      it("should parse a negative exponent", function () {
        var f = $double.parse('1E-1');
        expect(f.getValue()).to.equal(0.1);
      });

      it("should parse an exponent with optional positive sign", function () {
        var f = $double.parse('1E+1');
        expect(f.getValue()).to.equal(10);
      });

      it("should parse an exponent with leading zeros", function () {
        var f = $double.parse('1E01');
        expect(f.getValue()).to.equal(10);
      });

      it("should reject a value less than -(.getMaxValue())", function () {
        expect(bind($double, 'parse', '-1.8E309'))
          .to.throw("must not be less than " + -$double.getMaxValue());
      });

      it("should reject a value greater than .getMaxValue()", function () {
        expect(bind($double, 'parse', '1.8E309'))
          .to.throw("must not be greater than " + $double.getMaxValue());
      });

    });

    describe('.getMaxValue()', function () {

      it("should return 1.7976931348623157e+308", function () {
        expect($double.getMaxValue()).to.equal(1.7976931348623157e+308);
      });

    });

    describe('#initialize()', function () {

      it("should use zero as default value", function () {
        var f = $double.create();
        expect(f.getValue()).to.equal(0);
      });

      it("should use the provided value", function () {
        var f = $double.create(123);
        expect(f.getValue()).to.equal(123);
      });

      //it("should reject a finite value less than -(.getMinValue())", function () {
      //  expect(bind($double, 'create', -$double.getMaxValue() * 2))
      //    .to.throw("must not be less than " + -$double.getMaxValue());
      //});

      //it("should reject a finite value greater than .getMaxValue()", function () {
      //  expect(bind($double, 'create', $double.getMaxValue() * 2))
      //    .to.throw("must not be greater than " + $double.getMaxValue());
      //});

      it("should reject a value not of type number", function () {
        expect(bind($double, 'create', '123'))
          .to.throw("must be initialized with a proper number");
      });

    });

    describe('#getValue()', function () {

      it("should return the initialization value", function () {
        var f = $double.create(123.456);
        expect(f.getValue()).to.equal(123.456);
      });

    });

    describe('#isFinite()', function () {

      it("should return true when finite", function () {
        var f = $double.create();
        expect(f.isFinite()).to.be.true;
      });

      it("should return false when not finite", function () {
        var f = $double.create(Number.POSITIVE_INFINITY);
        expect(f.isFinite()).to.be.false;
      });

    });

    describe('#isNaN()', function () {

      it("should return true when NaN", function () {
        var f = $double.create(Number.NaN);
        expect(f.isNaN()).to.be.true;
      });

      it("should return false when not NaN", function () {
        var f = $double.create();
        expect(f.isNaN()).to.be.false;
      });

    });

    describe('#isPositive()', function () {

      it("should return true when positive", function () {
        var f = $double.create(1);
        expect(f.isPositive()).to.be.true;
      });

      it("should return false when zero", function () {
        var f = $double.create();
        expect(f.isPositive()).to.be.false;
      });

      it("should return false when negative", function () {
        var f = $double.create(-1);
        expect(f.isPositive()).to.be.false;
      });

    });

    describe('#toCanonicalLiteral()', function () {

      it("should use 'E' as exponent mark", function () {
        var f = $double.create();
        expect(f.toCanonicalLiteral()).to.equal('0.0E0');
      });

      it("should use a single digit to the left", function () {
        var f = $double.create(123.456);
        expect(f.toCanonicalLiteral()).to.equal('1.23456E2');
      });

      it("should use a sign for a negative value", function () {
        var f = $double.create(-1);
        expect(f.toCanonicalLiteral()).to.equal('-1E0');
      });

      it("should use a sign for a negative exponent", function () {
        var f = $double.create(0.1);
        expect(f.toCanonicalLiteral()).to.equal('1E-1');
      });

    });

    describe('#cmp()', function () {

      it("should return zero when LHS and RHS are equal", function () {
        var lhs = $double.create();
        var rhs = $double.create();
        expect(lhs.cmp(rhs)).to.equal(0);
      });

      it("should return zero when LHS and RHS are both NaN", function () {
        var lhs = $double.create(Number.NaN);
        var rhs = $double.create(Number.NaN);
        expect(lhs.cmp(rhs)).to.equal(0);
      });

      it("should return undefined when LHS is NaN and RHS is not NaN", function () {
        var lhs = $double.create(Number.NaN);
        var rhs = $double.create();
        expect(lhs.cmp(rhs)).to.be.undefined;
      });

      it("should return undefined when LHS is not NaN and RHS is NaN", function () {
        var lhs = $double.create();
        var rhs = $double.create(Number.NaN);
        expect(lhs.cmp(rhs)).to.be.undefined;
      });

      it("should return -1 when LHS is less than RHS", function () {
        var lhs = $double.create(1);
        var rhs = $double.create(2);
        expect(lhs.cmp(rhs)).to.equal(-1);
      });

      it("should return 1 when LHS is greater than RHS", function () {
        var lhs = $double.create(2);
        var rhs = $double.create(1);
        expect(lhs.cmp(rhs)).to.equal(1);
      });

    });

  });

});
