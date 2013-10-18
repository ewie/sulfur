/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global beforeEach, context, describe, it */

define([
  'shared',
  'sulfur/schema/validator/minimum'
], function (shared, MinimumValidator) {

  'use strict';

  var expect = shared.expect;
  var sinon = shared.sinon;

  describe('sulfur/schema/validator/minimum', function () {

    describe('#initialize()', function () {

      it("should match exclusivelly when option `exclusive` is true", function () {
        var validator = MinimumValidator.create(3, { exclusive: true });
        expect(validator.validate(3)).to.be.false;
      });

      it("should match inclusivelly when option `exclusive` is false", function () {
        var validator = MinimumValidator.create(3, { exclusive: false });
        expect(validator.validate(3)).to.be.true;
      });

      it("should match inclusivelly by default", function () {
        var validator = MinimumValidator.create(3);
        expect(validator.validate(3)).to.be.true;
      });

    });

    describe('#validate()', function () {

      context("when the minimum responds to #cmp()", function () {

        it("should call #cmp() on minimum with the value as argument", function () {
          var min = { cmp: sinon.spy() };
          var value = {};
          var validator = MinimumValidator.create(min);
          validator.validate(value);
          expect(min.cmp).to.be.calledOn(min).and.be.calledWith(value);
        });

        it("should return true when minimum#cmp(value) returns negative", function () {
          var min = { cmp: function () { return -1; } };
          var validator = MinimumValidator.create(min);
          expect(validator.validate()).to.be.true;
        });

        it("should return false when minimum#cmp(value) returns positive", function () {
          var min = { cmp: function () { return 1; } };
          var validator = MinimumValidator.create(min);
          expect(validator.validate()).to.be.false;
        });

        context("when minimum#cmp(value) returns zero", function () {

          var min;

          beforeEach(function () {
            min = { cmp: function () { return 0; } };
          });

          it("should return true when matching inclusively", function () {
            var validator = MinimumValidator.create(min);
            expect(validator.validate()).to.be.true;
          });

          it("should return false when matching exclusively", function () {
            var validator = MinimumValidator.create(min, { exclusive: true });
            expect(validator.validate()).to.be.false;
          });

        });

      });

      context("when the minimum does not respond to #cmp()", function () {

        it("should return true when value > minimum", function () {
          var validator = MinimumValidator.create(2);
          expect(validator.validate(3)).to.be.true;
        });

        it("should return false when value < minimum", function () {
          var validator = MinimumValidator.create(2);
          expect(validator.validate(1)).to.be.false;
        });

        context("when value === minimum", function () {

          it("should return true when matching inclusively", function () {
            var validator = MinimumValidator.create(2);
            expect(validator.validate(2)).to.be.true;
          });

          it("should return false when matching exclusively", function () {
            var validator = MinimumValidator.create(2, { exclusive: true });
            expect(validator.validate(2)).to.be.false;
          });

        });

      });

    });

  });

});
