/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global afterEach, beforeEach, describe, it */

define([
  'shared',
  'sulfur/ui/view/access/dropdown',
  'sulfur/ui/view/access/error',
  'sulfur/ui/view/dropdown'
], function (shared, DropdownAccess, ErrorAccess, Dropdown) {

  'use strict';

  var expect = shared.expect;
  var sinon = shared.sinon;

  describe('sulfur/ui/access/dropdown', function () {

    var sandbox;
    var element;

    beforeEach(function () {
      sandbox = sinon.sandbox.create();
      var parentElement = document.createElement('div');
      element = document.createElement('div');
      parentElement.appendChild(element);
    });

    afterEach(function () {
      sandbox.restore();
    });

    describe('#initialize()', function () {

      it("should use a sulfur/ui/view/access/error on the given element", function () {
        var spy = sandbox.stub(ErrorAccess, 'create').returns({});
        DropdownAccess.create(element);
        expect(spy).to.be.calledWith(sinon.match.same(element));
      });

    });

    describe('#publisher', function () {

      it("should return the underlying dropdown's publisher", function () {
        var dd = { publisher: {} };
        sandbox.stub(Dropdown, 'create').returns(dd);
        var access = DropdownAccess.create(element);
        expect(access.publisher).to.equal(dd.publisher);
      });

    });

    describe('#error', function () {

      it("should delegate to the error access' #error=", function () {
        var error = {};
        var errorAccess = { error: error };
        sandbox.stub(ErrorAccess, 'create').returns(errorAccess);
        var access = DropdownAccess.create(element);
        expect(access.error).to.equal(error);
      });

    });

    describe('#error=', function () {

      it("should delegate to the error access' #error=", function () {
        var errorAccess = {};
        sandbox.stub(ErrorAccess, 'create').returns(errorAccess);
        var access = DropdownAccess.create(element);
        var error = {};
        access.error = error;
        expect(errorAccess.error).to.equal(error);
      });

    });

    describe('#value', function () {

      it("should delegate to the dropdown's #value", function () {
        var dd = { value: {} };
        sandbox.stub(Dropdown, 'create').returns(dd);
        var accessor = DropdownAccess.create(element);
        expect(accessor.value).to.equal(dd.value);
      });

    });

    describe('#value=', function () {

      it("should delegate to the dropdown's #value=", function () {
        var dd = {};
        sandbox.stub(Dropdown, 'create').returns(dd);
        var accessor = DropdownAccess.create(element);
        var value = {};
        accessor.value = value;
        expect(dd.value).to.equal(value);
      });

    });

    describe('#values', function () {

      it("should delegate to the dropdown's #values", function () {
        var dd = { values: {} };
        sandbox.stub(Dropdown, 'create').returns(dd);
        var accessor = DropdownAccess.create(element);
        expect(accessor.values).to.equal(dd.values);
      });

    });

    describe('#values=', function () {

      it("should delegate to the dropdown's #values=", function () {
        var dd = {};
        sandbox.stub(Dropdown, 'create').returns(dd);
        var accessor = DropdownAccess.create(element);
        var values = {};
        accessor.values = values;
        expect(dd.values).to.equal(values);
      });

    });

  });

});
