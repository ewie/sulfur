/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global afterEach, beforeEach, context, describe, it */

define([
  'shared',
  'sulfur/schema/value/simple/decimal',
  'sulfur/schema/value/simple/numeric'
], function (shared, DecimalValue, NumericValue) {

  'use strict';

  var expect = shared.expect;
  var bind = shared.bind;
  var sinon = shared.sinon;

  describe('sulfur/schema/value/simple/decimal', function () {

    var sandbox;

    beforeEach(function () {
      sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
      sandbox.restore();
    });

    it("should be derived from sulfur/schema/value/simple/numeric", function () {
      expect(NumericValue).to.be.prototypeOf(DecimalValue);
    });

    describe('.parse()', function () {

      it("should reject strings not representing a decimal number", function () {
        expect(bind(DecimalValue, 'parse', '123abc'))
          .to.throw('"123abc" does not represent a valid decimal number');
      });

      context("with a valid string", function () {

        it("should ignore leading and trailing white space", function () {
          var d = DecimalValue.parse('\x09\x0A\x0D 0 \x09\x0A\x0D');
          expect(d).to.eql(DecimalValue.create());
        });

        it("should accept integers", function () {
          var d = DecimalValue.parse('0');
          expect(d.integralDigits).to.equal('0');
        });

        it("should accept an optional positive sign", function () {
          var d = DecimalValue.parse('+1');
          expect(d.positive).to.be.true;
        });

        it("should accept negative decimals", function () {
          var d = DecimalValue.parse('-1');
          expect(d.positive).to.be.false;
        });

        it("should accept optional fractional digits", function () {
          var d = DecimalValue.parse('0.1');
          expect(d.fractionDigits).to.equal('1');
        });

      });

    });

    describe('#initialize()', function () {

      describe("option `integralDigits`", function () {

        it("should default to '0' when not given", function () {
          var d = DecimalValue.create();
          expect(d.integralDigits).to.equal('0');
        });

        context("when given", function () {

          it("should initialize with the given integral digits", function () {
            var d = DecimalValue.create({ integralDigits: '123' });
            expect(d.integralDigits).to.equal('123');
          });

          it("should ignore leading zeros", function () {
            var d = DecimalValue.create({ integralDigits: '000987' });
            expect(d.integralDigits).to.equal('987');
          });

          it("should leave at least a single zero digit", function () {
            var d = DecimalValue.create({ integralDigits: '000' });
            expect(d.integralDigits).to.equal('0');
          });

        });

      });

      describe("option `fractionDigits`", function () {

        it("should default to '0' when not given", function () {
          var d = DecimalValue.create();
          expect(d.fractionDigits).to.equal('');
        });

        context("when given", function () {

          it("should initialize with the given fraction digits", function () {
            var d = DecimalValue.create({ fractionDigits: '123' });
            expect(d.fractionDigits).to.equal('123');
          });

          it("should ignore trailing zeros", function () {
            var d = DecimalValue.create({ fractionDigits: '987000' });
            expect(d.fractionDigits).to.equal('987');
          });

        });

      });

      describe("option `positive`", function () {

        context("when given", function () {

          it("should initialize as positive when true", function () {
            var d = DecimalValue.create({ positive: true });
            expect(d.positive).to.be.true;
          });

          context("when false", function () {

            it("should initialize as negative", function () {
              var d = DecimalValue.create({ integralDigits: '1', positive: false });
              expect(d.positive).to.be.false;
            });

            it("should initialize as positive when value is zero", function () {
              var d = DecimalValue.create({ positive: false });
              expect(d.positive).to.be.true;
            });

          });

        });

        it("should initialize as positive when not given", function () {
          var d = DecimalValue.create();
          expect(d.positive).to.be.true;
        });

      });

    });

    describe('#toString()', function () {

      it("should return the canonical representation", function () {
        var d = DecimalValue.create();
        expect(d.toString()).to.equal('0.0');
      });

      it("should include significant fraction digits", function () {
        var d = DecimalValue.parse('123.456');
        expect(d.toString()).to.equal('123.456');
      });

      it("should use a sign when negative", function () {
        var d = DecimalValue.parse('-123');
        expect(d.toString()).to.equal('-123.0');
      });

    });

    describe('#countDigits()', function () {

      it("should return the number of total digits", function () {
        var d = DecimalValue.create({ integralDigits: '12', fractionDigits: '345' });
        expect(d.countDigits()).to.equal(5);
      });

    });

    describe('#countIntegralDigits()', function () {

      it("should return the number of integral digits", function () {
        var d = DecimalValue.create({ integralDigits: '123' });
        expect(d.countIntegralDigits()).to.equal(3);
      });

    });

    describe('#countFractionDigits()', function () {

      it("should return the number of fraction digits", function () {
        var d = DecimalValue.create({ fractionDigits: '42' });
        expect(d.countFractionDigits()).to.equal(2);
      });

    });

    describe('#cmp()', function () {

      context("with equal sign", function () {

        it("should return 0 for equal integral digits and fraction digits", function () {
          var lhs = DecimalValue.parse('123.456');
          var rhs = DecimalValue.parse('123.456');
          expect(lhs.cmp(rhs)).to.equal(0);
        });

        context("when negative", function () {

          context("with different number of integral digits", function () {

            var lhs = DecimalValue.parse('-21');
            var rhs = DecimalValue.parse('-123');

            it("should return 1 if LHS has less integral digits then RHS", function () {
              expect(lhs.cmp(rhs)).to.equal(1);
            });

            it("should return -1 if RHS has less integral digits then LHS", function () {
              expect(rhs.cmp(lhs)).to.equal(-1);
            });

          });

          context("with equal number of integral digits", function () {

            it("should compare integral digits lexicographically", function () {
              var lhs = DecimalValue.parse('-1999');
              var rhs = DecimalValue.parse('-2000');
              expect(lhs.cmp(rhs)).to.equal(1);
              expect(rhs.cmp(lhs)).to.equal(-1);
            });

            it("should compare fraction digits lexicographically", function () {
              var lhs = DecimalValue.parse('-1.1999');
              var rhs = DecimalValue.parse('-1.2000');
              expect(lhs.cmp(rhs)).to.equal(1);
              expect(rhs.cmp(lhs)).to.equal(-1);
            });

          });

        });

        context("when non-negative", function () {

          context("with different number of integral digits", function () {

            var lhs = DecimalValue.parse('21');
            var rhs = DecimalValue.parse('123');

            it("should return -1 if LHS has less integral digits then RHS", function () {
              expect(lhs.cmp(rhs)).to.equal(-1);
            });

            it("should return 1 if RHS has less integral digits then LHS", function () {
              expect(rhs.cmp(lhs)).to.equal(1);
            });

          });

          context("with equal number of integral digits", function () {

            it("should compare integral digits lexicographically", function () {
              var lhs = DecimalValue.parse('1999');
              var rhs = DecimalValue.parse('2000');
              expect(lhs.cmp(rhs)).to.equal(-1);
              expect(rhs.cmp(lhs)).to.equal(1);
            });

            it("should compare fraction digits lexicographically", function () {
              var lhs = DecimalValue.parse('1.1999');
              var rhs = DecimalValue.parse('1.2000');
              expect(lhs.cmp(rhs)).to.equal(-1);
              expect(rhs.cmp(lhs)).to.equal(1);
            });

          });

        });

      });

      context("with inequal sign", function () {

        var lhs = DecimalValue.parse('-1');
        var rhs = DecimalValue.parse('1');

        it("should return -1 for negative LHS and positive RHS", function () {
          expect(lhs.cmp(rhs)).to.equal(-1);
        });

        it("should return 1 for positive LHS and negative RHS", function () {
          expect(rhs.cmp(lhs)).to.equal(1);
        });

      });

    });

  });

});
