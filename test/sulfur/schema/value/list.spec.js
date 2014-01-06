/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global beforeEach, context, describe, it */

define([
  'shared',
  'sulfur/schema/value/list',
  'sulfur/schema/value/simple/integer',
], function (shared, ListValue, IntegerValue) {

  'use strict';

  var expect = shared.expect;
  var sinon = shared.sinon;
  var returns = shared.returns;

  describe('sulfur/schema/value/list', function () {

    var list;
    var values;

    beforeEach(function () {
      values = [];
      list = ListValue.create(values);
    });

    describe('.withItemValueType()', function () {

      it("should clone and use the given value type as item value type", function () {
        var valueType = {};
        var listType = ListValue.withItemValueType(valueType);
        expect(ListValue).to.be.prototypeOf(listType);
        expect(listType.itemValueType).to.equal(valueType);
      });

    });

    describe('#initialize()', function () {

      it("should use an empty array as default values", function () {
        var list = ListValue.create();
        expect(list.toArray()).to.eql([]);
      });

    });

    describe('#getValueAt()', function () {

      it("should return the value at the given index", function () {
        var value = {};
        var list = ListValue.create([ value ]);
        expect(list.getValueAt(0)).to.equal(value);
      });

    });

    describe('#length', function () {

      it("should return the number of items", function () {
        expect(list.length).to.eql(IntegerValue.parse(values.length.toString(10)));
      });

    });

    describe('#toArray()', function () {

      it("should return an array of items", function () {
        expect(list.toArray()).to.equal(values);
      });

    });

    describe('#eq()', function () {

      it("should return false when length is different", function () {
        var list = ListValue.create();
        var other = ListValue.create([ {} ]);
        expect(list.eq(other)).to.be.false;
      });

      context("with the same length", function () {

        function value() {
          return { eq: function () {} };
        }

        it("should call .eq() on each value of the LHS list with the corresponding value of the RHS list", function () {
          var values = [ value(), value() ];
          var spies = values.map(function (value) {
            return sinon.stub(value, 'eq').returns(true);
          });
          var otherValues = [ {}, {} ];
          var list = ListValue.create(values);
          var other = ListValue.create(otherValues);
          list.eq(other);
          spies.forEach(function (spy, i) {
            expect(spy).to.be.calledWith(sinon.match.same(otherValues[i]));
          });
        });

        it("should return true if each value is equal to the corresponding value of the other list at the same index", function () {
          var values = [ value() ];
          values.forEach(function (value) {
            value.eq = returns(true);
          });
          var otherValues = [ {} ];
          var list = ListValue.create(values);
          var other = ListValue.create(otherValues);
          expect(list.eq(other)).to.be.true;
        });

        it("should return false if any value is not equal to the corresponding value of the other list at the same index", function () {
          var values = [ value() ];
          values.forEach(function (value) {
            value.eq = returns(false);
          });
          var otherValues = [ {} ];
          var list = ListValue.create(values);
          var other = ListValue.create(otherValues);
          expect(list.eq(other)).to.be.false;
        });

      });

    });

  });

});
