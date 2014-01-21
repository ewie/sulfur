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

      it("should parse, translate and compile the source", function () {
        var parseSpy = sandbox.spy(Regex, 'parse');
        var translateSpy = sandbox.spy(Regex.prototype, 'translate');
        var compileSpy = sandbox.spy(Regex.prototype, 'compile');
        PatternValue.create('.');
        expect(parseSpy).to.be.calledWith('.');
        expect(translateSpy).to.be.calledOn(parseSpy.getCall(0).returnValue);
        expect(compileSpy).to.be.calledOn(translateSpy.getCall(0).returnValue);
      });

    });

    describe('#source', function () {

      it("should return the source", function () {
        var p = PatternValue.create('[0-9]');
        expect(p.source).to.equal('[0-9]');
      });

    });

    describe('#re', function () {

      it("should return the compiled pattern", function () {
        var compileSpy = sandbox.spy(Regex.prototype, 'compile');
        var p = PatternValue.create('.');
        expect(compileSpy).to.have.returned(sinon.match.same(p.re));
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
        var p = PatternValue.create('.');
        p.test();
        expect(testSpy).to.be.calledOn(sinon.match.same(p.re));
      });

      it("should pass the string to RegExp.prototype.test", function () {
        var testSpy = sandbox.spy(RegExp.prototype, 'test');
        var p = PatternValue.create('.');
        p.test('x');
        expect(testSpy).to.be.calledWith('x');
      });

    });

    describe('#containsGroupWithSurrogateCodepoints()', function () {

      it("should delegate to .containsGroupWithSurrogateCodepoints() on the translated pattern", function () {
        var translateSpy = sandbox.spy(Regex.prototype, 'translate');
        var p = PatternValue.create('.');
        var tre = translateSpy.getCall(0).returnValue;
        var spy = sinon.spy(tre, 'containsGroupWithSurrogateCodepoints');
        var r = p.containsGroupWithSurrogateCodepoints();
        expect(spy).to.have.returned(r);
      });

    });

    describe('#containsEmptyGroup()', function () {

      it("should delegate to .containsGroupWithSurrogateCodepoints() on the translated pattern", function () {
        var translateSpy = sandbox.spy(Regex.prototype, 'translate');
        var p = PatternValue.create('.');
        var tre = translateSpy.getCall(0).returnValue;
        var spy = sinon.spy(tre, 'containsEmptyGroup');
        var r = p.containsEmptyGroup();
        expect(spy).to.have.returned(r);
      });

    });

  });

});
