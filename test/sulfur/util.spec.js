/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global context, describe, it */

define([
  'shared',
  'sulfur/util'
], function ($shared, $util) {

  'use strict';

  var expect = $shared.expect;
  var sinon = $shared.sinon;

  describe('sulfur/util', function () {

    describe('.isDefined()', function () {

      it("should return true when the argument is not undefined", function () {
        expect($util.isDefined(0)).to.be.true;
      });

      it("should return false when the argument is undefined", function () {
        expect($util.isDefined(undefined)).to.be.false;
      });

    });

    describe('.isInteger()', function () {

      it("should return true with an integer value", function () {});

      it("should return false when the value is not of type 'number'", function () {
        expect($util.isInteger('1')).to.be.false;
      });

      it("should return false when the value is not equal to its rounded value", function () {
        expect($util.isInteger(1.2)).to.be.false;
      });

      it("should return false when the value is equal to 2^53", function () {
        expect($util.isInteger(Math.pow(2, 53))).to.be.false;
      });

      it("should return false when the value is greater than 2^53", function () {
        expect($util.isInteger(Math.pow(2, 54))).to.be.false;
      });

      it("should return false when the value is equal to -2^53", function () {
        expect($util.isInteger(-Math.pow(2, 53))).to.be.false;
      });

      it("should return false when the value is less than -2^53", function () {
        expect($util.isInteger(-Math.pow(2, 54))).to.be.false;
      });

    });

    describe('.uniq()', function () {

      it("should create an array without duplicate elements", function () {
        var values = ['a', 'a'];
        expect($util.uniq(values)).to.eql(['a']);
      });

      it("should keep the element's order", function () {
        var values = ['b', 'a', 'b'];
        expect($util.uniq(values)).to.eql(['b', 'a']);
      });

      it("should use each element's #toString() as key when no key function is given", function () {
        var values = [
          { toString: sinon.stub().returns('x') },
          { toString: sinon.stub().returns('x') }
        ];
        var uniq = $util.uniq(values);
        values.forEach(function (value) {
          expect(value.toString).to.be.calledOn(value);
        });
        expect(uniq).to.have.length(1);
        expect(uniq[0]).to.equal(values[0]);
      });

      context("with a key function", function () {

        it("should call it for each element", function () {
          var keyfn = sinon.spy();
          var values = [{}];
          $util.uniq(values, keyfn);
          expect(keyfn).to.be.calledWith(sinon.match.same(values[0]));
        });

        it("should use the return value as key", function () {
          var keyfn = sinon.stub().returns('y');
          var values = [{}, {}];
          var uniq = $util.uniq(values, keyfn);
          expect(uniq).to.have.length(1);
          expect(uniq[0]).to.equal(values[0]);
        });

      });

    });

  });

});
