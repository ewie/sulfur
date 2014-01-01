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
  'sulfur/schema/value/simple',
  'sulfur/schema/value/simple/string'
], function (shared, SimpleValue, StringValue) {

  'use strict';

  var expect = shared.expect;
  var bind = shared.bind;
  var sinon = shared.sinon;

  describe('sulfur/schema/value/simple/string', function () {

    it("should be derived from sulfur/schema/value/simple", function () {
      expect(SimpleValue).to.be.prototypeOf(StringValue);
    });

    describe('.parse()', function () {

      var sandbox;

      beforeEach(function () {
        sandbox = sinon.sandbox.create();
      });

      afterEach(function () {
        sandbox.restore();
      });

      it("should call .create()", function () {
        var spy = sandbox.spy(StringValue, 'create');
        var s = 'foo';
        var u = StringValue.parse(s);
        expect(spy)
          .to.be.calledWith(s)
          .to.have.returned(sinon.match.same(u));
      });

    });

    describe('#initialize()', function () {

      function testRanges(ranges, fn) {
        ranges.forEach(function (range) {
          for (var value = range[0]; value <= range[1]; value += 1) {
            fn(String.fromCharCode(value));
          }
        });
      }

      var sandbox;

      beforeEach(function () {
        sandbox = sinon.sandbox.create();
      });

      afterEach(function () {
        sandbox.restore();
      });

      it("should use the empty string as default value", function () {
        var s = StringValue.create();
        expect(s.length).to.equal(0);
      });

      it("should reject a non-string value", function () {
        expect(bind(StringValue, 'create', 1))
          .to.throw("must be initialized with a string value");
      });

      it("should accept a string value", function () {
        var s = StringValue.create('a');
        expect(s.toString()).to.equal('a');
      });

      context("with a valid string", function () {

        it("should accept a string with only valid codeunits", function () {
          testRanges([
            [      9,    0xA ],
            [    0xD,    0xD ],
            [   0x20, 0xD7FF ],
            [ 0xE000, 0xFFFD ]
          ], function (value) {
            var s = StringValue.create(value);
            expect(s.toString()).to.equal(value);
          });
        });

        it("should accept a string with multiple valid codeunits", function () {
          var s = StringValue.create('abc');
          expect(s.toString()).to.equal('abc');
        });

      });

      it("should reject a string with a lead surrogate but no matching trail surrogate", function () {
        expect(bind(StringValue, 'create', '\uD800'))
          .to.throw("invalid string");
      });

      it("should reject a string with a trail surrogate but no matching lead surrogate", function () {
        expect(bind(StringValue, 'create', '\uDC00'))
          .to.throw("invalid string");
      });

      it("should reject a string containing a control characters U+0000..U+0008, U+000B, U+000C and U+000E..U+001F", function () {
        testRanges([
          [   0,    8 ],
          [ 0xB,  0xC ],
          [ 0xE, 0x1F ]
        ], function (value) {
          expect(bind(StringValue, 'create', value))
            .to.throw("invalid string");
        });
      });

      it("should reject a string with codeunit U+FFFE", function () {
        expect(bind(StringValue, 'create', '\uFFFE'))
          .to.throw("invalid string");
      });

      it("should reject a string with codeunit U+FFFF", function () {
        expect(bind(StringValue, 'create', '\uFFFF'))
          .to.throw("invalid string");
      });

    });

    describe('#toString()', function () {

      it("should return the string value", function () {
        var s = StringValue.create('b');
        expect(s.toString()).to.equal('b');
      });

    });

    describe('#length', function () {

      it("should return the number of UTF-16 codeunits", function () {
        var s = StringValue.create('\uD800\uDC00');
        expect(s.length).to.equal(2);
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
        var lhs = StringValue.create('x');
        var rhs = StringValue.create('x');
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
