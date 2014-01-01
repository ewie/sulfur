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
  'sulfur/schema/value/simple/mediaType'
], function (shared, SimpleValue, MediaTypeValue) {

  'use strict';

  var expect = shared.expect;
  var bind = shared.bind;
  var sinon = shared.sinon;

  describe('sulfur/schema/value/simple/mediaType', function () {

    it("should be derived from sulfur/schema/value/simple", function () {
      expect(SimpleValue).to.be.prototypeOf(MediaTypeValue);
    });

    describe('.parse()', function () {

      it("should split the string at the first forward slash", function () {
        var s = 'image/jpeg';
        var mt = MediaTypeValue.parse(s);
        expect(mt).to.eql(MediaTypeValue.create('image', 'jpeg'));
      });

      it("should reject when the string contains no forward slash", function () {
        expect(bind(MediaTypeValue, 'parse', 'xxx'))
          .to.throw("expecting a string representing a valid media type");
      });

    });

    describe('#initialize', function () {

      var sandbox;

      beforeEach(function () {
        sandbox = sinon.sandbox.create();
      });

      afterEach(function () {
        sandbox.restore();
      });

      it("should use '*' as default type", function () {
        var mt = MediaTypeValue.create();
        expect(mt.type).to.be.undefined;
      });

      it("should use '*' as default subtype", function () {
        var mt = MediaTypeValue.create();
        expect(mt.subtype).to.be.undefined;
      });

      'application audio image text video'.split(' ').forEach(function (type) {

        it("should accept type '" + type + "'", function () {
          var mt = MediaTypeValue.create(type);
          expect(mt.type).to.equal(type);
        });

      });

      it("should treat type '*' as wildcard", function () {
        var mt = MediaTypeValue.create('*');
        expect(mt.type).to.be.undefined;
      });

      it("should reject an invalid type", function () {
        expect(bind(MediaTypeValue, 'create', 'xxx'))
          .to.throw("media type must be one of 'application', 'audio', 'image', 'text' or 'video'");
      });

      it("should accept a subtype", function () {
        var mt = MediaTypeValue.create('text', 'plain');
        expect(mt.subtype).to.equal('plain');
      });

      it("should treat subtype '*' as wildcard", function () {
        var mt = MediaTypeValue.create('text', '*');
        expect(mt.subtype).to.be.undefined;
      });

      it("should reject an invalid subtype when given", function () {
        var testSpy = sandbox.spy(RegExp.prototype, 'test');
        var subtype = ' ';
        expect(bind(MediaTypeValue, 'create', 'audio', subtype))
          .to.throw("invalid subtype");
        expect(testSpy)
          .to.be.calledOn(sinon.match(function (r) {
            return r.source === /^[^\x00-\x20\x7F()<>@,;:\\"/\[\]?.=]+$/.source;
          }, /^[^\x00-\x20\x7F()<>@,;:\\"/\[\]?.=]+$/))
          .to.be.calledWith(subtype)
          .to.have.returned(false);
      });

      it("should reject an undefined type to be used along a defined subtype", function () {
        expect(bind(MediaTypeValue, 'create', '*', 'plain'))
          .to.throw("cannot use a defined subtype with an undefined type");
      });

    });

    describe('#type', function () {

      it("should return the type when defined", function () {
        var mt = MediaTypeValue.create('text');
        expect(mt.type).to.equal('text');
      });

      it("should return undefined when no type is defined", function () {
        var mt = MediaTypeValue.create();
        expect(mt.type).to.be.undefined;
      });

    });

    describe('#subtype', function () {

      it("should return the subtype when defined", function () {
        var mt = MediaTypeValue.create('image', 'jpeg');
        expect(mt.subtype).to.equal('jpeg');
      });

      it("should return undefined when no subtype is defined", function () {
        var mt = MediaTypeValue.create();
        expect(mt.subtype).to.be.undefined;
      });

    });

    describe('#eq()', function () {

      it("should return false when #type is different", function () {
        var mt = MediaTypeValue.create('text');
        var other = MediaTypeValue.create('image');
        expect(mt.eq(other)).to.be.false;
      });

      it("should return false when #subtype is different", function () {
        var mt = MediaTypeValue.create('text', 'plain');
        var other = MediaTypeValue.create('text', 'html');
        expect(mt.eq(other)).to.be.false;
      });

      it("should return true when #type and #subtype are respectively identical", function () {
        var mt = MediaTypeValue.create('text', 'plain');
        var other = MediaTypeValue.create('text', 'plain');
        expect(mt.eq(other)).to.be.true;
      });

    });

    describe('#toString()', function () {

      it("should include the specific subtype when defined", function () {
        var mt = MediaTypeValue.create('text', 'plain');
        expect(mt.toString()).to.equal('text/plain');
      });

      it("should use the wildcard '*' when type is not defined", function () {
        var mt = MediaTypeValue.create();
        expect(mt.toString()).to.equal('*/*');
      });

      it("should use the wildcard '*' when subtype is not defined", function () {
        var mt = MediaTypeValue.create('text');
        expect(mt.toString()).to.equal('text/*');
      });

    });

    describe('#matches()', function () {

      it("should return true when LHS' and RHS' type is undefined", function () {
        var lhs = MediaTypeValue.create();
        var rhs = MediaTypeValue.create();
        expect(lhs.matches(rhs)).to.be.true;
      });

      it("should return true when LHS' type is undefined", function () {
        var lhs = MediaTypeValue.create();
        var rhs = MediaTypeValue.create('text');
        expect(lhs.matches(rhs)).to.be.true;
      });

      it("should return false when RHS' type is undefined", function () {
        var lhs = MediaTypeValue.create('text');
        var rhs = MediaTypeValue.create();
        expect(lhs.matches(rhs)).to.be.false;
      });

      it("should return false when LHS' and RHS' type is different", function () {
        var lhs = MediaTypeValue.create('audio');
        var rhs = MediaTypeValue.create('text');
        expect(lhs.matches(rhs)).to.be.false;
      });

      context("when LHS' and RHS' type is defined and equal", function () {

        it("should return true when LHS' and RHS' subtype is undefined", function () {
          var lhs = MediaTypeValue.create('text');
          var rhs = MediaTypeValue.create('text');
          expect(lhs.matches(rhs)).to.be.true;
        });

        it("should return true when LHS' subtype is undefined", function () {
          var lhs = MediaTypeValue.create('text');
          var rhs = MediaTypeValue.create('text', 'plain');
          expect(lhs.matches(rhs)).to.be.true;
        });

        it("should return false when RHS' subtype is undefined", function () {
          var lhs = MediaTypeValue.create('text', 'plain');
          var rhs = MediaTypeValue.create('text');
          expect(lhs.matches(rhs)).to.be.false;
        });

        it("should return true when LHS' and RHS' subtype are equal", function () {
          var lhs = MediaTypeValue.create('text', 'plain');
          var rhs = MediaTypeValue.create('text', 'plain');
          expect(lhs.matches(rhs)).to.be.true;
        });

        it("should return false when LHS' and RHS' subtype are different", function () {
          var lhs = MediaTypeValue.create('text', 'plain');
          var rhs = MediaTypeValue.create('text', 'css');
          expect(lhs.matches(rhs)).to.be.false;
        });

      });

    });

  });

});
