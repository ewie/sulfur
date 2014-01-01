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
  'sulfur/schema/regex',
  'sulfur/schema/value/simple',
  'sulfur/schema/value/simple/pattern'
], function (shared, Regex, SimpleValue, PatternValue) {

  'use strict';

  var expect = shared.expect;
  var sinon = shared.sinon;
  var bind = shared.bind;

  describe('sulfur/schema/value/simple/pattern', function () {

    var sandbox;

    beforeEach(function () {
      sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
      sandbox.restore();
    });

    it("should be derived from sulfur/schema/value/simple", function () {
      expect(SimpleValue).to.be.prototypeOf(PatternValue);
    });

    describe('.parse()', function () {

      it("should delegate to .create()", function () {
        var spy = sandbox.spy(PatternValue, 'create');
        var s = '[a-z]';
        var p = PatternValue.parse(s);
        expect(spy)
          .to.be.calledWith(s)
          .to.have.returned(sinon.match.same(p));
      });

    });

    describe('#initialize()', function () {

      it("should compile the source", function () {
        var spy = sandbox.spy(Regex, 'compile');
        PatternValue.create('.');
        expect(spy).to.be.calledWith('.');
      });

      it("should throw when sulfur/schema/regex.compile throws", function () {
        sandbox.stub(Regex, 'compile').throws(new Error("invalid for testing purposes"));
        expect(bind(PatternValue, 'create', '.'))
          .to.throw('invalid pattern "." (error: invalid for testing purposes)');
      });

    });

    describe('#source', function () {

      it("should return the source", function () {
        var p = PatternValue.create('[0-9]');
        expect(p.source).to.equal('[0-9]');
      });

    });

    describe('#eq()', function () {

      it("should return true when #source is identical", function () {
        var p = PatternValue.create('[a-z]');
        var other = PatternValue.create('[a-z]');
        expect(p.eq(other)).to.be.true;
      });

      it("should return false when #source is different", function () {
        var p = PatternValue.create('[a-z]');
        var other = PatternValue.create('[A-Z]');
        expect(p.eq(other)).to.be.false;
      });

    });

    describe('#toString()', function () {

      it("should return the pattern's source", function () {
        var p = PatternValue.create('[a-z]');
        expect(p.toString()).to.equal('[a-z]');
      });

    });

    describe('#test()', function () {

      it("should return true if the pattern matches the string", function () {
        var p = PatternValue.create('[a-z]');
        expect(p.test('a')).to.be.true;
      });

      it("should return false if the pattern does not match the string", function () {
        var p = PatternValue.create('[a-z]');
        expect(p.test('A')).to.be.false;
      });

      it("should call RegExp.prototype.test on the compiled pattern", function () {
        var testSpy = sandbox.spy(RegExp.prototype, 'test');
        var compileSpy = sandbox.spy(Regex, 'compile');
        var p = PatternValue.create('.');
        p.test();
        expect(testSpy).to.be.calledOn(compileSpy.getCall(0).returnValue);
      });

      it("should pass the string to RegExp.prototype.test", function () {
        var testSpy = sandbox.spy(RegExp.prototype, 'test');
        var p = PatternValue.create('.');
        p.test('x');
        expect(testSpy).to.be.calledWith('x');
      });

    });

  });

});
