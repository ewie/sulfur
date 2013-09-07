/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global afterEach, beforeEach, describe, it */

define([
  'shared',
  'sulfur/schema/pattern',
  'sulfur/schema/regex'
], function ($shared, $pattern, $regex) {

  'use strict';

  var expect = $shared.expect;
  var sinon = $shared.sinon;
  var bind = $shared.bind;

  describe('sulfur/schema/pattern', function () {

    var sandbox;

    beforeEach(function () {
      sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
      sandbox.restore();
    });

    describe('.isValidLiteral()', function () {

      it("should call sulfur/schema/regex.parse() with the given string", function () {
        var spy = sandbox.spy($regex, 'parse');
        var s = '.';
        $pattern.isValidLiteral(s);
        expect(spy).to.be.calledWith(s);
      });

      it("should return true if sulfur/schema/regex.parse() does not throw", function () {
        sandbox.stub($regex, 'parse');
        expect($pattern.isValidLiteral()).to.be.true;
      });

      it("should return false if sulfur/schema/regex.parse() throws", function () {
        sandbox.stub($regex, 'parse').throws();
        expect($pattern.isValidLiteral()).to.be.false;
      });

    });

    describe('#initialize()', function () {

      it("should compile the source", function () {
        var spy = sandbox.spy($regex, 'compile');
        $pattern.create('.');
        expect(spy).to.be.calledWith('.');
      });

      it("should throw when sulfur/schema/regex.compile throws", function () {
        sandbox.stub($regex, 'compile').throws(new Error("invalid for testing purposes"));
        expect(bind($pattern, 'create', '.'))
          .to.throw('invalid pattern "." (error: invalid for testing purposes)');
      });

    });

    describe('#toLiteral()', function () {

      it("should return the pattern's source", function () {
        var p = $pattern.create('[a-z]');
        expect(p.toLiteral()).to.equal('[a-z]');
      });

    });

    describe('#test()', function () {

      it("should return true if the pattern matches the string", function () {
        var p = $pattern.create('[a-z]');
        expect(p.test('a')).to.be.true;
      });

      it("should return false if the pattern does not match the string", function () {
        var p = $pattern.create('[a-z]');
        expect(p.test('A')).to.be.false;
      });

      it("should call RegExp.prototype.test on the compiled pattern", function () {
        var testSpy = sandbox.spy(RegExp.prototype, 'test');
        var compileSpy = sandbox.spy($regex, 'compile');
        var p = $pattern.create('.');
        p.test();
        expect(testSpy).to.be.calledOn(compileSpy.getCall(0).returnValue);
      });

      it("should pass the string to RegExp.prototype.test", function () {
        var testSpy = sandbox.spy(RegExp.prototype, 'test');
        var p = $pattern.create('.');
        p.test('x');
        expect(testSpy).to.be.calledWith('x');
      });

    });

  });

});
