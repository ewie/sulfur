/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global describe, it */

define([
  'shared',
  'sulfur/schema/value/_simple',
  'sulfur/schema/value/simpleList'
], function ($shared, $_simpleValue, $simpleListValue) {

  'use strict';

  var expect = $shared.expect;
  var bind = $shared.bind;
  var sinon = $shared.sinon;

  describe('sulfur/schema/value/simpleList', function () {

    describe('#initialize()', function () {

      it("should reject an item value type which is not derived from sulfur/schema/value/_simple", function () {
        var itemValueType = {};
        expect(bind($simpleListValue, 'create', itemValueType))
          .to.throw("expecting an item value type derived from sulfur/schema/value/_simple");
      });

      it("should reject items which are not of the given item value type", function () {
        var itemValueType = $_simpleValue.clone();
        var items = [ {} ];
        expect(bind($simpleListValue, 'create', itemValueType, items))
          .to.throw("expecting only items of the given item value type");
      });

      it("should initialize the item value type", function () {
        var itemValueType = $_simpleValue.clone();
        var list = $simpleListValue.create(itemValueType);
        expect(list.getItemValueType()).to.equal(itemValueType);
      });

      it("should initialize with items", function () {
        var itemValueType = $_simpleValue.clone();
        var items = [ itemValueType.create() ];
        var list = $simpleListValue.create(itemValueType, items);
        expect(list.toArray()).to.equal(items);
      });

      it("should use an empty array when no items are given", function () {
        var itemValueType = $_simpleValue.clone();
        var list = $simpleListValue.create(itemValueType);
        expect(list.getLength()).to.equal(0);
      });

    });

    describe('#getItemValueType()', function () {

      it("should return the items' value type", function () {
        var itemValueType = $_simpleValue.clone();
        var list = $simpleListValue.create(itemValueType);
        expect(list.getItemValueType()).to.equal(itemValueType);
      });

    });

    describe('#getLength()', function () {

      it("should return the number of items", function () {
        var itemValueType = $_simpleValue.clone();
        var items = [ itemValueType.create() ];
        var list = $simpleListValue.create(itemValueType, items);
        expect(list.toArray()).to.equal(items);
      });

    });

    describe('#toArray()', function () {

      it("should return an array of items", function () {
        var itemValueType = $_simpleValue.clone();
        var items = [ itemValueType.create() ];
        var list = $simpleListValue.create(itemValueType, items);
        expect(list.toArray()).to.equal(items);
      });

    });

    describe('#toString()', function () {

      it("should return the canonical string representation", function () {
        var itemValueType = $_simpleValue.derive({
          initialize: function (x) { this._x = x; },
          toString: function () { return this._x; }
        });
        var items = [
          itemValueType.create('x'),
          itemValueType.create('y')
        ];
        var spies = items.map(function (item) {
          return sinon.spy(item, 'toString');
        });
        var list = $simpleListValue.create(itemValueType, items);
        var s = list.toString();
        expect(s).to.equal('x y');
        expect(spies[0]).to.be.calledOn(items[0]);
        expect(spies[1]).to.be.calledOn(items[1]);
      });

    });

  });

});
