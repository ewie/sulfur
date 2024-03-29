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
  'sulfur/util'
], function (shared, util) {

  'use strict';

  var expect = shared.expect;
  var sinon = shared.sinon;
  var bind = shared.bind;
  var returns = shared.returns;

  describe('sulfur/util', function () {

    describe('.bind()', function () {

      it("should return a function", function () {
        expect(util.bind({ bar: function () {} }, 'bar')).to.be.a('function');
      });

      it("should prepend optional arguments", function () {
        var obj = { foo: sinon.spy() };
        var arg1 = {};
        var arg2 = {};
        var fn = util.bind(obj, 'foo', arg1);
        fn(arg2);
        expect(obj.foo).to.be.calledWith(
          sinon.match.same(arg1),
          sinon.match.same(arg2));
      });

      describe("the returned function", function () {

        it("should bind the object to the method", function () {
          var obj = { foo: sinon.spy() };
          var fn = util.bind(obj, 'foo');
          fn();
          expect(obj.foo).to.be.calledOn(obj);
        });

        it("should pass all arguments to the bound method", function () {
          var obj = { foo: sinon.spy() };
          var fn = util.bind(obj, 'foo');
          var arg = {};
          fn(arg);
          expect(obj.foo).to.be.calledWith(sinon.match.same(arg));
        });

      });

    });

    describe('.bipart()', function () {

      it("should pass each array item and index to a predicate function", function () {
        var predicate = sinon.spy();
        var ary = [{}, {}, {}];
        util.bipart(ary, predicate);
        ary.forEach(function (item, i) {
          var call = predicate.getCall(i);
          expect(call.args[0]).to.equal(item);
          expect(call.args[1]).to.equal(i);
        });
      });

      it("should reject equal property names", function () {
        expect(bind(util, 'bipart', [], null, 'foo', 'foo'))
          .to.throw("expecting different property names");
      });

      it("should use default to property 'true'", function () {
        var predicate = function (n) { return n };
        var ary = [true];
        var part = util.bipart(ary, predicate);
        expect(part.true).to.have.lengthOf(1);
      });

      it("should use default to property 'false'", function () {
        var predicate = function (n) { return n };
        var ary = [false];
        var part = util.bipart(ary, predicate);
        expect(part.false).to.have.lengthOf(1);
      });

      it("should put all items for which a predicate evaluates truthy in an array under the given property", function () {
        var predicate = function (n) { return n % 2 };
        var ary = [1, 2, 3];
        var part = util.bipart(ary, predicate, 't');
        expect(part.t).to.eql([ 1, 3 ]);
      });

      it("should put all items for which a predicate evaluates falsy in an array under the given property", function () {
        var predicate = function (n) { return n % 2 };
        var ary = [1, 2, 3];
        var part = util.bipart(ary, predicate, null, 'f');
        expect(part.f).to.eql([ 2 ]);
      });

    });

    describe('.first()', function () {

      it("should pass each array item and index to a predicate function", function () {
        var predicate = sinon.spy();
        var ary = [{}, {}, {}];
        util.first(ary, predicate);
        ary.forEach(function (item, i) {
          var call = predicate.getCall(i);
          expect(call.args[0]).to.equal(item);
          expect(call.args[1]).to.equal(i);
        });
      });

      it("should return undefined when no item satisfies the predicate", function () {
        expect(util.first([1], function () {})).to.be.undefined;
      });

      it("should return the first item for which a predicate evaluates truthy", function () {
        var predicate = function (x) { return x.n % 2; };
        var ary = [0, 1, 2].map(function (n) { return { n: n }; });
        var x = util.first(ary, predicate);
        expect(x).to.equal(ary[1]);
      });

    });

    describe('.isDefined()', function () {

      it("should return true when the argument is not undefined", function () {
        expect(util.isDefined(0)).to.be.true;
      });

      it("should return false when the argument is undefined", function () {
        expect(util.isDefined(undefined)).to.be.false;
      });

    });

    describe('.isUndefined()', function () {

      it("should return true when the argument is undefined", function () {
        expect(util.isUndefined(undefined)).to.be.true;
      });

      it("should return false when the argument is not undefined", function () {
        expect(util.isUndefined(0)).to.be.false;
      });

    });

    describe('.isInteger()', function () {

      it("should accept an integer value", function () {
        expect(util.isInteger(1)).to.be.true;
      });

      it("should reject a value not of type 'number'", function () {
        expect(util.isInteger('1')).to.be.false;
      });

      it("should reject a value not equal to its rounded value", function () {
        expect(util.isInteger(1.2)).to.be.false;
      });

      it("should reject a value equal to 2^53", function () {
        expect(util.isInteger(Math.pow(2, 53))).to.be.false;
      });

      it("should reject a value greater than 2^53", function () {
        expect(util.isInteger(Math.pow(2, 54))).to.be.false;
      });

      it("should reject a value equal to -2^53", function () {
        expect(util.isInteger(-Math.pow(2, 53))).to.be.false;
      });

      it("should reject a value less than -2^53", function () {
        expect(util.isInteger(-Math.pow(2, 54))).to.be.false;
      });

    });

    describe('.method()', function () {

      it("should return a function", function () {
        expect(util.method()).to.be.a('function');
      });

      describe("the returned function", function () {

        it("should call the named method on an object provided as argument", function () {
          var obj = { foo: sinon.spy() };
          var fn = util.method('foo');
          fn(obj);
          expect(obj.foo).to.be.calledOn(obj);
        });

        it("should return the result of calling the method", function () {
          var result = {};
          var obj = { foo: function () { return result; } };
          var fn = util.method('foo');
          expect(fn(obj)).to.equal(result);
        });

      });

    });

    describe('.once()', function () {

      it("should return a function calling the given function on the first call", function () {
        var obj = {};
        var arg = {};
        var f = sinon.stub().returns({});
        var g = util.once(f);
        var r = g.call(obj, arg);
        expect(f)
          .to.be.calledOn(sinon.match.same(obj))
          .to.be.calledWith(sinon.match.same(arg))
          .to.have.returned(sinon.match.same(r));
      });

      it("should return the result of the given function on future calls", function () {
        var f = sinon.stub().returns({});
        var g = util.once(f);
        var r = g({});
        var q = g({});
        expect(f).to.be.calledOnce;
        expect(r).to.equal(q);
      });

    });

    describe('.property()', function () {

      it("should return a function", function () {
        expect(util.property()).to.be.a('function');
      });

      describe("the returned function", function () {

        it("should return the named property of an object provided as argument", function () {
          var obj = { foo: {} };
          var fn = util.property('foo');
          expect(fn(obj)).to.equal(obj.foo);
        });

      });

    });

    describe('.request()', function () {

      var sandbox;
      var server;

      beforeEach(function () {
        sandbox = sinon.sandbox.create();
        server = sinon.fakeServer.create();
      });

      afterEach(function () {
        server.restore();
        sandbox.restore();
      });

      it("should invoke callback 'success' when request completes with 2xx", function () {
        var xhrSpy = sandbox.spy(XMLHttpRequest.prototype, 'send');
        server.respondWith('GET', 'http://example.org', [ 200, {}, '' ]);
        var spy = sinon.spy();
        util.request({
          url: 'http://example.org',
          method: 'GET',
          success: spy
        });
        var xhr = xhrSpy.getCall(0).thisValue;
        server.respond();
        expect(spy).to.be.calledWith(sinon.match.same(xhr));
      });

      it("should invoke callback 'fail' when request completes with 4xx", function () {
        var xhrSpy = sandbox.spy(XMLHttpRequest.prototype, 'send');
        server.respondWith('GET', 'http://example.org', [ 400, {}, '' ]);
        var spy = sinon.spy();
        util.request({
          url: 'http://example.org',
          method: 'GET',
          fail: spy
        });
        var xhr = xhrSpy.getCall(0).thisValue;
        server.respond();
        expect(spy).to.be.calledWith(sinon.match.same(xhr));
      });

      it("should invoke callback 'fail' when request completes with 5xx", function () {
        var xhrSpy = sandbox.spy(XMLHttpRequest.prototype, 'send');
        server.respondWith('GET', 'http://example.org', [ 500, {}, '' ]);
        var spy = sinon.spy();
        util.request({
          url: 'http://example.org',
          method: 'GET',
          fail: spy
        });
        var xhr = xhrSpy.getCall(0).thisValue;
        server.respond();
        expect(spy).to.be.calledWith(sinon.match.same(xhr));
      });

      it("should send set the given headers", function () {
        var spy = sandbox.spy(XMLHttpRequest.prototype, 'setRequestHeader');
        util.request({
          url: 'http://example.org',
          method: 'POST',
          headers: {
            'content-type': 'text/plain',
            'accept': 'text/xml'
          }
        });
        expect(spy).to.be.calledTwice;
        expect(spy.getCall(0)).to.be.calledWith('content-type', 'text/plain');
        expect(spy.getCall(1)).to.be.calledWith('accept', 'text/xml');
      });

      it("should send the given data", function () {
        var spy = sandbox.spy(XMLHttpRequest.prototype, 'send');
        var blob = new Blob([''], { type: 'text/plain' });
        util.request({
          url: 'http://example.org',
          method: 'POST',
          data: blob
        });
        expect(spy).to.be.calledWith(sinon.match.same(blob));
      });

      it("should an object with property 'abort' to cancel the request when invoked", function () {
        var spy = sandbox.spy(XMLHttpRequest.prototype, 'abort');
        var blob = new Blob([''], { type: 'text/plain' });
        var request = util.request({
          url: 'http://example.org',
          method: 'POST',
          data: blob
        });
        request.abort();
        expect(spy).to.be.calledWith();
      });

    });

    describe('.returns()', function () {

      it("should return a function returning the given value", function () {
        var x = {};
        var fn = util.returns(x);
        expect(fn()).to.equal(x);
      });

    });

    describe('.sort()', function () {

      it("should sort an array", function () {
        var values = [3, 1, 2];
        expect(util.sort(values)).to.eql([1, 2, 3]);
      });

      it("should not modify the original array", function () {
        var values = [5, 7, 6];
        var copy = [].concat(values);
        util.sort(values);
        expect(values).to.eql(copy);
      });

      it("should accept a comparison function", function () {
        var sortSpy = sinon.spy(Array.prototype, 'sort');
        var cmpfn = function () {};
        util.sort([], cmpfn);
        expect(sortSpy).to.be.calledWith(sinon.match.same(cmpfn));
      });

    });

    describe('.uniq()', function () {

      it("should create an array without duplicate values", function () {
        var values = ['a', 'a'];
        expect(util.uniq(values)).to.eql(['a']);
      });

      it("should keep the value order", function () {
        var values = ['b', 'a', 'b'];
        expect(util.uniq(values)).to.eql(['b', 'a']);
      });

      it("should use each value's #toString() as key when no key function is given", function () {
        var values = [
          { toString: sinon.stub().returns('x') },
          { toString: sinon.stub().returns('x') }
        ];
        var uniq = util.uniq(values);
        values.forEach(function (value) {
          expect(value.toString).to.be.calledOn(value);
        });
        expect(uniq).to.have.lengthOf(1);
        expect(uniq[0]).to.equal(values[0]);
      });

      context("with a key function", function () {

        it("should call it for each value", function () {
          var keyfn = sinon.stub().returns('x');
          var values = [{}];
          util.uniq(values, keyfn);
          expect(keyfn).to.be.calledWith(sinon.match.same(values[0]));
        });

        it("should use the return value as key", function () {
          var keyfn = returns('y');
          var values = [{}, {}];
          var uniq = util.uniq(values, keyfn);
          expect(uniq).to.have.lengthOf(1);
          expect(uniq[0]).to.equal(values[0]);
        });

      });

    });

  });

});
