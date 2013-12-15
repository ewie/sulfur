/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global afterEach, beforeEach, context, describe, it */

define([
  'shared',
  'sulfur/schema/value/simple',
  'sulfur/schema/value/simple/whiteSpace'
], function (shared, SimpleValue, WhiteSpaceValue) {

  'use strict';

  var expect = shared.expect;
  var sinon = shared.sinon;
  var bind = shared.bind;

  describe('sulfur/schema/value/simple/whiteSpace', function () {

    it("should be derived from sulfur/schema/value/simple", function () {
      expect(SimpleValue).to.be.prototypeOf(WhiteSpaceValue);
    });

    describe('.parse()', function () {

      var sandbox;

      beforeEach(function () {
        sandbox = sinon.sandbox.create();
      });

      afterEach(function () {
        sandbox.restore();
      });

      it("should delegate to .create()", function () {
        var spy = sandbox.spy(WhiteSpaceValue, 'create');
        var s = 'collapse';
        var ws = WhiteSpaceValue.parse(s);
        expect(spy)
          .to.be.calledWith(s)
          .to.have.returned(sinon.match.same(ws));
      });

    });

    describe('#initialize()', function () {

      it("should reject an invalid value", function () {
        expect(bind(WhiteSpaceValue, 'create', 'xxx'))
          .to.throw('expecting either "collapse", "preserve" or "replace"');
      });

      'collapse preserve replace'.split(' ').forEach(function (value) {

        it("should accept '" + value + "'", function () {
          expect(bind(WhiteSpaceValue, 'create', value)).to.not.throw();
        });

      });

    });

    describe('#value', function () {

      'collapse preserve replace'.split(' ').forEach(function (value) {

        it("should return '" + value + "' when value is '" + value + "'", function () {
          var ws = WhiteSpaceValue.create(value);
          expect(ws.value).to.equal(value);
        });

      });

    });

    describe('#eq()', function () {

      it("should return true when #value is identical", function () {
        var ws = WhiteSpaceValue.create('collapse');
        var other = WhiteSpaceValue.create('collapse');
        expect(ws.eq(other)).to.be.true;
      });

      it("should return false when #value is different", function () {
        var ws = WhiteSpaceValue.create('collapse');
        var other = WhiteSpaceValue.create('replace');
        expect(ws.eq(other)).to.be.false;
      });

    });

    describe('#toString()', function () {

      'collapse preserve replace'.split(' ').forEach(function (value) {

        it("should return '" + value + "' when value is '" + value + "'", function () {
          var ws = WhiteSpaceValue.create(value);
          expect(ws.toString()).to.equal(value);
        });

      });

    });

    describe('#isEqualOrStricter()', function () {

      context("with value 'collapse'", function () {

        [
          [ 'preserve', true ],
          [ 'replace', true ],
          [ 'collapse', true ]
        ].forEach(function (pair) {

          var value = pair[0];
          var result = pair[1];
          var lhs = WhiteSpaceValue.create('collapse');

          it("should return " + result + " when the other value is '" + value + "'", function () {
            var rhs = WhiteSpaceValue.create(value);
            expect(lhs.isEqualOrStricter(rhs));
          });

        });

      });

      context("with value 'replace'", function () {

        [
          [ 'preserve', true ],
          [ 'replace', true ],
          [ 'collapse', false ]
        ].forEach(function (pair) {

          var value = pair[0];
          var result = pair[1];
          var lhs = WhiteSpaceValue.create('replace');

          it("should return " + result + " when the other value is '" + value + "'", function () {
            var rhs = WhiteSpaceValue.create(value);
            expect(lhs.isEqualOrStricter(rhs));
          });

        });

      });

      context("with value 'preserve'", function () {

        [
          [ 'preserve', true ],
          [ 'replace', false ],
          [ 'collapse', false ]
        ].forEach(function (pair) {

          var value = pair[0];
          var result = pair[1];
          var lhs = WhiteSpaceValue.create('preserve');

          it("should return " + result + " when the other value is '" + value + "'", function () {
            var rhs = WhiteSpaceValue.create(value);
            expect(lhs.isEqualOrStricter(rhs));
          });

        });

      });

    });

  });

});
