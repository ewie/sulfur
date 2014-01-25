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
  'sulfur/util/promisedFile'
], function (shared, PromisedFile) {

  'use strict';

  var expect = shared.expect;
  var sinon = shared.sinon;

  describe('sulfur/util/promisedFile', function () {

    var sandbox;

    beforeEach(function () {
      sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
      sandbox.restore();
    });

    describe('#file', function () {

      it("should return the file object", function () {
        var file = {};
        var pf = PromisedFile.create(file);
        expect(pf.file).to.equal(file);
      });

    });

    describe('#blob', function () {

      it("should return undefined when the file is not loaded", function () {
        var pf = PromisedFile.create();
        expect(pf.blob).to.be.undefined;
      });

      it("should return the data of the loaded file", function () {
        var blob = {};
        sandbox.stub(FileReader.prototype, 'readAsArrayBuffer', function () {
          this.onload({ target: { result: blob } });
        });
        var pf = PromisedFile.create();
        pf.load();
        expect(pf.blob).to.equal(blob);
      });

    });

    describe('#isLoaded', function () {

      it("should return false when not loaded", function () {
        var pf = PromisedFile.create();
        expect(pf.isLoaded).to.be.false;
      });

      it("should return true when loaded", function () {
        var blob = {};
        sandbox.stub(FileReader.prototype, 'readAsArrayBuffer', function () {
          this.onload({ target: { result: blob } });
        });
        var pf = PromisedFile.create();
        pf.load();
        expect(pf.isLoaded).to.be.true;
      });

    });

    describe('#load()', function () {

      var blob;
      var readSpy;
      var pf;
      var file;

      beforeEach(function () {
        file = {};
        pf = PromisedFile.create(file);

        blob = {};
        readSpy = sandbox.stub(FileReader.prototype, 'readAsArrayBuffer', function () {
          this.onload({ target: { result: blob } });
        });
      });

      it("should invoke the callback when loaded", function () {
        pf.load();
        readSpy.reset();
        var spy = sinon.spy(function (pf) {
          expect(pf.isLoaded).to.be.true;
        });
        pf.load(spy);
        expect(readSpy).to.not.be.called;
        expect(spy).to.be.calledWith(sinon.match.same(pf));
      });

      context("when not loaded", function () {

        it("should load the file data", function () {
          pf.load();
          expect(readSpy).to.be.calledWith(sinon.match.same(file));
          expect(pf.blob).to.equal(blob);
        });

        it("should invoke the callback when loaded", function () {
          var spy = sinon.spy(function (pf) {
            expect(pf.isLoaded).to.be.true;
          });
          pf.load(spy);
          expect(spy).to.be.calledWith(sinon.match.same(pf));
        });

      });

    });

  });

});
