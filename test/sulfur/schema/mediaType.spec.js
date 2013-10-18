/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global afterEach, beforeEach, context, describe, it */

define([
  'shared',
  'sulfur/schema/mediaType'
], function (shared, MediaType) {

  'use strict';

  var expect = shared.expect;
  var bind = shared.bind;
  var sinon = shared.sinon;

  describe('sulfur/schema/mediaType', function () {

    describe('.parse()', function () {

      it("should split the string at the first forward slash", function () {
        var s = 'image/jpeg';
        var mt = MediaType.parse(s);
        expect(mt).to.eql(MediaType.create('image', 'jpeg'));
      });

      it("should reject when the string contains no forward slash", function () {
        expect(bind(MediaType, 'parse', 'xxx'))
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
        var mt = MediaType.create();
        expect(mt.getType()).to.be.undefined;
      });

      it("should use '*' as default subtype", function () {
        var mt = MediaType.create();
        expect(mt.getSubtype()).to.be.undefined;
      });

      'application audio image text video'.split(' ').forEach(function (type) {

        it("should accept type '" + type + "'", function () {
          var mt = MediaType.create(type);
          expect(mt.getType()).to.equal(type);
        });

      });

      it("should treat type '*' as wildcard", function () {
        var mt = MediaType.create('*');
        expect(mt.getType()).to.be.undefined;
      });

      it("should reject an invalid type", function () {
        expect(bind(MediaType, 'create', 'xxx'))
          .to.throw("media type must be one of 'application', 'audio', 'image', 'text' or 'video'");
      });

      it("should accept a subtype", function () {
        var mt = MediaType.create('text', 'plain');
        expect(mt.getSubtype()).to.equal('plain');
      });

      it("should treat subtype '*' as wildcard", function () {
        var mt = MediaType.create('text', '*');
        expect(mt.getSubtype()).to.be.undefined;
      });

      it("should reject an invalid subtype when given", function () {
        var testSpy = sandbox.spy(RegExp.prototype, 'test');
        var subtype = ' ';
        expect(bind(MediaType, 'create', 'audio', subtype))
          .to.throw("invalid subtype");
        expect(testSpy)
          .to.be.calledOn(sinon.match(function (r) {
            return r.source === /^[^\x00-\x20\x7F()<>@,;:\\"/\[\]?.=]+$/.source;
          }, /^[^\x00-\x20\x7F()<>@,;:\\"/\[\]?.=]+$/))
          .to.be.calledWith(subtype)
          .to.have.returned(false);
      });

      it("should reject an undefined type to be used along a defined subtype", function () {
        expect(bind(MediaType, 'create', '*', 'plain'))
          .to.throw("cannot use a defined subtype with an undefined type");
      });

    });

    describe('#getType()', function () {

      it("should return the type when defined", function () {
        var mt = MediaType.create('text');
        expect(mt.getType()).to.equal('text');
      });

      it("should return undefined when no type is defined", function () {
        var mt = MediaType.create();
        expect(mt.getType()).to.be.undefined;
      });

    });

    describe('#getSubtype()', function () {

      it("should return the subtype when defined", function () {
        var mt = MediaType.create('image', 'jpeg');
        expect(mt.getSubtype()).to.equal('jpeg');
      });

      it("should return undefined when no subtype is defined", function () {
        var mt = MediaType.create();
        expect(mt.getSubtype()).to.be.undefined;
      });

    });

    describe('#toString()', function () {

      it("should include the specific subtype when defined", function () {
        var mt = MediaType.create('text', 'plain');
        expect(mt.toString()).to.equal('text/plain');
      });

      it("should use the wildcard '*' when type is not defined", function () {
        var mt = MediaType.create();
        expect(mt.toString()).to.equal('*/*');
      });

      it("should use the wildcard '*' when subtype is not defined", function () {
        var mt = MediaType.create('text');
        expect(mt.toString()).to.equal('text/*');
      });

    });

    describe('#matches()', function () {

      it("should return true when LHS' and RHS' type is undefined", function () {
        var lhs = MediaType.create();
        var rhs = MediaType.create();
        expect(lhs.matches(rhs)).to.be.true;
      });

      it("should return true when LHS' type is undefined", function () {
        var lhs = MediaType.create();
        var rhs = MediaType.create('text');
        expect(lhs.matches(rhs)).to.be.true;
      });

      it("should return false when RHS' type is undefined", function () {
        var lhs = MediaType.create('text');
        var rhs = MediaType.create();
        expect(lhs.matches(rhs)).to.be.false;
      });

      it("should return false when LHS' and RHS' type is different", function () {
        var lhs = MediaType.create('audio');
        var rhs = MediaType.create('text');
        expect(lhs.matches(rhs)).to.be.false;
      });

      context("when LHS' and RHS' type is defined and equal", function () {

        it("should return true when LHS' and RHS' subtype is undefined", function () {
          var lhs = MediaType.create('text');
          var rhs = MediaType.create('text');
          expect(lhs.matches(rhs)).to.be.true;
        });

        it("should return true when LHS' subtype is undefined", function () {
          var lhs = MediaType.create('text');
          var rhs = MediaType.create('text', 'plain');
          expect(lhs.matches(rhs)).to.be.true;
        });

        it("should return false when RHS' subtype is undefined", function () {
          var lhs = MediaType.create('text', 'plain');
          var rhs = MediaType.create('text');
          expect(lhs.matches(rhs)).to.be.false;
        });

        it("should return true when LHS' and RHS' subtype are equal", function () {
          var lhs = MediaType.create('text', 'plain');
          var rhs = MediaType.create('text', 'plain');
          expect(lhs.matches(rhs)).to.be.true;
        });

        it("should return false when LHS' and RHS' subtype are different", function () {
          var lhs = MediaType.create('text', 'plain');
          var rhs = MediaType.create('text', 'css');
          expect(lhs.matches(rhs)).to.be.false;
        });

      });

    });

  });

});
