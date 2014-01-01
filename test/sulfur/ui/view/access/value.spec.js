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
  'sulfur/ui/view/access/value'
], function (shared, ErrorAccess, ValueAccess) {

  'use strict';

  var expect = shared.expect;
  var sinon = shared.sinon;
  var returns = shared.returns;

  describe('sulfur/ui/access/value', function () {

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
        ValueAccess.create(element);
        expect(spy).to.be.calledWith(sinon.match.same(element));
      });

    });

    describe('#error', function () {

      it("should delegate to the error access' #error=", function () {
        var error = {};
        var errorAccess = { error: error };
        sandbox.stub(ErrorAccess, 'create').returns(errorAccess);
        var access = ValueAccess.create();
        expect(access.error).to.equal(error);
      });

    });

    describe('#error=', function () {

      it("should delegate to the error access' #error=", function () {
        var errorAccess = {};
        sandbox.stub(ErrorAccess, 'create').returns(errorAccess);
        var access = ValueAccess.create();
        var error = {};
        access.error = error;
        expect(errorAccess.error).to.equal(error);
      });

    });

    describe('#value', function () {

      it("should return the element's value", function () {
        var element = { value: {} };
        sandbox.stub(ErrorAccess, 'create').returns({});
        var access = ValueAccess.create(element);
        var v = access.value;
        expect(v).to.equal(element.value);
      });

    });

    describe('#value=', function () {

      it("should set the element's value", function () {
        var element = {};
        sandbox.stub(ErrorAccess, 'create').returns({});
        var access = ValueAccess.create(element);
        var v = {};
        access.value = v;
        expect(element.value).to.equal(v);
      });

      it("should not set the element's value when identical", function () {
        var element = {};
        sandbox.stub(ErrorAccess, 'create').returns({});
        var access = ValueAccess.create(element);
        access.value = 'foo';
        var spy = sinon.spy();
        Object.defineProperty(element, 'value', {
          set: spy,
          get: returns('foo')
        });
        access.value = 'foo';
        expect(spy).to.not.be.called;
      });

    });

  });

});
