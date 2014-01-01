/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global afterEach, beforeEach, context, describe, it */

define([
  'shared',
  'sulfur/schema/value/simple/decimal',
  'sulfur/schema/value/simple/integer'
], function (shared, DecimalValue, IntegerValue) {

  'use strict';

  var expect = shared.expect;
  var bind = shared.bind;
  var sinon = shared.sinon;

  describe('sulfur/schema/value/simple/integer', function () {

    var sandbox;

    beforeEach(function () {
      sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
      sandbox.restore();
    });

    it("should be derived from sulfur/schema/value/simple/decimal", function () {
      expect(DecimalValue).to.be.prototypeOf(IntegerValue);
    });

    describe('.parse()', function () {

      it("should reject strings not representing a decimal number", function () {
        expect(bind(IntegerValue, 'parse', '123abc'))
          .to.throw('invalid decimal integer "123abc"');
      });

      it("should reject strings with a fractional part", function () {
        expect(bind(IntegerValue, 'parse', '1.0'))
          .to.throw('invalid decimal integer "1.0"');
      });

      context("with a valid string", function () {

        it("should ignore leading and trailing white space", function () {
          var d = IntegerValue.parse('\x09\x0A\x0D 0 \x09\x0A\x0D');
          expect(d).to.eql(IntegerValue.create());
        });

        it("should accept integers", function () {
          var d = IntegerValue.parse('0');
          expect(d.integralDigits).to.equal('0');
        });

        it("should accept an optional positive sign", function () {
          var d = IntegerValue.parse('+1');
          expect(d.isPositive).to.be.true;
        });

        it("should accept negative integers", function () {
          var d = IntegerValue.parse('-1');
          expect(d.isNegative).to.be.true;
        });

      });

    });

    describe('#initialize()', function () {

      it("should call sulfur/schema/value/simple/decimal#initialize()", function () {
        var decimalInitializeSpy = sandbox.spy(DecimalValue.prototype, 'initialize');
        var value = { integralDigits: '123' };
        var d = IntegerValue.create(value);
        expect(decimalInitializeSpy)
          .to.be.calledOn(d)
          .and.be.calledWith(sinon.match.same(value));
      });

      describe("option `fractionDigits`", function () {

        it("should accept insignifcant fractionDigits", function () {
          var d = IntegerValue.create({ fractionDigits: '0' });
          expect(d.fractionDigits).to.equal('');
        });

        it("should reject significant fractionDigits", function () {
          expect(bind(IntegerValue, 'create', { fractionDigits: '1' }))
            .to.throw("fractionDigits must be zero");
        });

      });

    });

    describe('#toString()', function () {

      it("should return the canonical representation", function () {
        var d = IntegerValue.create();
        expect(d.toString()).to.equal('0');
      });

      it("should use a sign when negative", function () {
        var d = IntegerValue.parse('-123');
        expect(d.toString()).to.equal('-123');
      });

    });

  });

});
