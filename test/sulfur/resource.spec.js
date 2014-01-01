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
  'sulfur/resource'
], function (shared, Resource) {

  'use strict';

  var expect = shared.expect;
  var sinon = shared.sinon;
  var bind = shared.bind;

  describe('sulfur/resource', function () {

    describe('.isValidName()', function () {

      it("should return true when the name is valid", function () {
        expect(Resource.isValidName('Xy0-_')).to.be.true;
      });

      it("should return false when the name is empty", function () {
        expect(Resource.isValidName('')).to.be.false;
      });

      it("should return false when the name contains white space", function () {
        expect(Resource.isValidName('x y')).to.be.false;
      });

      it("should return false when the name contains any slash", function () {
        expect(Resource.isValidName('x/y')).to.be.false;
      });

    });

    describe('#initialize()', function () {

      var sandbox;

      beforeEach(function () {
        sandbox = sinon.sandbox.create();
      });

      afterEach(function () {
        sandbox.restore();
      });

      it("should reject when .isValidName() returns false for the given name", function () {
        var spy = sandbox.stub(Resource, 'isValidName').returns(false);
        var name = {};
        expect(bind(Resource, 'create', name))
          .to.throw("expecting a valid name");
        expect(spy).to.be.calledWith(name);
      });

    });

    describe('#name', function () {

      it("should return the name", function () {
        var name = 'foo';
        var r = Resource.create(name);
        expect(r.name).to.equal(name);
      });

    });

    describe('#schema', function () {

      it("should return the schema", function () {
        var schema = {};
        var r = Resource.create('foo', schema);
        expect(r.schema).to.equal(schema);
      });

    });

  });

});
