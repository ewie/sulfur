/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global describe, it */

define([
  'shared',
  'sulfur/schema/value/simple',
  'sulfur/schema/value/simple/boolean'
], function (shared, SimpleValue, BooleanValue) {

  'use strict';

  var expect = shared.expect;
  var bind = shared.bind;

  describe('sulfur/schema/value/simple/boolean', function () {

    it("should be derived from sulfur/schema/value/simple", function () {
      expect(SimpleValue).to.be.prototypeOf(BooleanValue);
    });

    describe('.parse()', function () {

      it("should parse 'true' as true", function () {
        var b = BooleanValue.parse('true');
        expect(b.value).to.be.true;
      });

      it("should parse 'false' as false", function () {
        var b = BooleanValue.parse('false');
        expect(b.value).to.be.false;
      });

      it("should parse '1' as true", function () {
        var b = BooleanValue.parse('1');
        expect(b.value).to.be.true;
      });

      it("should parse '0' as false", function () {
        var b = BooleanValue.parse('0');
        expect(b.value).to.be.false;
      });

      it("should ignore leading and trailing white space", function () {
        var b = BooleanValue.parse('\x09\x0A\x0D true \x09\x0A\x0D');
        expect(b.value).to.be.true;
      });

      it("should reject an invalid literal", function () {
        expect(bind(BooleanValue, 'parse', ''))
          .to.throw('invalid boolean literal ""');
      });

    });

    describe('#initialize()', function () {

      it("should reject a non-boolean value", function () {
        expect(bind(BooleanValue, 'create'))
          .to.throw("must be initialized with a boolean value");
      });

      it("should accept true", function () {
        var b = BooleanValue.create(true);
        expect(b.value).to.be.true;
      });

      it("should accept false", function () {
        var b = BooleanValue.create(false);
        expect(b.value).to.be.false;
      });

    });

    describe('#value', function () {

      it("should return true when initialized with true", function () {
        var b = BooleanValue.create(true);
        expect(b.value).to.be.true;
      });

      it("should return false when initialized with false", function () {
        var b = BooleanValue.create(false);
        expect(b.value).to.be.false;
      });

    });

    describe('#toString()', function () {

      it("should return 'true' when true", function () {
        var b = BooleanValue.create(true);
        expect(b.toString()).to.equal('true');
      });

      it("should return 'false' when false", function () {
        var b = BooleanValue.create(false);
        expect(b.toString()).to.equal('false');
      });

    });

    describe('#eq()', function () {

      it("should return true when both LHS and RHS are true", function () {
        var lhs = BooleanValue.create(true);
        var rhs = BooleanValue.create(true);
        expect(lhs.eq(rhs)).to.be.true;
      });

      it("should return true when both LHS and RHS are false", function () {
        var lhs = BooleanValue.create(false);
        var rhs = BooleanValue.create(false);
        expect(lhs.eq(rhs)).to.be.true;
      });

      it("should return false when LHS is true and RHS is false", function () {
        var lhs = BooleanValue.create(true);
        var rhs = BooleanValue.create(false);
        expect(lhs.eq(rhs)).to.be.false;
      });

      it("should return false when LHS is false and RHS is true", function () {
        var lhs = BooleanValue.create(false);
        var rhs = BooleanValue.create(true);
        expect(lhs.eq(rhs)).to.be.false;
      });

    });

  });

});
