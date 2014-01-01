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
  'sulfur/util/stringMap'
], function (shared, StringMap) {

  'use strict';

  var expect = shared.expect;

  describe('sulfur/util/stringMap', function () {

    describe('#size', function () {

      it("should return the number of values", function () {
        var map = StringMap.create();
        expect(map.size).to.equal(0);
      });

    });

    describe('#keys', function () {

      it("should return an array with all keys", function () {
        var map = StringMap.create();
        map.set('x', '1');
        map.set('y', '2');
        map.set('z', '3');
        var keys = map.keys;
        expect(keys).to.have.lengthOf(3);
        expect(keys).to.include('x');
        expect(keys).to.include('y');
        expect(keys).to.include('z');
      });

    });

    describe('#values', function () {

      it("should return an array with all values", function () {
        var map = StringMap.create();
        map.set('a', 'a');
        map.set('b', 'b');
        map.set('c', 'c');
        var values = map.values;
        expect(values).to.have.lengthOf(3);
        expect(values).to.include('a');
        expect(values).to.include('b');
        expect(values).to.include('c');
      });

    });

    describe('#contains()', function () {

      var map;

      beforeEach(function () {
        map = StringMap.create();
      });

      it("should return true when the key's string representation is associated with a value", function () {
        map.set(123, true);
        expect(map.contains('123')).to.be.true;
      });

      it("should return false when the key's string representation is not associated with a value", function () {
        expect(map.contains('abc')).to.be.false;
      });

      it("should safely handle the key '__proto__'", function () {
        map.set('__proto__', true);
        expect(map.contains('__proto__')).to.be.true;
      });

      it("should distinguish between the keys '__proto__' and '__proto__$'", function () {
        map.set('__proto__$', true);
        expect(map.contains('__proto__')).to.be.false;
      });

    });

    describe('#get()', function () {

      var map;

      beforeEach(function () {
        map = StringMap.create();
      });

      it("should return the value associated with the given key's string representation", function () {
        var value = {};
        map.set(123, value);
        expect(map.get('123')).to.equal(value);
      });

      it("should return undefined when the key's string representation is not associated with any value", function () {
        expect(map.get('')).to.be.undefined;
      });

    });

    describe('#remove()', function () {

      var map;

      beforeEach(function () {
        map = StringMap.create();
      });

      it("should remove the key's string representation", function () {
        map.set(123, true);
        expect(function () { return map.contains('123'); })
          .to.change.to(false).when(function () {
            map.remove(123);
          });
      });

      it("should safely handle the key '__proto__'", function () {
        map.set('__proto__', '123');
        map.remove('__proto__');
        expect(map.contains('__proto__')).to.be.false;
      });

      it("should distinguish between the keys '__proto__' and '__proto__$'", function () {
        map.set('__proto__$', '987');
        map.set('__proto__', '123');
        map.remove('__proto__$');
        expect(map.contains('__proto__')).to.be.true;
        expect(map.contains('__proto__$')).to.be.false;
      });

      it("should decrease #size by 1 when the key's string representation is associated with a value", function () {
        map.set('foo', 'bar');
        expect(function () { return map.size; })
          .to.change.by(-1).when(function () {
            map.remove('foo');
          });
      });

      it("should not change #size when the key's string representation is not associated with any value", function () {
        expect(function () { return map.size; })
          .to.not.change.when(function () {
            map.remove('foo');
          });
      });

    });

    describe('#set()', function () {

      var map;

      beforeEach(function () {
        map = StringMap.create();
      });

      it("should associate the key's string representation with the value", function () {
        var value = {};
        map.set(123, value);
        expect(map.get('123')).to.equal(value);
      });

      it("should safely handle the key '__proto__'", function () {
        map.set('__proto__', '123');
        expect(map.get('__proto__')).to.equal('123');
      });

      it("should distinguish between the keys '__proto__' and '__proto__$'", function () {
        map.set('__proto__$', '987');
        map.set('__proto__', '123');
        expect(map.get('__proto__$')).to.equal('987');
      });

      it("should increase #size by 1 when the key's string representation is not associated with any value", function () {
        expect(function () { return map.size; })
          .to.change.by(1).when(function () {
            map.set('foo', 'bar');
          });
      });

      it("should not change #size when the key's string representation is associated with a value", function () {
        map.set('foo', '');
        expect(function () { return map.size; })
          .to.not.change.when(function () {
            map.set('foo', 'bar');
          });
      });

    });

  });

});
