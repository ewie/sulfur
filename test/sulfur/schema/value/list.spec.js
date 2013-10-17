/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global beforeEach, context, describe, it */

define([
  'shared',
  'sulfur/schema/value/list'
], function ($shared, $listValue) {

  'use strict';

  var expect = $shared.expect;
  var sinon = $shared.sinon;

  describe('sulfur/schema/value/list', function () {

    var list;
    var values;

    beforeEach(function () {
      values = [];
      list = $listValue.create(values);
    });

    describe('#initialize()', function () {

      it("should use an empty array as default values", function () {
        var list = $listValue.create();
        expect(list.toArray()).to.eql([]);
      });

    });

    describe('#getValueAt()', function () {

      it("should return the value at the given index", function () {
        var value = {};
        var list = $listValue.create([ value ]);
        expect(list.getValueAt(0)).to.equal(value);
      });

    });

    describe('#getLength()', function () {

      it("should return the number of items", function () {
        expect(list.getLength()).to.equal(values.length);
      });

    });

    describe('#toArray()', function () {

      it("should return an array of items", function () {
        expect(list.toArray()).to.equal(values);
      });

    });

    describe('#eq()', function () {

      it("should return false when length is different", function () {
        var list = $listValue.create();
        var other = $listValue.create([ {} ]);
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
          var list = $listValue.create(values);
          var other = $listValue.create(otherValues);
          list.eq(other);
          spies.forEach(function (spy, i) {
            expect(spy).to.be.calledWith(sinon.match.same(otherValues[i]));
          });
        });

        it("should return true if each value is equal to the corresponding value of the other list at the same index", function () {
          var values = [ value() ];
          values.forEach(function (value) {
            sinon.stub(value, 'eq').returns(true);
          });
          var otherValues = [ {} ];
          var list = $listValue.create(values);
          var other = $listValue.create(otherValues);
          expect(list.eq(other)).to.be.true;
        });

        it("should return false if any value is not equal to the corresponding value of the other list at the same index", function () {
          var values = [ value() ];
          values.forEach(function (value) {
            sinon.stub(value, 'eq').returns(false);
          });
          var otherValues = [ {} ];
          var list = $listValue.create(values);
          var other = $listValue.create(otherValues);
          expect(list.eq(other)).to.be.false;
        });

      });

    });

  });

});
