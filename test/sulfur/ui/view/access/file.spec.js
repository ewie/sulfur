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
  'sulfur/ui/view/access/error',
  'sulfur/ui/view/access/file'
], function (shared, ErrorAccess, FileAccess) {

  'use strict';

  var expect = shared.expect;
  var sinon = shared.sinon;
  var returns = shared.returns;

  describe('sulfur/ui/access/file', function () {

    var sandbox;

    beforeEach(function () {
      sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
      sandbox.restore();
    });

    describe('#initialize()', function () {

      it("should use a sulfur/ui/view/access/error on the given element", function () {
        var spy = sandbox.stub(ErrorAccess, 'create').returns({});
        var element = {};
        FileAccess.create(element);
        expect(spy).to.be.calledWith(sinon.match.same(element));
      });

    });

    describe('#error', function () {

      it("should delegate to the error access' #error=", function () {
        var error = {};
        var errorAccess = { error: error };
        sandbox.stub(ErrorAccess, 'create').returns(errorAccess);
        var access = FileAccess.create();
        expect(access.error).to.equal(error);
      });

    });

    describe('#error=', function () {

      it("should delegate to the error access' #error=", function () {
        var errorAccess = {};
        sandbox.stub(ErrorAccess, 'create').returns(errorAccess);
        var access = FileAccess.create();
        var error = {};
        access.error = error;
        expect(errorAccess.error).to.equal(error);
      });

    });

    describe('#file', function () {

      it("should return null the element has no file", function () {
        var element = { files: { item: returns(null) } };
        sandbox.stub(ErrorAccess, 'create').returns({});
        var access = FileAccess.create(element);
        expect(access.file).to.be.null;
      });

      it("should return the element's file when present", function () {
        var file = {};
        var element = { files: { item: returns(file) } };
        sandbox.stub(ErrorAccess, 'create').returns({});
        var access = FileAccess.create(element);
        expect(access.file).to.equal(file);
      });

    });

  });

});
