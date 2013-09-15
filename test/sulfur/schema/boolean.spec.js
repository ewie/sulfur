/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global describe, it */

define([
  'shared',
  'sulfur/schema/boolean'
], function ($shared, $boolean) {

  'use strict';

  var expect = $shared.expect;
  var bind = $shared.bind;

  describe('sulfur/schema/boolean', function () {

    describe('.isValidLiteral()', function () {

      it("should accept 'true'", function () {
        expect($boolean.isValidLiteral('true')).to.be.true;
      });

      it("should accept 'false'", function () {
        expect($boolean.isValidLiteral('false')).to.be.true;
      });

      it("should accept '1'", function () {
        expect($boolean.isValidLiteral('1')).to.be.true;
      });

      it("should accept '0'", function () {
        expect($boolean.isValidLiteral('0')).to.be.true;
      });

      it("should reject an invalid literal", function () {
        expect($boolean.isValidLiteral('')).to.be.false;
      });

    });

    describe('.parse()', function () {

      it("should parse 'true' as true", function () {
        var b = $boolean.parse('true');
        expect(b.getValue()).to.be.true;
      });

      it("should parse 'false' as false", function () {
        var b = $boolean.parse('false');
        expect(b.getValue()).to.be.false;
      });

      it("should parse '1' as true", function () {
        var b = $boolean.parse('1');
        expect(b.getValue()).to.be.true;
      });

      it("should parse '0' as false", function () {
        var b = $boolean.parse('0');
        expect(b.getValue()).to.be.false;
      });

      it("should reject an invalid literal", function () {
        expect(bind($boolean, 'parse', ''))
          .to.throw('invalid boolean literal ""');
      });

    });

    describe('#initialize()', function () {

      it("should reject a non-boolean value", function () {
        expect(bind($boolean, 'create'))
          .to.throw("must be initialized with a boolean value");
      });

      it("should accept true", function () {
        var b = $boolean.create(true);
        expect(b.getValue()).to.be.true;
      });

      it("should accept false", function () {
        var b = $boolean.create(false);
        expect(b.getValue()).to.be.false;
      });

    });

    describe('#getValue()', function () {

      it("should return true when initialized with true", function () {
        var b = $boolean.create(true);
        expect(b.getValue()).to.be.true;
      });

      it("should return false when initialized with false", function () {
        var b = $boolean.create(false);
        expect(b.getValue()).to.be.false;
      });

    });

    describe('#toCanonicalLiteral()', function () {

      it("should return 'true' when true", function () {
        var b = $boolean.create(true);
        expect(b.toCanonicalLiteral()).to.equal('true');
      });

      it("should return 'false' when false", function () {
        var b = $boolean.create(false);
        expect(b.toCanonicalLiteral()).to.equal('false');
      });

    });

    describe('#eq()', function () {

      it("should return true when both LHS and RHS are true", function () {
        var lhs = $boolean.create(true);
        var rhs = $boolean.create(true);
        expect(lhs.eq(rhs)).to.be.true;
      });

      it("should return true when both LHS and RHS are false", function () {
        var lhs = $boolean.create(false);
        var rhs = $boolean.create(false);
        expect(lhs.eq(rhs)).to.be.true;
      });

      it("should return false when LHS is true and RHS is false", function () {
        var lhs = $boolean.create(true);
        var rhs = $boolean.create(false);
        expect(lhs.eq(rhs)).to.be.false;
      });

      it("should return false when LHS is false and RHS is true", function () {
        var lhs = $boolean.create(false);
        var rhs = $boolean.create(true);
        expect(lhs.eq(rhs)).to.be.false;
      });

    });

  });

});
