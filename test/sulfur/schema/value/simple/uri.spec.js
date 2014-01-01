/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global afterEach, beforeEach, describe, it */

define([
  'shared',
  'sulfur/schema/value/simple',
  'sulfur/schema/value/simple/uri'
], function (shared, SimpleValue, UriValue) {

  'use strict';

  var expect = shared.expect;
  var sinon = shared.sinon;
  var bind = shared.bind;

  describe('sulfur/schema/value/simple/uri', function () {

    it("should be derived from sulfur/schema/value/simple", function () {
      expect(SimpleValue).to.be.prototypeOf(UriValue);
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
        var spy = sandbox.spy(UriValue, 'create');
        var s = 'http://example.org/foo';
        var u = UriValue.parse(s);
        expect(spy)
          .to.be.calledWith(s)
          .to.have.returned(sinon.match.same(u));
      });

    });

    describe('#initialize()', function () {

      it("should accept a valid URI", function () {
        var s = 'http://example.org';
        var u = UriValue.parse(s);
        expect(u).to.eql(UriValue.create(s));
      });

      it("should reject an invalid URI", function () {
        expect(bind(UriValue, 'parse', ''))
          .to.throw("invalid URI");
      });

    });

    describe('#value', function () {

      it("should return the URI", function () {
        var s = 'urn:example:foo';
        var u = UriValue.create(s);
        expect(u.value).to.equal(s);
      });

    });

    describe('#length', function () {

      it("should return the length of the URI", function () {
        var s = 'foo';
        var u = UriValue.create(s);
        expect(u.length).to.equal(s.length);
      });

    });

    describe('#eq()', function () {

      it("should return true when #value is identical", function () {
        var u = UriValue.create('x');
        var other = UriValue.create('x');
        expect(u.eq(other)).to.be.true;
      });

      it("should return false when #value is different", function () {
        var u = UriValue.create('x');
        var other = UriValue.create('y');
        expect(u.eq(other)).to.be.false;
      });

    });

    describe('#toString()', function () {

      it("should return the URI", function () {
        var s = 'http://example.org';
        var u = UriValue.create(s);
        expect(u.toString()).to.equal(s);
      });

    });

  });

});
