/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global beforeEach, describe, it */

define([
  'shared',
  'sulfur/schema/value/simple/numeric'
], function (shared, NumericValue) {

  'use strict';

  var expect = shared.expect;
  var sinon = shared.sinon;

  describe('sulfur/schema/value/simple/numeric', function () {

    var DerivedNumericValue;

    beforeEach(function () {
      DerivedNumericValue = NumericValue.derive({
        cmp: function () {}
      });
    });

    describe('#eq()', function () {

      it("should return true if #cmp() returns zero", function () {
        var lhs = DerivedNumericValue.create();
        var rhs = DerivedNumericValue.create();
        var cmp = sinon.stub(DerivedNumericValue.prototype, 'cmp').returns(0);
        expect(lhs.eq(rhs)).to.be.true;
        expect(cmp).to.be.calledOn(lhs).and.calledWith(rhs);
      });

      it("should return false if #cmp() return non-zero", function () {
        var lhs = DerivedNumericValue.create();
        var rhs = DerivedNumericValue.create();
        var cmp = sinon.stub(DerivedNumericValue.prototype, 'cmp').returns(1);
        expect(lhs.eq(rhs)).to.be.false;
        expect(cmp).to.be.calledOn(lhs).and.calledWith(rhs);
      });

    });

    describe('#lt()', function () {

      it("should return true if #cmp() returns less than zero", function () {
        var lhs = DerivedNumericValue.create();
        var rhs = DerivedNumericValue.create();
        var cmp = sinon.stub(DerivedNumericValue.prototype, 'cmp').returns(-1);
        expect(lhs.lt(rhs)).to.be.true;
        expect(cmp).to.be.calledOn(lhs).and.calledWith(rhs);
      });

      it("should return false if #cmp() returns non-negative", function () {
        var lhs = DerivedNumericValue.create();
        var rhs = DerivedNumericValue.create();
        var cmp = sinon.stub(DerivedNumericValue.prototype, 'cmp').returns(0);
        expect(lhs.lt(rhs)).to.be.false;
        expect(cmp).to.be.calledOn(lhs).and.calledWith(rhs);
      });

    });

    describe('#gt()', function () {

      it("should return true if #cmp() returns greater than zero", function () {
        var lhs = DerivedNumericValue.create();
        var rhs = DerivedNumericValue.create();
        var cmp = sinon.stub(DerivedNumericValue.prototype, 'cmp').returns(1);
        expect(lhs.gt(rhs)).to.be.true;
        expect(cmp).to.be.calledOn(lhs).and.calledWith(rhs);
      });

      it("should return false if #cmp() returns non-positive", function () {
        var lhs = DerivedNumericValue.create();
        var rhs = DerivedNumericValue.create();
        var cmp = sinon.stub(DerivedNumericValue.prototype, 'cmp').returns(0);
        expect(lhs.gt(rhs)).to.be.false;
        expect(cmp).to.be.calledOn(lhs).and.calledWith(rhs);
      });

    });

    describe('#lteq()', function () {

      it("should return false if #gt() returns true", function () {
        var lhs = DerivedNumericValue.create();
        var rhs = DerivedNumericValue.create();
        var gt = sinon.stub(DerivedNumericValue.prototype, 'gt').returns(true);
        expect(lhs.lteq(rhs)).to.be.false;
        expect(gt).to.be.calledOn(lhs).and.calledWith(rhs);
      });

      it("should return true if #gt() returns false", function () {
        var lhs = DerivedNumericValue.create();
        var rhs = DerivedNumericValue.create();
        var gt = sinon.stub(DerivedNumericValue.prototype, 'gt').returns(false);
        expect(lhs.lteq(rhs)).to.be.true;
        expect(gt).to.be.calledOn(lhs).and.calledWith(rhs);
      });

    });

    describe('#gteq()', function () {

      it("should return false if #lt() returns true", function () {
        var lhs = DerivedNumericValue.create();
        var rhs = DerivedNumericValue.create();
        var lt = sinon.stub(DerivedNumericValue.prototype, 'lt').returns(true);
        expect(lhs.gteq(rhs)).to.be.false;
        expect(lt).to.be.calledOn(lhs).and.calledWith(rhs);
      });

      it("should return true if #lt() returns false", function () {
        var lhs = DerivedNumericValue.create();
        var rhs = DerivedNumericValue.create();
        var lt = sinon.stub(DerivedNumericValue.prototype, 'lt').returns(false);
        expect(lhs.gteq(rhs)).to.be.true;
        expect(lt).to.be.calledOn(lhs).and.calledWith(rhs);
      });

    });

  });

});
