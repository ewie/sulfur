/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global afterEach, beforeEach, context, describe, it */

define([
  'shared',
  'sulfur/schema/value/_simple',
  'sulfur/schema/value/string',
  'unorm'
], function ($shared, $_simpleValue, $stringValue, $unorm) {

  'use strict';

  var expect = $shared.expect;
  var bind = $shared.bind;
  var sinon = $shared.sinon;

  describe('sulfur/schema/string', function () {

    it("should be derived from sulfur/schema/value/_simple", function () {
      expect($_simpleValue).to.be.prototypeOf($stringValue);
    });

    describe('.isValidLiteral()', function () {

      function testRanges(result, ranges) {
        ranges.forEach(function (range) {
          for (var value = range[0]; value <= range[1]; value += 1) {
            var s = String.fromCharCode(value);
            expect($stringValue.isValidLiteral(s)).to.equal(result);
          }
        });
      }

      context("with a valid string", function () {

        it("should accept an empty string literal", function () {
          expect($stringValue.isValidLiteral('')).to.be.true;
        });

        it("should accept a string with only valid codeunits", function () {
          testRanges(true, [
            [      9,    0xA ],
            [    0xD,    0xD ],
            [   0x20, 0xD7FF ],
            [ 0xE000, 0xFFFD ]
          ]);
        });

        it("should accept a string with multiple valid codeunits", function () {
          expect($stringValue.isValidLiteral('abc')).to.be.true;
        });

      });

      it("should reject a string with a lead surrogate but no matching trail surrogate", function () {
        expect($stringValue.isValidLiteral('\uD800')).to.be.false;
      });

      it("should reject a string with a trail surrogate but no matching lead surrogate", function () {
        expect($stringValue.isValidLiteral('\uDC00')).to.be.false;
      });

      it("should reject a string containing a control characters U+0000..U+0008, U+000B, U+000C and U+000E..U+001F", function () {
        testRanges(false, [
          [   0,    8 ],
          [ 0xB,  0xC ],
          [ 0xE, 0x1F ]
        ]);
      });

      it("should reject a string with codeunit U+FFFE", function () {
        expect($stringValue.isValidLiteral('\uFFFE')).to.be.false;
      });

      it("should reject a string with codeunit U+FFFF", function () {
        expect($stringValue.isValidLiteral('\uFFFF')).to.be.false;
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

      it("should use the empty string as default value", function () {
        var s = $stringValue.create();
        expect(s.getLength()).to.equal(0);
      });

      it("should reject a non-string value", function () {
        expect(bind($stringValue, 'create', 1))
          .to.throw("must be initialized with a string value");
      });

      it("should accept a string value", function () {
        var s = $stringValue.create('a');
        expect(s.toString()).to.equal('a');
      });

      it("should reject when .isValidLiteral() returns false", function () {
        sandbox.stub($stringValue, 'isValidLiteral').returns(false);
        expect(bind($stringValue, 'create', ''))
          .to.throw("invalid string value");
      });

      it("should normalize the value to NFC", function () {
        var nfcSpy = sandbox.spy($unorm, 'nfc');
        var s = $stringValue.create('\u0065\u0301');
        expect(nfcSpy)
          .to.be.calledWith('\u0065\u0301')
          .to.have.returned(s.toString());
      });

    });

    describe('#toString()', function () {

      it("should return the string value", function () {
        var s = $stringValue.create('b');
        expect(s.toString()).to.equal('b');
      });

    });

    describe('#getLength()', function () {

      it("should return the number of UTF-16 codeunits", function () {
        var s = $stringValue.create('\uD800\uDC00');
        expect(s.getLength()).to.equal(2);
      });

    });

    describe('#eq()', function () {

      it("should return true when LHS is equal to RHS", function () {
        var lhs = $stringValue.create('\u0065\u0301');
        var rhs = $stringValue.create('\u00E9');
        expect(lhs.eq(rhs)).to.be.true;
      });

      it("should return false when LHS is not equal to RHS", function () {
        var lhs = $stringValue.create('a');
        var rhs = $stringValue.create('b');
        expect(lhs.eq(rhs)).to.be.false;
      });

    });

  });

});
