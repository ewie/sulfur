/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global afterEach, beforeEach, context, describe, it */

define([
  'shared',
  'sulfur/schema/regex/ranges'
], function ($shared, $ranges) {

  'use strict';

  var expect = $shared.expect;
  var sinon = $shared.sinon;

  describe('sulfur.schema.regex.ranges', function () {

    describe('#initialize()', function () {

      it("should initialize with the given ranges", function () {
        var rs = [ [0, 2], [5, 6] ];
        var r = $ranges.create(rs);
        expect(r.array).to.eql(rs);
      });

      it("should not modify the original ranges", function () {
        var rs = [ [5, 6], [0, 2] ];
        var copy = rs.map(function (range) {
          return [].concat(range);
        });
        $ranges.create(rs);
        expect(rs).to.eql(copy);
      });

      it("should sort the ranges", function () {
        var rs = [ [5, 6], [0, 2] ];
        var r = $ranges.create(rs);
        expect(r.array).to.eql([ [0, 2], [5, 6] ]);
      });

      it("should use disjoint ranges", function () {
        var rs = [ [0, 3], [8, 10], [3, 5], [9, 12], [6, 6], [11, 11] ];
        var r = $ranges.create(rs);
        var x = [ [0, 6], [8, 12] ];
        expect(r.array).to.eql(x);
      });

    });

    describe('#subtract()', function () {

      it("should handle an RHS range which is less than an LHS range's maximum, but not the last RHS range overall", function () {
        var lhs = $ranges.create([ [0, 100], [200, 300] ]);
        var rhs = $ranges.create([ [30, 60], [70, 80], [1000, 2000] ]);
        var r = lhs.subtract(rhs);
        var x = [ [0, 29], [61, 69], [81, 100], [200, 300] ];
        expect(r.array).to.eql(x);
      });

      it("should ignore RHS ranges less than the LHS minimum", function () {
        var lhs = $ranges.create([ [0, 100] ]);
        var rhs = $ranges.create([ [-1, -1] ]);
        var r = lhs.subtract(rhs);
        var x = [ [0, 100] ];
        expect(r.array).to.eql(x);
      });

      it("should ignore RHS ranges greater than the LHS maximum", function () {
        var lhs = $ranges.create([ [0, 100] ]);
        var rhs = $ranges.create([ [101, 101] ]);
        var r = lhs.subtract(rhs);
        var x = [ [0, 100] ];
        expect(r.array).to.eql(x);
      });

      it("should handle RHS ranges spanning multiple LHS ranges", function () {
        var lhs = $ranges.create([ [0, 100], [200, 300] ]);
        var rhs = $ranges.create([ [50, 250] ]);
        var r = lhs.subtract(rhs);
        var x = [ [0, 49], [251, 300] ];
        expect(r.array).to.eql(x);
      });

      it("should handle RHS ranges matching the minimum", function () {
        var lhs = $ranges.create([ [0, 100] ]);
        var rhs = $ranges.create([ [0, 50] ]);
        var r = lhs.subtract(rhs);
        var x = [ [51, 100] ];
        expect(r.array).to.eql(x);
      });

      it("should handle RHS ranges matching the maximum", function () {
        var lhs = $ranges.create([ [0, 100] ]);
        var rhs = $ranges.create([ [50, 100] ]);
        var r = lhs.subtract(rhs);
        var x = [ [0, 49] ];
        expect(r.array).to.eql(x);
      });

      it("should keep LHS ranges not covered by the first RHS range", function () {
        var lhs = $ranges.create([ [0, 50] ]);
        var rhs = $ranges.create([ [100, 200] ]);
        var r = lhs.subtract(rhs);
        var x = [ [0, 50] ];
        expect(r.array).to.eql(x);
      });

      it("should keep LHS ranges not covered by the last RHS range", function () {
        var lhs = $ranges.create([ [100, 200] ]);
        var rhs = $ranges.create([ [0, 50] ]);
        var r = lhs.subtract(rhs);
        var x = [ [100, 200] ];
        expect(r.array).to.eql(x);
      });

      it("should ignore RHS ranges lying between two LHS ranges", function () {
        var lhs = $ranges.create([ [100, 200], [300, 400] ]);
        var rhs = $ranges.create([ [230, 270] ]);
        var r = lhs.subtract(rhs);
        var x = [ [100, 200], [300, 400] ];
        expect(r.array).to.eql(x);
      });

      it("should keep LHS ranges lying between two RHS ranges", function () {
        var lhs = $ranges.create([ [200, 300] ]);
        var rhs = $ranges.create([ [0, 100], [400, 500] ]);
        var r = lhs.subtract(rhs);
        var x = [ [200, 300] ];
        expect(r.array).to.eql(x);
      });

    });

    describe('#add()', function () {

      var sandbox;

      beforeEach(function () {
        sandbox = sinon.sandbox.create();
      });

      afterEach(function () {
        sandbox.restore();
      });

      it("should create a new range from the concatenation of LHS' and RHS' .array", function () {
        var initializeSpy = sandbox.spy($ranges.prototype, 'initialize');
        var p = $ranges.create([ [0, 0x400] ]);
        var q = $ranges.create([ [0x300, 0x600] ]);
        p.add(q);
        expect(initializeSpy).to.be.calledWith(p.array.concat(q.array));
      });

    });

    describe('#invert()', function () {

      context("if the first range includes the minimum", function () {

        it("should handle the range containing the minimum", function () {
          var r = $ranges.create([ [0, 100], [200, 300] ]);
          var ir = r.invert();
          var x = [
            [101, 199],
            [301, 0xFFFF]
          ];
          expect(ir.array).to.eql(x);
        });

      });

      context("if the last range includes the maximum", function () {

        it("should handle the range containing the maximum", function () {
          var r = $ranges.create([ [100, 200], [300, 0xFFFF] ]);
          var ir = r.invert();
          var x = [
            [0, 99],
            [201, 299]
          ];
          expect(ir.array).to.eql(x);
        });

      });

      it("should create the inverse", function () {
        var r = $ranges.create([ [100, 200], [300, 400] ]);
        var ir = r.invert();
        var x = [
          [0, 99],
          [201, 299],
          [401, 0xFFFF]
        ];
        expect(ir.array).to.eql(x);
      });

    });

  });

});
