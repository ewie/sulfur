/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global afterEach, beforeEach, context, describe, it */

define([
  'shared',
  'sulfur/schema/value/simple/string',
  'unorm'
], function (shared, StringValue, Unorm) {

  'use strict';

  var expect = shared.expect;
  var bind = shared.bind;
  var sinon = shared.sinon;

  describe('sulfur/schema/value/simple/string', function () {

    describe('.isValidLiteral()', function () {

      function testRanges(result, ranges) {
        ranges.forEach(function (range) {
          for (var value = range[0]; value <= range[1]; value += 1) {
            var s = String.fromCharCode(value);
            expect(StringValue.isValidLiteral(s)).to.equal(result);
          }
        });
      }

      context("with a valid string", function () {

        it("should accept an empty string literal", function () {
          expect(StringValue.isValidLiteral('')).to.be.true;
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
          expect(StringValue.isValidLiteral('abc')).to.be.true;
        });

      });

      it("should reject a string with a lead surrogate but no matching trail surrogate", function () {
        expect(StringValue.isValidLiteral('\uD800')).to.be.false;
      });

      it("should reject a string with a trail surrogate but no matching lead surrogate", function () {
        expect(StringValue.isValidLiteral('\uDC00')).to.be.false;
      });

      it("should reject a string containing a control characters U+0000..U+0008, U+000B, U+000C and U+000E..U+001F", function () {
        testRanges(false, [
          [   0,    8 ],
          [ 0xB,  0xC ],
          [ 0xE, 0x1F ]
        ]);
      });

      it("should reject a string with codeunit U+FFFE", function () {
        expect(StringValue.isValidLiteral('\uFFFE')).to.be.false;
      });

      it("should reject a string with codeunit U+FFFF", function () {
        expect(StringValue.isValidLiteral('\uFFFF')).to.be.false;
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
        var s = StringValue.create();
        expect(s.getLength()).to.equal(0);
      });

      it("should reject a non-string value", function () {
        expect(bind(StringValue, 'create', 1))
          .to.throw("must be initialized with a string value");
      });

      it("should accept a string value", function () {
        var s = StringValue.create('a');
        expect(s.toString()).to.equal('a');
      });

      it("should reject when .isValidLiteral() returns false", function () {
        sandbox.stub(StringValue, 'isValidLiteral').returns(false);
        expect(bind(StringValue, 'create', ''))
          .to.throw("invalid string value");
      });

      it("should normalize the value to NFC", function () {
        var nfcSpy = sandbox.spy(Unorm, 'nfc');
        var s = StringValue.create('\u0065\u0301');
        expect(nfcSpy)
          .to.be.calledWith('\u0065\u0301')
          .to.have.returned(s.toString());
      });

    });

    describe('#toString()', function () {

      it("should return the string value", function () {
        var s = StringValue.create('b');
        expect(s.toString()).to.equal('b');
      });

    });

    describe('#getLength()', function () {

      it("should return the number of UTF-16 codeunits", function () {
        var s = StringValue.create('\uD800\uDC00');
        expect(s.getLength()).to.equal(2);
      });

    });

    describe('#normalizeWhiteSpace()', function () {

      var s;

      beforeEach(function () {
        s = StringValue.create();
      });

      it("should delegate to #collapseWhiteSpace() when mode is 'collapse'", function () {
        var spy = sinon.spy(s, 'collapseWhiteSpace');
        var n = s.normalizeWhiteSpace('collapse');
        expect(spy).to.have.returned(sinon.match.same(n));
      });

      it("should delegate to #replaceWhiteSpace() when mode is 'replace'", function () {
        var spy = sinon.spy(s, 'replaceWhiteSpace');
        var n = s.normalizeWhiteSpace('replace');
        expect(spy).to.have.returned(sinon.match.same(n));
      });

      it("should return this string when mode is 'preserve'", function () {
        expect(s.normalizeWhiteSpace('preserve')).to.equal(s);
      });

      it("should reject a mode other than 'collapse', 'preserve' or 'replace'", function () {
        expect(bind(s, 'normalizeWhiteSpace', 'xxx'))
          .to.throw('unexpected normalization mode "xxx", ' +
            'expecting either "collapse", "preserve" or "replace"');
      });

    });

    describe('#collapseWhiteSpace()', function () {

      it("should remove leading white space", function () {
        var s = StringValue.create('\x09\x0A\x0D x');
        var n = s.collapseWhiteSpace();
        expect(n.toString()).to.equal('x');
      });

      it("should remove trailing white space", function () {
        var s = StringValue.create('y \x09\x0A\x0D');
        var n = s.collapseWhiteSpace();
        expect(n.toString()).to.equal('y');
      });

      it("should replace every white space sequence with a single space", function () {
        var s = StringValue.create('1 \x09\x0A\x0D 2 \x09\x0A\x0D 3');
        var n = s.collapseWhiteSpace();
        expect(n.toString()).to.equal('1 2 3');
      });

    });

    describe('#replaceWhiteSpace()', function () {

      it("should replace each white space character with a single space", function () {
        var s = StringValue.create('1 \x09\x0A\x0D 2 \x09\x0A\x0D 3');
        var n = s.replaceWhiteSpace();
        expect(n.toString()).to.equal('1     2     3');
      });

    });

    describe('#eq()', function () {

      it("should return true when LHS is equal to RHS", function () {
        var lhs = StringValue.create('\u0065\u0301');
        var rhs = StringValue.create('\u00E9');
        expect(lhs.eq(rhs)).to.be.true;
      });

      it("should return false when LHS is not equal to RHS", function () {
        var lhs = StringValue.create('a');
        var rhs = StringValue.create('b');
        expect(lhs.eq(rhs)).to.be.false;
      });

    });

  });

});
