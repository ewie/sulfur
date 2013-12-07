/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global afterEach, beforeEach, describe, it */

define([
  'shared',
  'sulfur/util/stringMap',
  'sulfur/util/orderedStringMap'
], function (shared, StringMap, OrderedStringMap) {

  'use strict';

  var expect = shared.expect;
  var sinon = shared.sinon;

  describe('sulfur/util/orderedStringMap', function () {

    var sandbox;

    beforeEach(function () {
      sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
      sandbox.restore();
    });

    it("should be derived from sulfur/util/stringMap", function () {
      expect(StringMap).to.be.prototypeOf(OrderedStringMap);
    });

    describe('#keys', function () {

      it("should return an array of keys in insertion order", function () {
        var map = OrderedStringMap.create();
        map.set('a', 1);
        map.set('b', 2);
        map.set('c', 3);
        var keys = map.keys;
        expect(keys).to.eql([ 'a', 'b', 'c' ]);
      });

    });

    describe('#values', function () {

      it("should return an array of values in insertion order", function () {
        var map = OrderedStringMap.create();
        var a = {};
        var b = {};
        var c = {};
        map.set('a', a);
        map.set('b', b);
        map.set('c', c);
        var values = map.values;
        expect(values).to.have.lengthOf(3);
        expect(values[0]).to.equal(a);
        expect(values[1]).to.equal(b);
        expect(values[2]).to.equal(c);
      });

    });

    describe('#set()', function () {

      var map;

      beforeEach(function () {
        map = OrderedStringMap.create();
      });

      it("should call sulfur/util/stringMap#set", function () {
        var spy = sandbox.spy(StringMap.prototype, 'set');
        var key = {};
        var value = {};
        map.set(key, value);
        expect(spy)
          .to.be.calledOn(sinon.match.same(map))
          .to.be.calledWith(
            sinon.match.same(key),
            sinon.match.same(value));
      });

      it("should remove the old value when the key was associated with a value", function () {
        var oldValue = {};
        var newValue = {};
        map.set('foo', oldValue);
        map.set('foo', newValue);
        expect(map.values).to.have.lengthOf(1);
        expect(map.values[0]).to.equal(newValue);
      });

      it("should append the new value", function () {
        var value = {};
        map.set('foo', value);
        expect(map.values[0]).to.equal(value);
      });

      it("should use the key's string representation", function () {
        var x = {};
        var y = {};
        map.set(123, true);
        map.set(987, x);
        map.set('123', y);
        expect(map.values).to.have.lengthOf(2);
        expect(map.values[0]).to.equal(x);
        expect(map.values[1]).to.equal(y);
      });

    });

    describe('#remove()', function () {

      var map;

      beforeEach(function () {
        map = OrderedStringMap.create();
        map.set('bar', true);
      });

      it("should call sulfur/util/map#remove", function () {
        var spy = sandbox.spy(StringMap.prototype, 'remove');
        var key = {};
        map.remove(key);
        expect(spy)
          .to.be.calledOn(sinon.match.same(map))
          .to.be.calledWith(sinon.match.same(key));
      });

      it("should remove the value", function () {
        var value = {};
        map.set('foo', value);
        map.remove('foo');
        expect(map.values).to.not.include(value);
      });

      it("should use the key's string representation", function () {
        var value = {};
        map.set(123, value);
        map.remove('123');
        expect(map.values).to.not.include(value);
      });

    });

  });

});
