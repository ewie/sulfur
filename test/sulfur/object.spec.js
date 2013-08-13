/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global afterEach, beforeEach, context, describe, it */

define([
  'shared',
  'sulfur/object'
], function ($shared, $object) {

  'use strict';

  var expect = $shared.expect;
  var sinon = $shared.sinon;
  var descriptor = $shared.descriptor;

  describe('sulfur.object', function () {

    var sandbox;

    beforeEach(function () {
      sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
      sandbox.restore();
    });

    describe('.create()', function () {

      it("should create an object using .prototype as prototype", function () {
        var obj = $object.create();
        expect($object.prototype).to.be.prototypeOf(obj);
      });

      it("should call .initialize() on the new object", function () {
        var spy = sandbox.spy($object.prototype, 'initialize');
        var obj = $object.create();
        expect(spy).to.be.calledOn(obj);
      });

      it("should pass all arguments to .initialize()", function () {
        var spy = sandbox.spy($object.prototype, 'initialize');
        var a = {};
        var b = {};
        $object.create(a, b);
        expect(spy).to.be.calledWithExactly(a, b);
      });

    });

    describe('.clone()', function () {

      it("should create a new object inheriting from this", function () {
        var obj = $object.clone();
        expect($object).to.be.prototypeOf(obj);
      });

      it("should derive .prototype", function () {
        var obj = $object.clone();
        expect($object.prototype).to.be.prototypeOf(obj.prototype);
      });

      it("should call .extend on the new object", function () {
        var spy = sandbox.spy($object, 'extend');
        var obj = $object.clone();
        expect(spy).to.be.calledOn(obj);
      });

      it("should pass all objects to .extend", function () {
        var spy = sandbox.spy($object, 'extend');
        var a = {};
        $object.clone(a);
        expect(spy).to.be.calledWithExactly(a);
      });

      context("when the rightmost argument is a function", function () {

        it("should invoke that function on the new object", function () {
          var spy = sandbox.spy();
          var obj = $object.clone(spy);
          expect(spy).to.be.calledOn(obj);
        });

        it("should pass the base object and all extension objects to that function", function () {
          var spy = sandbox.spy();
          var ext = {};
          $object.clone(ext, spy);
          expect(spy).to.be.calledWithExactly($object, ext);
        });

        context("when that function returns something", function () {

          it("should use the return value as rightmost extension", function () {
            var ext = {};
            var fn = function () { return ext; };
            var spy = sandbox.spy($object, 'extend');
            $object.clone(fn);
            expect(spy).to.be.calledWithExactly(ext);
          });

        });

      });

    });

    describe('.derive()', function () {

      it("should create an object inheriting all from this object", function () {
        var obj = $object.derive();
        expect($object).to.be.prototypeOf(obj);
      });

      it("should derive .prototype", function () {
        var obj = $object.derive();
        expect($object.prototype).to.be.prototypeOf(obj.prototype);
      });

      it("should call .clone", function () {
        var spy = sandbox.spy($object, 'clone');
        $object.derive();
        expect(spy).to.be.called;
      });

      it("should call .augment() on the objd object", function () {
        var spy = sandbox.spy($object, 'augment');
        var obj = $object.derive();
        expect(spy).to.be.calledOn(obj);
      });

      it("should pass all mixins to .augment()", function () {
        var a = {};
        var spy = sandbox.spy($object, 'augment');
        $object.derive(a);
        expect(spy).to.be.calledWithExactly(a);
      });

      context("when the last argument is a function", function () {

        it("should call the function on the objd object", function () {
          var spy = sandbox.spy();
          var obj = $object.derive(spy);
          expect(spy).to.be.calledOn(obj);
        });

        it("should receive the original object and all mixins as arguments", function () {
          var spy = sandbox.spy();
          var a = {};
          $object.derive(a, spy);
          expect(spy).to.be.calledWithExactly($object, a);
        });

        context("when the function returns an object", function () {

          it("should use that object as the rightmost mixin", function () {
            var a = {};
            var fn = function () { return a; };
            var spy = sandbox.spy($object, 'augment');
            $object.derive(fn);
            expect(spy).to.be.calledWithExactly(a);
          });

        });

      });

    });

    describe('.extend()', function () {

      var obj;

      beforeEach(function () {
        obj = $object.clone();
      });

      it("should return this", function () {
        expect(obj.extend()).to.equal(obj);
      });

      it("should extend the factory with the properties of the provided objects", function () {
        var a = { foo: {} };
        obj.extend(a);
        expect(obj.foo).to.equal(a.foo);
      });

      it("should treat objects to the right with higher precedence", function () {
        var a = { foo: {} };
        var b = { foo: {} };
        obj.extend(a, b);
        expect(obj.foo).to.equal(b.foo);
      });

      it("should define properties according to their descriptors", function () {
        var a = Object.create(null, {
          enum: {
            enumerable: true,
            value: {}
          },
          nonenum: {
            enumerable: false,
            value: {}
          }
        });
        obj.extend(a);
        expect(descriptor(obj, 'enum').enumerable).to.be.true;
        expect(descriptor(obj, 'nonenum').enumerable).to.be.false;
      });

      context("when an object has .prototype", function () {

        it("should call .augment with the given prototype", function () {
          var spy = sandbox.spy(obj, 'augment');
          var a = { prototype: { foo: {} } };
          obj.extend(a);
          expect(spy).to.be.calledWithExactly(a.prototype);
        });

      });

    });

    describe('.augment()', function () {

      var obj;

      beforeEach(function () {
        obj = $object.derive();
      });

      it("should return this", function () {
        expect(obj.augment()).to.equal(obj);
      });

      it("should extend .prototype with all properties of the given objects", function () {
        var a = { a: {} };
        obj.augment(a);
        expect(obj.prototype.a).to.exist;
      });

      it("should treat objects to the right with higher precedence", function () {
        var a = { x: {} };
        var b = { x: {} };
        obj.augment(a, b);
        expect(obj.prototype.x).to.equal(b.x);
      });

      it("should define properties according to their descriptors", function () {
        var a = Object.create(null, {
          enumerable: {
            enumerable: true,
            value: {}
          },
          nonEnumerable: {
            enumerable: false,
            value: {}
          }
        });
        obj.augment(a);
        expect(descriptor(obj.prototype, 'enumerable').enumerable).to.be.true;
        expect(descriptor(obj.prototype, 'nonEnumerable').enumerable).to.be.false;
      });

    });

  });

});
