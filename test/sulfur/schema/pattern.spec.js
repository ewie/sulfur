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
], function (shared, Pattern, Regex) {

  'use strict';

  var expect = shared.expect;
  var sinon = shared.sinon;
  var bind = shared.bind;

  describe('sulfur/schema/pattern', function () {

    var sandbox;

    beforeEach(function () {
      sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
      sandbox.restore();
    });

    describe('#initialize()', function () {

      it("should compile the source", function () {
        var spy = sandbox.spy(Regex, 'compile');
        Pattern.create('.');
        expect(spy).to.be.calledWith('.');
      });

      it("should throw when sulfur/schema/regex.compile throws", function () {
        sandbox.stub(Regex, 'compile').throws(new Error("invalid for testing purposes"));
        expect(bind(Pattern, 'create', '.'))
          .to.throw('invalid pattern "." (error: invalid for testing purposes)');
      });

    });

    describe('#toString()', function () {

      it("should return the pattern's source", function () {
        var p = Pattern.create('[a-z]');
        expect(p.toString()).to.equal('[a-z]');
      });

    });

    describe('#test()', function () {

      it("should return true if the pattern matches the string", function () {
        var p = Pattern.create('[a-z]');
        expect(p.test('a')).to.be.true;
      });

      it("should return false if the pattern does not match the string", function () {
        var p = Pattern.create('[a-z]');
        expect(p.test('A')).to.be.false;
      });

      it("should call RegExp.prototype.test on the compiled pattern", function () {
        var testSpy = sandbox.spy(RegExp.prototype, 'test');
        var compileSpy = sandbox.spy(Regex, 'compile');
        var p = Pattern.create('.');
        p.test();
        expect(testSpy).to.be.calledOn(compileSpy.getCall(0).returnValue);
      });

      it("should pass the string to RegExp.prototype.test", function () {
        var testSpy = sandbox.spy(RegExp.prototype, 'test');
        var p = Pattern.create('.');
        p.test('x');
        expect(testSpy).to.be.calledWith('x');
      });

    });

  });

});
