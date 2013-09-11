/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global beforeEach, describe, it */

define([
  'shared',
  'sulfur/util/orderedMap'
], function ($shared, $orderedMap) {

  'use strict';

  var expect = $shared.expect;
  var bind = $shared.bind;

  describe('sulfur/util/orderedMap', function () {

    describe('#initialize()', function () {

      it("should use #toString() as default key function", function () {
        var m = $orderedMap.create();
        m.insert(123);
        expect(m.getByKey('123')).to.equal(123);
      });

      it("should accept a custom key function", function () {
        var m = $orderedMap.create(function (x) {
          return 'key:' + x.toString();
        });
        m.insert(123);
        expect(m.getByKey('key:123')).to.equal(123);
      });

      it("should accept initial items", function () {
        var m = $orderedMap.create([ 'a', 'b' ]);
        expect(m.toArray()).to.eql([ 'a', 'b' ]);
      });

    });

    describe('#contains()', function () {

      var map;

      beforeEach(function () {
        map = $orderedMap.create();
      });

      it("should return true if the map contains the item", function () {
        map.insert(123);
        expect(map.contains(123)).to.be.true;
      });

      it("should return false if the map does not contain the item", function () {
        expect(map.contains(123)).to.be.false;
      });

      it("should test items for strict equality if there's an associated key", function () {
        var x = { toString: function () { return 'x'; } };
        var y = { toString: function () { return 'x'; } };
        map.insert(x);
        expect(map.contains(y)).to.be.false;
      });

    });

    describe('#canBeInserted()', function () {

      var map;

      beforeEach(function () {
        map = $orderedMap.create();
      });

      it("should return true if the item's key is not associated with any item", function () {
        expect(map.canBeInserted('')).to.be.true;
      });

      it("should return false if the item's key is associated with any item", function () {
        map.insert({ toString: function () { return 'x'; } });
        expect(map.canBeInserted({ toString: function () { return 'x'; } })).to.be.false;
      });

    });

    describe('#getByKey()', function () {

      var map;

      beforeEach(function () {
        map = $orderedMap.create([ 123 ]);
      });

      it("should return the item associated with the given key", function () {
        expect(map.getByKey('123')).to.equal(123);
      });

      it("should return undefined if the key is not associated with any item", function () {
        expect(map.getByKey('abc')).to.be.undefined;
      });

    });

    describe('#insert()', function () {

      var map;

      beforeEach(function () {
        map = $orderedMap.create();
      });

      it("should associate the item with the key generated by the key function", function () {
        map.insert(123);
        expect(map.getByKey('123')).to.equal(123);
      });

      it("should throw when the key is already associated with an item", function () {
        map.insert(123);
        expect(bind(map, 'insert', 123))
          .to.throw('key "123" is already associated with an item');
      });

      it("should safely handle the key '__proto__'", function () {
        map.insert('__proto__');
        expect(map.getByKey('__proto__')).to.equal('__proto__');
      });

    });

    describe('#toArray()', function () {

      var map;

      beforeEach(function () {
        map = $orderedMap.create([ 123, 'abc' ]);
      });

      it("should return an array of all items in insertion order", function () {
        expect(map.toArray()).to.eql([ 123, 'abc' ]);
      });

    });

  });

});
