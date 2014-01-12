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

      it("should reject when .isValidName() returns false for the given record collection name", function () {
        var name = {};
        var spy = sandbox.stub(Resource, 'isValidName', function (x) { return x !== name });
        expect(bind(Resource, 'create', null, name, 'foo'))
          .to.throw("expecting a valid record collection name");
        expect(spy).to.be.calledWith(sinon.match.same(name));
      });

      it("should reject when .isValidName() returns false for the given file collection name", function () {
        var name = {};
        var spy = sandbox.stub(Resource, 'isValidName', function (x) { return x !== name });
        expect(bind(Resource, 'create', null, 'foo', name))
          .to.throw("expecting a valid file collection name");
        expect(spy).to.be.calledWith(sinon.match.same(name));
      });

      it("should reject when record and file collection names are equal", function () {
        expect(bind(Resource, 'create', null, 'foo', 'foo'))
          .to.throw("expecting different record and file collection names");
      });

    });

    describe('#schema', function () {

      it("should return the schema", function () {
        var schema = {};
        var r = Resource.create(schema, 'foo', 'bar');
        expect(r.schema).to.equal(schema);
      });

    });

    describe('#recordCollectionName', function () {

      it("should return the name", function () {
        var name = 'foo';
        var r = Resource.create(null, name, 'bar');
        expect(r.recordCollectionName).to.equal(name);
      });

    });

    describe('#fileCollectionName', function () {

      it("should return the name", function () {
        var name = 'bar';
        var r = Resource.create(null, 'foo', name);
        expect(r.fileCollectionName).to.equal(name);
      });

    });

  });

});
