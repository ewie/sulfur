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
  'sulfur/schema/value/simple/fileRef'
], function (shared, SimpleValue, FileRefValue) {

  'use strict';

  var expect = shared.expect;
  var sinon = shared.sinon;

  describe('sulfur/schema/value/simple/fileRef', function () {

    it("should be derived from sulfur/schema/value/simple", function () {
      expect(SimpleValue).to.be.prototypeOf(FileRefValue);
    });

    describe('.parse()', function () {

      var sandbox;

      beforeEach(function () {
        sandbox = sinon.sandbox.create();
      });

      afterEach(function () {
        sandbox.restore();
      });

      it("should delegate to .create()", function () {
        var spy = sandbox.spy(FileRefValue, 'create');
        var s = 'bar';
        var fr = FileRefValue.parse(s);
        expect(spy)
          .to.be.calledWith(s)
          .to.have.returned(sinon.match.same(fr));
      });

    });

    describe('#value', function () {

      it("should return the ID", function () {
        var value = 'xyz';
        var fr = FileRefValue.create(value);
        expect(fr.value).to.equal(value);
      });

    });

    describe('#file', function () {

      it("should return the file when defined", function () {
        var file = {};
        var fr = FileRefValue.create('123', file);
        expect(fr.file).to.equal(file);
      });

      it("should return undefined when no file is defined", function () {
        var fr = FileRefValue.create('abc');
        expect(fr.file).to.be.undefined;
      });

    });

    describe('#eq()', function () {

      it("should return true when #value is identical", function () {
        var fr = FileRefValue.create('x');
        var other = FileRefValue.create('x');
        expect(fr.eq(other)).to.be.true;
      });

      it("should return false when #value is different", function () {
        var fr = FileRefValue.create('x');
        var other = FileRefValue.create('y');
        expect(fr.eq(other)).to.be.false;
      });

    });

    describe('#toString()', function () {

      it("should return #value", function () {
        var value = 'foo';
        var fr = FileRefValue.create(value);
        expect(fr.toString()).to.equal(value);
      });

    });

  });

});
