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
  'sulfur/ui/view/access/checkbox'
], function (shared, ErrorAccess, CheckboxAccess) {

  'use strict';

  var expect = shared.expect;
  var sinon = shared.sinon;

  describe('sulfur/ui/access/checkbox', function () {

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
        CheckboxAccess.create(element);
        expect(spy).to.be.calledWith(sinon.match.same(element));
      });

    });

    describe('#error', function () {

      it("should delegate to the error access' #error=", function () {
        var error = {};
        var errorAccess = { error: error };
        sandbox.stub(ErrorAccess, 'create').returns(errorAccess);
        var access = CheckboxAccess.create();
        expect(access.error).to.equal(error);
      });

    });

    describe('#error=', function () {

      it("should delegate to the error access' #error=", function () {
        var errorAccess = {};
        sandbox.stub(ErrorAccess, 'create').returns(errorAccess);
        var access = CheckboxAccess.create();
        var error = {};
        access.error = error;
        expect(errorAccess.error).to.equal(error);
      });

    });

    describe('#value', function () {

      it("should return the element's property 'checked'", function () {
        var element = { checked: {} };
        sandbox.stub(ErrorAccess, 'create').returns({});
        var access = CheckboxAccess.create(element);
        var v = access.value;
        expect(v).to.equal(element.checked);
      });

    });

    describe('#value=', function () {

      it("should set the element's property 'checked'", function () {
        var element = { };
        sandbox.stub(ErrorAccess, 'create').returns({});
        var access = CheckboxAccess.create(element);
        var v = {};
        access.value = v;
        expect(element.checked).to.equal(v);
      });

    });

  });

});
