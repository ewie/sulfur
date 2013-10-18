/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global beforeEach, describe, it */

define([
  'shared',
  'sulfur/schema/value/list',
  'sulfur/schema/value/simpleList'
], function (shared, ListValue, SimpleListValue) {

  'use strict';

  var expect = shared.expect;
  var sinon = shared.sinon;
  var returns = shared.returns;

  describe('sulfur/schema/value/simpleList', function () {

    it("should be derived from sulfur/schema/value/list", function () {
      expect(ListValue).to.be.prototypeOf(SimpleListValue);
    });

    describe('.typed()', function () {

      it("should clone and use the given value type as item value type", function () {
        var valueType = {};
        var simpleList = SimpleListValue.typed(valueType);
        expect(SimpleListValue).to.be.prototypeOf(simpleList);
        expect(simpleList.getItemValueType()).to.equal(valueType);
      });

    });

    describe('.parse()', function () {

      var simpleList;
      var valueType;

      beforeEach(function () {
        valueType = {
          parse: function (s) {
            return { s: s };
          }
        };
        simpleList = SimpleListValue.typed(valueType);
      });

      it("should parse a space separated sequence of literals", function () {
        var spy = sinon.spy(valueType, 'parse');
        var list = simpleList.parse('1 2  3');
        expect(spy.getCall(0).args[0]).to.equal('1');
        expect(spy.getCall(1).args[0]).to.equal('2');
        expect(spy.getCall(2).args[0]).to.equal('3');
        expect(list).to.eql(
          simpleList.create(
            [ spy.getCall(0).returnValue,
              spy.getCall(1).returnValue,
              spy.getCall(2).returnValue
            ]));
      });

      it("should ignore leading and trailing whitespace", function () {
        var list = simpleList.parse('\x09\x0A\x0D 1 \x09\x0A\x0D');
        expect(list).to.eql(simpleList.create([ valueType.parse('1') ]));
      });

    });

    describe('#toString()', function () {

      it("should return the canonical string representation", function () {
        var items = [
          { toString: returns('x') },
          { toString: returns('y') }
        ];
        var spies = items.map(function (item) {
          return sinon.spy(item, 'toString');
        });
        var list = SimpleListValue.create(items);
        var s = list.toString();
        expect(s).to.equal('x y');
        expect(spies[0]).to.be.calledOn(items[0]);
        expect(spies[1]).to.be.calledOn(items[1]);
      });

      it("should collapse white space", function () {
        var items = [
          { toString: returns(' a\x09b') },
          { toString: returns('c\x0Ad') },
          { toString: returns('e\x0Df') },
          { toString: returns('g  h ') }
        ];
        var list = SimpleListValue.create(items);
        var s = list.toString();
        expect(s).to.equal('a b c d e f g h');
      });

    });

  });

});
