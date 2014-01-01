/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global beforeEach, describe, it */

define([
  'shared',
  'sulfur/util/objectMap'
], function (shared, ObjectMap) {

  'use strict';

  var expect = shared.expect;
  var bind = shared.bind;

  describe('sulfur/util/objectMap', function () {

    describe('#size', function () {

      it("should return the number of values", function () {
        var map = ObjectMap.create();
        expect(map.size).to.equal(0);
      });

    });

    describe('#keys', function () {

      it("should return an array containing all keys", function () {
        var map = ObjectMap.create();
        var x = {};
        var y = {};
        map.set(x, 1);
        map.set(y, 2);
        var keys = map.keys;
        expect(keys).to.include(x);
        expect(keys).to.include(y);
      });

    });

    describe('#values', function () {

      it("should return an array containing all values", function () {
        var map = ObjectMap.create();
        var x = {};
        var y = {};
        map.set({}, x);
        map.set({}, y);
        var values = map.values;
        expect(values).to.include(x);
        expect(values).to.include(y);
      });

    });

    describe('#clear()', function () {

      var map;

      beforeEach(function () {
        map = ObjectMap.create();
      });

      it("should remove all associations", function () {
        var x = {};
        var y = {};
        map.set(x);
        map.set(y);
        map.clear();
        expect(map.contains(x)).to.be.false;
        expect(map.contains(y)).to.be.false;
      });

      it("should empty the map", function () {
        map.set({});
        map.clear();
        expect(map.size).to.equal(0);
      });

    });

    describe('#contains()', function () {

      var map;

      beforeEach(function () {
        map = ObjectMap.create();
      });

      it("should return true when the map associates the object with an value", function () {
        var obj = {};
        map.set(obj, true);
        expect(map.contains(obj)).to.be.true;
      });

      it("should return false when the map does no associate the key with an value", function () {
        expect(map.contains({})).to.be.false;
      });

      it("should reject when it contains a different object with the same ID", function () {
        var key = Object.create(null);
        map.set(key, null);
        var p = Object.getOwnPropertyNames(key)[0];
        var x = Object.create(null);
        x[p] = key[p];
        expect(bind(map, 'contains', x))
          .to.throw("key object with non-unique ID");
      });

    });

    describe('#get()', function () {

      var map;

      beforeEach(function () {
        map = ObjectMap.create();
      });

      it("should return the value associated with the given key", function () {
        var key = {};
        var value = {};
        map.set(key, value);
        expect(map.get(key)).to.equal(value);
      });

      it("should return undefined when the key is not associated with any value", function () {
        expect(map.get({})).to.be.undefined;
      });

    });

    describe('#remove()', function () {

      var map;

      beforeEach(function () {
        map = ObjectMap.create();
      });

      it("should remove the key", function () {
        var key = {};
        var value = {};
        map.set(key, value);
        expect(function () { return map.contains(key); })
          .to.change.to(false).when(function () {
            map.remove(key);
          });
      });

      it("should decrease #size by 1 when the key was associated with a value", function () {
        var key = {};
        map.set(key);
        expect(function () { return map.size; })
          .to.change.by(-1).when(function () {
            map.remove(key);
          });
      });

      it("should not change #size when the key was not associated with any value", function () {
        expect(function () { return map.size; })
          .to.not.change.when(function () {
            map.remove({});
          });
      });

    });

    describe('#set()', function () {

      var map;

      beforeEach(function () {
        map = ObjectMap.create();
      });

      it("should associate the key with the value", function () {
        var key = {};
        var value = {};
        map.set(key, value);
        expect(map.get(key)).to.equal(value);
      });

      it("should increase #size by 1 when the key was not already associated with any value", function () {
        expect(function () { return map.size; })
          .to.change.by(1).when(function () {
            map.set({}, true);
          });
      });

      it("should not change #size when the key is already associated with a value", function () {
        var key = {};
        map.set(key, {});
        expect(function () { return map.size; })
          .to.not.change.when(function () {
            map.set(key, {});
          });
      });

    });

  });

});
