/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global afterEach, beforeEach, context, describe, it */

define([
  'shared',
  'sulfur/schema/value/decimal',
  'sulfur/schema/value/integer'
], function ($shared, $decimalValue, $integerValue) {

  'use strict';

  var expect = $shared.expect;
  var bind = $shared.bind;
  var sinon = $shared.sinon;

  describe('sulfur/schema/integer', function () {

    var sandbox;

    beforeEach(function () {
      sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
      sandbox.restore();
    });

    it("should be derived from sulfur/schema/decimal", function () {
      expect($decimalValue).to.be.prototypeOf($integerValue);
    });

    describe('.isValidLiteral()', function () {

      it("should accept integer literals", function () {
        expect($integerValue.isValidLiteral('0')).to.be.true;
      });

      it("should accept negative integer literals", function () {
        expect($integerValue.isValidLiteral('-1')).to.be.true;
      });

      it("should accept explicitely positive integer literals", function () {
        expect($integerValue.isValidLiteral('+2')).to.be.true;
      });

      it("should accept insignificant fraction digits", function () {
        expect($integerValue.isValidLiteral('0.0')).to.be.true;
      });

      it("should reject significant fraction digits", function () {
        expect($integerValue.isValidLiteral('0.1')).to.be.false;
      });

      it("should reject strings not representing a valid integer", function () {
        expect($integerValue.isValidLiteral('123abc')).to.be.false;
      });

    });

    describe('.parse()', function () {

      it("should reject strings not representing a decimal number", function () {
        expect(bind($integerValue, 'parse', '123abc'))
          .to.throw('invalid decimal integer "123abc"');
      });

      it("should reject strings with any significant fraction digits", function () {
        expect(bind($integerValue, 'parse', '1.2'))
          .to.throw('invalid decimal integer "1.2"');
      });

      context("with a valid string", function () {

        it("should accept integers", function () {
          var d = $integerValue.parse('0');
          expect(d.integralDigits).to.equal('0');
        });

        it("should accept an optional positive sign", function () {
          var d = $integerValue.parse('+1');
          expect(d.positive).to.be.true;
        });

        it("should accept negative integers", function () {
          var d = $integerValue.parse('-1');
          expect(d.positive).to.be.false;
        });

        it("should accept insignifcant fractional digits", function () {
          expect(bind($integerValue, 'parse', '0.0')).not.to.throw();
        });

      });

    });

    describe('#initialize()', function () {

      it("should call sulfur/schema/decimal#initialize()", function () {
        var decimalInitializeSpy = sandbox.spy($decimalValue.prototype, 'initialize');
        var value = { integralDigits: '123' };
        var d = $integerValue.create(value);
        expect(decimalInitializeSpy)
          .to.be.calledOn(d)
          .and.be.calledWith(sinon.match.same(value));
      });

      describe("option `fractionDigits`", function () {

        it("should accept insignifcant fractionDigits", function () {
          var d = $integerValue.create({ fractionDigits: '000' });
          expect(d.fractionDigits).to.equal('');
        });

        it("should reject significant fractionDigits", function () {
          expect(bind($integerValue, 'create', { fractionDigits: '1' }))
            .to.throw("fractionDigits must be zero");
        });

      });

    });

  });

});
