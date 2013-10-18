/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global afterEach, beforeEach, context, describe, it */

define([
  'shared',
  'sulfur/schema/value/simple/decimal'
], function ($shared, $decimalValue) {

  'use strict';

  var expect = $shared.expect;
  var bind = $shared.bind;
  var sinon = $shared.sinon;

  describe('sulfur/schema/value/simple/decimal', function () {

    var sandbox;

    beforeEach(function () {
      sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
      sandbox.restore();
    });

    describe('.isValidLiteral()', function () {

      it("should ignore leading and trailing white space", function () {
        expect($decimalValue.isValidLiteral('\x09\x0A\x0D 0 \x09\x0A\x0D')).to.be.true;
      });

      it("should accept integer literals", function () {
        expect($decimalValue.isValidLiteral('0')).to.be.true;
      });

      it("should accept fraction digits", function () {
        expect($decimalValue.isValidLiteral('0.0')).to.be.true;
      });

      it("should accept negative decimals", function () {
        expect($decimalValue.isValidLiteral('-1.2')).to.be.true;
      });

      it("should accept explicitely positive decimals", function () {
        expect($decimalValue.isValidLiteral('+1.2')).to.be.true;
      });

      it("should reject strings not representing a valid decimal", function () {
        expect($decimalValue.isValidLiteral('123abc')).to.be.false;
      });

    });

    describe('.parse()', function () {

      it("should reject strings not representing a decimal number", function () {
        expect(bind($decimalValue, 'parse', '123abc'))
          .to.throw('"123abc" does not represent a valid decimal number');
      });

      context("with a valid string", function () {

        it("should ignore leading and trailing white space", function () {
          var d = $decimalValue.parse('\x09\x0A\x0D 0 \x09\x0A\x0D');
          expect(d).to.eql($decimalValue.create());
        });

        it("should accept integers", function () {
          var d = $decimalValue.parse('0');
          expect(d.integralDigits).to.equal('0');
        });

        it("should accept an optional positive sign", function () {
          var d = $decimalValue.parse('+1');
          expect(d.positive).to.be.true;
        });

        it("should accept negative decimals", function () {
          var d = $decimalValue.parse('-1');
          expect(d.positive).to.be.false;
        });

        it("should accept optional fractional digits", function () {
          var d = $decimalValue.parse('0.1');
          expect(d.fractionDigits).to.equal('1');
        });

      });

    });

    describe('#initialize()', function () {

      describe("option `integralDigitis`", function () {

        it("should default to '0' when not given", function () {
          var d = $decimalValue.create();
          expect(d.integralDigits).to.equal('0');
        });

        context("when given", function () {

          it("should initialize with the given integral digits", function () {
            var d = $decimalValue.create({ integralDigits: '123' });
            expect(d.integralDigits).to.equal('123');
          });

          it("should ignore leading zeros", function () {
            var d = $decimalValue.create({ integralDigits: '000987' });
            expect(d.integralDigits).to.equal('987');
          });

          it("should leave at least a single zero digit", function () {
            var d = $decimalValue.create({ integralDigits: '000' });
            expect(d.integralDigits).to.equal('0');
          });

        });

      });

      describe("option `fractionDigits`", function () {

        it("should default to '0' when not given", function () {
          var d = $decimalValue.create();
          expect(d.fractionDigits).to.equal('');
        });

        context("when given", function () {

          it("should initialize with the given fraction digits", function () {
            var d = $decimalValue.create({ fractionDigits: '123' });
            expect(d.fractionDigits).to.equal('123');
          });

          it("should ignore trailing zeros", function () {
            var d = $decimalValue.create({ fractionDigits: '987000' });
            expect(d.fractionDigits).to.equal('987');
          });

        });

      });

      describe("option `positive`", function () {

        context("when given", function () {

          it("should initialize as positive when true", function () {
            var d = $decimalValue.create({ positive: true });
            expect(d.positive).to.be.true;
          });

          context("when false", function () {

            it("should initialize as negative", function () {
              var d = $decimalValue.create({ integralDigits: '1', positive: false });
              expect(d.positive).to.be.false;
            });

            it("should initialize as positive when value is zero", function () {
              var d = $decimalValue.create({ positive: false });
              expect(d.positive).to.be.true;
            });

          });

        });

        it("should initialize as positive when not given", function () {
          var d = $decimalValue.create();
          expect(d.positive).to.be.true;
        });

      });

    });

    describe('#toString()', function () {

      it("should return the integral digits", function () {
        var d = $decimalValue.parse('123');
        expect(d.toString()).to.equal('123');
      });

      it("should include significant fraction digits", function () {
        var d = $decimalValue.parse('123.456');
        expect(d.toString()).to.equal('123.456');
      });

      it("should use a sign when negative", function () {
        var d = $decimalValue.parse('-123');
        expect(d.toString()).to.equal('-123');
      });

    });

    describe('#countDigits()', function () {

      it("should return the number of total digits", function () {
        var d = $decimalValue.create({ integralDigits: '12', fractionDigits: '345' });
        expect(d.countDigits()).to.equal(5);
      });

    });

    describe('#countIntegralDigits()', function () {

      it("should return the number of integral digits", function () {
        var d = $decimalValue.create({ integralDigits: '123' });
        expect(d.countIntegralDigits()).to.equal(3);
      });

    });

    describe('#countFractionDigits()', function () {

      it("should return the number of fraction digits", function () {
        var d = $decimalValue.create({ fractionDigits: '42' });
        expect(d.countFractionDigits()).to.equal(2);
      });

    });

    describe('#cmp()', function () {

      context("with equal sign", function () {

        it("should return 0 for equal integral digits and fraction digits", function () {
          var lhs = $decimalValue.parse('123.456');
          var rhs = $decimalValue.parse('123.456');
          expect(lhs.cmp(rhs)).to.equal(0);
        });

        context("with different number of integral digits", function () {

          var lhs = $decimalValue.parse('12');
          var rhs = $decimalValue.parse('123');

          it("should return -1 if LHS has less integral digits then RHS", function () {
            expect(lhs.cmp(rhs)).to.equal(-1);
          });

          it("should return 1 if LHS has less integral digits then RHS", function () {
            expect(rhs.cmp(lhs)).to.equal(1);
          });

        });

        context("with equal number of integral digits", function () {

          it("should compare integral digits lexicographically", function () {
            var lhs = $decimalValue.parse('1999');
            var rhs = $decimalValue.parse('2000');
            expect(lhs.cmp(rhs)).to.equal(-1);
            expect(rhs.cmp(lhs)).to.equal(1);
          });

          it("should compare fraction digits lexicographically", function () {
            var lhs = $decimalValue.parse('1.1999');
            var rhs = $decimalValue.parse('1.2000');
            expect(lhs.cmp(rhs)).to.equal(-1);
            expect(rhs.cmp(lhs)).to.equal(1);
          });

        });

      });

      context("with inequal sign", function () {

        var lhs = $decimalValue.parse('-1');
        var rhs = $decimalValue.parse('1');

        it("should return -1 for negative LHS and positive RHS", function () {
          expect(lhs.cmp(rhs)).to.equal(-1);
        });

        it("should return 1 for positive LHS and negative RHS", function () {
          expect(rhs.cmp(lhs)).to.equal(1);
        });

      });

    });

    describe('#eq()', function () {

      it("should return true if #cmp() returns zero", function () {
        var lhs = $decimalValue.create();
        var rhs = $decimalValue.create();
        sandbox.stub($decimalValue.prototype, 'cmp').returns(0);
        expect(lhs.eq(rhs)).to.be.true;
      });

      it("should return false if #cmp() return non-zero", function () {
        var lhs = $decimalValue.create();
        var rhs = $decimalValue.create();
        sandbox.stub($decimalValue.prototype, 'cmp').returns(1);
        expect(lhs.eq(rhs)).to.be.false;
      });

    });

    describe('#lt()', function () {

      it("should return true if #cmp() returns less than zero", function () {
        var lhs = $decimalValue.create();
        var rhs = $decimalValue.create();
        sandbox.stub($decimalValue.prototype, 'cmp').returns(-1);
        expect(lhs.lt(rhs)).to.be.true;
      });

      it("should return false if #cmp() returns non-negative", function () {
        var lhs = $decimalValue.create();
        var rhs = $decimalValue.create();
        sandbox.stub($decimalValue.prototype, 'cmp').returns(0);
        expect(lhs.lt(rhs)).to.be.false;
      });

    });

    describe('#gt()', function () {

      it("should return true if #cmp() returns greater than zero", function () {
        var lhs = $decimalValue.create();
        var rhs = $decimalValue.create();
        sandbox.stub($decimalValue.prototype, 'cmp').returns(1);
        expect(lhs.gt(rhs)).to.be.true;
      });

      it("should return false if #cmp() returns non-positive", function () {
        var lhs = $decimalValue.create();
        var rhs = $decimalValue.create();
        sandbox.stub($decimalValue.prototype, 'cmp').returns(0);
        expect(lhs.gt(rhs)).to.be.false;
      });

    });

    describe('#lteq()', function () {

      it("should return false if #gt() returns true", function () {
        var lhs = $decimalValue.create();
        var rhs = $decimalValue.create();
        sandbox.stub($decimalValue.prototype, 'gt').returns(true);
        expect(lhs.lteq(rhs)).to.be.false;
      });

      it("should return true if #gt() returns false", function () {
        var lhs = $decimalValue.create();
        var rhs = $decimalValue.create();
        sandbox.stub($decimalValue.prototype, 'gt').returns(false);
        expect(lhs.lteq(rhs)).to.be.true;
      });

    });

    describe('#gteq()', function () {

      it("should return false if #lt() returns true", function () {
        var lhs = $decimalValue.create();
        var rhs = $decimalValue.create();
        sandbox.stub($decimalValue.prototype, 'lt').returns(true);
        expect(lhs.gteq(rhs)).to.be.false;
      });

      it("should return true if #lt() returns false", function () {
        var lhs = $decimalValue.create();
        var rhs = $decimalValue.create();
        sandbox.stub($decimalValue.prototype, 'lt').returns(false);
        expect(lhs.gteq(rhs)).to.be.true;
      });

    });

  });

});
