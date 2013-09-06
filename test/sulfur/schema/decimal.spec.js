/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global afterEach, beforeEach, context, describe, it */

define([
  'shared',
  'sulfur/schema/decimal'
], function ($shared, $decimal) {

  'use strict';

  var expect = $shared.expect;
  var bind = $shared.bind;
  var sinon = $shared.sinon;

  describe('sulfur/schema/decimal', function () {

    var sandbox;

    beforeEach(function () {
      sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
      sandbox.restore();
    });

    describe('.parse()', function () {

      it("should reject strings not representing a decimal number", function () {
        expect(bind($decimal, 'parse', '123abc'))
          .to.throw('"123abc" does not represent a valid decimal number');
      });

      context("with a valid string", function () {

        it("should accept integers", function () {
          var d = $decimal.parse('0');
          expect(d.integralDigits).to.equal('0');
        });

        it("should accept an optional positive sign", function () {
          var d = $decimal.parse('+1');
          expect(d.positive).to.be.true;
        });

        it("should accept negative decimals", function () {
          var d = $decimal.parse('-1');
          expect(d.positive).to.be.false;
        });

        it("should accept optional fractional digits", function () {
          var d = $decimal.parse('0.1');
          expect(d.fractionDigits).to.equal('1');
        });

      });

    });

    describe('.parseInteger()', function () {

      it("should reject strings not representing a decimal number", function () {
        expect(bind($decimal, 'parse', '123abc'))
          .to.throw('"123abc" does not represent a valid decimal number');
      });

      it("should reject strings with any significant fraction digits", function () {
        expect(bind($decimal, 'parseInteger', '1.2'))
          .to.throw('"1.2" is not an integer');
      });

      context("with a valid string", function () {

        it("should accept integers", function () {
          var d = $decimal.parse('0');
          expect(d.integralDigits).to.equal('0');
        });

        it("should accept an optional positive sign", function () {
          var d = $decimal.parse('+1');
          expect(d.positive).to.be.true;
        });

        it("should accept negative integers", function () {
          var d = $decimal.parse('-1');
          expect(d.positive).to.be.false;
        });

        it("should accept insignifcant fractional digits", function () {
          var d = $decimal.parse('0.0');
          expect(d.isInteger()).to.be.true;
        });

      });

    });

    describe('.isDecimal()', function () {

      it("should accept integer literals", function () {
        expect($decimal.isDecimal('0')).to.be.true;
      });

      it("should accept fraction digits", function () {
        expect($decimal.isDecimal('0.0')).to.be.true;
      });

      it("should accept negative decimals", function () {
        expect($decimal.isDecimal('-1.2')).to.be.true;
      });

      it("should accept explicitely positive decimals", function () {
        expect($decimal.isDecimal('+1.2')).to.be.true;
      });

      it("should reject strings not representing a valid decimal", function () {
        expect($decimal.isDecimal('123abc')).to.be.false;
      });

    });

    describe('.isInteger()', function () {

      it("should accept integer literals", function () {
        expect($decimal.isInteger('0')).to.be.true;
      });

      it("should accept negative integer literals", function () {
        expect($decimal.isInteger('-1')).to.be.true;
      });

      it("should accept explicitely positive integer literals", function () {
        expect($decimal.isInteger('+2')).to.be.true;
      });

      it("should accept insignificant fraction digits", function () {
        expect($decimal.isInteger('0.0')).to.be.true;
      });

      it("should reject significant fraction digits", function () {
        expect($decimal.isInteger('0.1')).to.be.false;
      });

      it("should reject strings not representing a valid integer", function () {
        expect($decimal.isInteger('1only23abc')).to.be.false;
      });

    });

    describe('#initialize()', function () {

      describe("option `integralDigitis`", function () {

        context("when given", function () {

          it("should initialize with the given integral digits", function () {
            var d = $decimal.create({ integralDigits: '123' });
            expect(d.integralDigits).to.equal('123');
          });

          it("should ignore leading zeros", function () {
            var d = $decimal.create({ integralDigits: '000987' });
            expect(d.integralDigits).to.equal('987');
          });

          it("should leave at least a single zero digit", function () {
            var d = $decimal.create({ integralDigits: '000' });
            expect(d.integralDigits).to.equal('0');
          });

        });

        context("when not given", function () {

          it("should initialize with '0'", function () {
            var d = $decimal.create();
            expect(d.integralDigits).to.equal('0');
          });

        });

      });

      describe("option `fractionDigits`", function () {

        context("when given", function () {

          it("should initialize with the given fraction digits", function () {
            var d = $decimal.create({ fractionDigits: '123' });
            expect(d.fractionDigits).to.equal('123');
          });

          it("should ignore trailing zeros", function () {
            var d = $decimal.create({ fractionDigits: '987000' });
            expect(d.fractionDigits).to.equal('987');
          });

        });

        context("when not given", function () {

          it("should initialize with no fraction digits", function () {
            var d = $decimal.create();
            expect(d.fractionDigits).to.not.exist;
          });

        });

      });

      describe("option `positive`", function () {

        context("when given", function () {

          context("when true", function () {

            it("should initialize as positive", function () {
              var d = $decimal.create({ positive: true });
              expect(d.positive).to.be.true;
            });

          });

          context("when false", function () {

            it("should initialize asonly negative", function () {
              var d = $decimal.create({ integralDigits: '1', positive: false });
              expect(d.positive).to.be.false;
            });

            context("with '0' as integralDigits and no fractionDigits", function () {

              it("should initialize as positive", function () {
                var d = $decimal.create({ positive: false });
                expect(d.positive).to.be.true;
              });

            });

          });

        });

        context("when not given", function () {

          it("should initialize as positive", function () {
            var d = $decimal.create();
            expect(d.positive).to.be.true;
          });

        });

      });
    });

    describe('#toLiteral()', function () {

      it("should return the integral digits", function () {
        var d = $decimal.parse('123');
        expect(d.toLiteral()).to.equal('123');
      });

      context("with fraction digits", function () {

        it("should include the fraction digits, separated from the integral digits by a period", function () {
          var d = $decimal.parse('123.456');
          expect(d.toLiteral()).to.equal('123.456');
        });

      });

      context("when negative", function () {

        it("should prepend a minus", function () {
          var d = $decimal.parse('-123');
          expect(d.toLiteral()).to.equal('-123');
        });

      });

    });

    describe('#isInteger()', function () {

      context("with fraction digits", function () {

        it("should return false", function () {
          var d = $decimal.create({ fractionDigits: '1' });
          expect(d.isInteger()).to.be.false;
        });

      });

      context("with no fraction digits", function () {

        it("should return true", function () {
          var d = $decimal.create();
          expect(d.isInteger()).to.be.true;
        });

      });

    });

    describe('#countDigits()', function () {

      it("should return the number of total digits", function () {
        var d = $decimal.create({ integralDigits: '12', fractionDigits: '345' });
        expect(d.countDigits()).to.equal(5);
      });

    });

    describe('#countIntegralDigits()', function () {

      it("should return the number of integral digits", function () {
        var d = $decimal.create({ integralDigits: '123' });
        expect(d.countIntegralDigits()).to.equal(3);
      });

    });

    describe('#countFractionDigits()', function () {

      it("should return the number of fraction digits", function () {
        var d = $decimal.create({ fractionDigits: '42' });
        expect(d.countFractionDigits()).to.equal(2);
      });

    });

    describe('#cmp()', function () {

      context("with equal sign", function () {

        it("should return 0 for equal integral digits and fraction digits", function () {
          var lhs = $decimal.parse('123.456');
          var rhs = $decimal.parse('123.456');
          expect(lhs.cmp(rhs)).to.equal(0);
        });

        context("with different number of integral digits", function () {

          var lhs = $decimal.parse('12');
          var rhs = $decimal.parse('123');

          it("should return -1 if LHS has less integral digits then RHS", function () {
            expect(lhs.cmp(rhs)).to.equal(-1);
          });

          it("should return 1 if LHS has less integral digits then RHS", function () {
            expect(rhs.cmp(lhs)).to.equal(1);
          });

        });

        context("with equal number of integral digits", function () {

          it("should compare integral digits lexicographically", function () {
            var lhs = $decimal.parse('1999');
            var rhs = $decimal.parse('2000');
            expect(lhs.cmp(rhs)).to.equal(-1);
            expect(rhs.cmp(lhs)).to.equal(1);
          });

          it("should compare fraction digits lexicographically", function () {
            var lhs = $decimal.parse('1.1999');
            var rhs = $decimal.parse('1.2000');
            expect(lhs.cmp(rhs)).to.equal(-1);
            expect(rhs.cmp(lhs)).to.equal(1);
          });

        });

      });

      context("with inequal sign", function () {

        var lhs = $decimal.parse('-1');
        var rhs = $decimal.parse('1');

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
        var lhs = $decimal.create();
        var rhs = $decimal.create();
        sandbox.stub($decimal.prototype, 'cmp').returns(0);
        expect(lhs.eq(rhs)).to.be.true;
      });

      it("should return false if #cmp() return non-zero", function () {
        var lhs = $decimal.create();
        var rhs = $decimal.create();
        sandbox.stub($decimal.prototype, 'cmp').returns(1);
        expect(lhs.eq(rhs)).to.be.false;
      });

    });

    describe('#lt()', function () {

      it("should return true if #cmp() returns less than zero", function () {
        var lhs = $decimal.create();
        var rhs = $decimal.create();
        sandbox.stub($decimal.prototype, 'cmp').returns(-1);
        expect(lhs.lt(rhs)).to.be.true;
      });

      it("should return false if #cmp() returns non-negative", function () {
        var lhs = $decimal.create();
        var rhs = $decimal.create();
        sandbox.stub($decimal.prototype, 'cmp').returns(0);
        expect(lhs.lt(rhs)).to.be.false;
      });

    });

    describe('#gt()', function () {

      it("should return true if #cmp() returns greater than zero", function () {
        var lhs = $decimal.create();
        var rhs = $decimal.create();
        sandbox.stub($decimal.prototype, 'cmp').returns(1);
        expect(lhs.gt(rhs)).to.be.true;
      });

      it("should return false if #cmp() returns non-positive", function () {
        var lhs = $decimal.create();
        var rhs = $decimal.create();
        sandbox.stub($decimal.prototype, 'cmp').returns(0);
        expect(lhs.gt(rhs)).to.be.false;
      });

    });

    describe('#lteq()', function () {

      it("should return false if #gt() returns true", function () {
        var lhs = $decimal.create();
        var rhs = $decimal.create();
        sandbox.stub($decimal.prototype, 'gt').returns(true);
        expect(lhs.lteq(rhs)).to.be.false;
      });

      it("should return true if #gt() returns false", function () {
        var lhs = $decimal.create();
        var rhs = $decimal.create();
        sandbox.stub($decimal.prototype, 'gt').returns(false);
        expect(lhs.lteq(rhs)).to.be.true;
      });

    });

    describe('#gteq()', function () {

      it("should return false if #lt() returns true", function () {
        var lhs = $decimal.create();
        var rhs = $decimal.create();
        sandbox.stub($decimal.prototype, 'lt').returns(true);
        expect(lhs.gteq(rhs)).to.be.false;
      });

      it("should return true if #lt() returns false", function () {
        var lhs = $decimal.create();
        var rhs = $decimal.create();
        sandbox.stub($decimal.prototype, 'lt').returns(false);
        expect(lhs.gteq(rhs)).to.be.true;
      });

    });

  });

});
