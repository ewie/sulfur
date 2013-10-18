/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global describe, it */

define([
  'shared',
  'sulfur/schema/value/simple/boolean'
], function ($shared, $booleanValue) {

  'use strict';

  var expect = $shared.expect;
  var bind = $shared.bind;

  describe('sulfur/schema/value/simple/boolean', function () {

    describe('.isValidLiteral()', function () {

      it("should accept 'true'", function () {
        expect($booleanValue.isValidLiteral('true')).to.be.true;
      });

      it("should accept 'false'", function () {
        expect($booleanValue.isValidLiteral('false')).to.be.true;
      });

      it("should accept '1'", function () {
        expect($booleanValue.isValidLiteral('1')).to.be.true;
      });

      it("should accept '0'", function () {
        expect($booleanValue.isValidLiteral('0')).to.be.true;
      });

      it("should ignore leading and trailing white space", function () {
        expect($booleanValue.isValidLiteral('\x09\x0A\x0D true \x09\x0A\x0D')).to.be.true;
      });

      it("should reject an invalid literal", function () {
        expect($booleanValue.isValidLiteral('')).to.be.false;
      });

    });

    describe('.parse()', function () {

      it("should parse 'true' as true", function () {
        var b = $booleanValue.parse('true');
        expect(b.getValue()).to.be.true;
      });

      it("should parse 'false' as false", function () {
        var b = $booleanValue.parse('false');
        expect(b.getValue()).to.be.false;
      });

      it("should parse '1' as true", function () {
        var b = $booleanValue.parse('1');
        expect(b.getValue()).to.be.true;
      });

      it("should parse '0' as false", function () {
        var b = $booleanValue.parse('0');
        expect(b.getValue()).to.be.false;
      });

      it("should ignore leading and trailing white space", function () {
        var b = $booleanValue.parse('\x09\x0A\x0D true \x09\x0A\x0D');
        expect(b.getValue()).to.be.true;
      });

      it("should reject an invalid literal", function () {
        expect(bind($booleanValue, 'parse', ''))
          .to.throw('invalid boolean literal ""');
      });

    });

    describe('#initialize()', function () {

      it("should reject a non-boolean value", function () {
        expect(bind($booleanValue, 'create'))
          .to.throw("must be initialized with a boolean value");
      });

      it("should accept true", function () {
        var b = $booleanValue.create(true);
        expect(b.getValue()).to.be.true;
      });

      it("should accept false", function () {
        var b = $booleanValue.create(false);
        expect(b.getValue()).to.be.false;
      });

    });

    describe('#getValue()', function () {

      it("should return true when initialized with true", function () {
        var b = $booleanValue.create(true);
        expect(b.getValue()).to.be.true;
      });

      it("should return false when initialized with false", function () {
        var b = $booleanValue.create(false);
        expect(b.getValue()).to.be.false;
      });

    });

    describe('#toString()', function () {

      it("should return 'true' when true", function () {
        var b = $booleanValue.create(true);
        expect(b.toString()).to.equal('true');
      });

      it("should return 'false' when false", function () {
        var b = $booleanValue.create(false);
        expect(b.toString()).to.equal('false');
      });

    });

    describe('#eq()', function () {

      it("should return true when both LHS and RHS are true", function () {
        var lhs = $booleanValue.create(true);
        var rhs = $booleanValue.create(true);
        expect(lhs.eq(rhs)).to.be.true;
      });

      it("should return true when both LHS and RHS are false", function () {
        var lhs = $booleanValue.create(false);
        var rhs = $booleanValue.create(false);
        expect(lhs.eq(rhs)).to.be.true;
      });

      it("should return false when LHS is true and RHS is false", function () {
        var lhs = $booleanValue.create(true);
        var rhs = $booleanValue.create(false);
        expect(lhs.eq(rhs)).to.be.false;
      });

      it("should return false when LHS is false and RHS is true", function () {
        var lhs = $booleanValue.create(false);
        var rhs = $booleanValue.create(true);
        expect(lhs.eq(rhs)).to.be.false;
      });

    });

  });

});
