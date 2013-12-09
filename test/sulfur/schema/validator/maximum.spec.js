/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global beforeEach, context, describe, it */

define([
  'shared',
  'sulfur/schema/validator/maximum'
], function (shared, MaximumValidator) {

  'use strict';

  var expect = shared.expect;
  var sinon = shared.sinon;

  describe('sulfur/schema/validator/maximum', function () {

    describe('#initialize()', function () {

      it("should match exclusivelly when option `exclusive` is true", function () {
        var validator = MaximumValidator.create(3, { exclusive: true });
        expect(validator.validate(3)).to.be.false;
      });

      it("should match inclusivelly when option `exclusive` is false", function () {
        var validator = MaximumValidator.create(3, { exclusive: false });
        expect(validator.validate(3)).to.be.true;
      });

      it("should match inclusivelly by default", function () {
        var validator = MaximumValidator.create(3);
        expect(validator.validate(3)).to.be.true;
      });

    });

    describe('#validate()', function () {

      context("when the maximum responds to .cmp()", function () {

        it("should call .cmp() on maximum with the value as argument", function () {
          var max = { cmp: sinon.spy() };
          var value = {};
          var validator = MaximumValidator.create(max);
          validator.validate(value);
          expect(max.cmp).to.be.calledOn(max).and.be.calledWith(value);
        });

        it("should return true when maximum.cmp(value) returns positive", function () {
          var max = { cmp: function () { return 1 } };
          var validator = MaximumValidator.create(max);
          expect(validator.validate()).to.be.true;
        });

        it("should return false when maximum.cmp(value) returns negative", function () {
          var max = { cmp: function () { return -1 } };
          var validator = MaximumValidator.create(max);
          expect(validator.validate()).to.be.false;
        });

        context("when maximum.cmp(value) returns zero", function () {

          var max;

          beforeEach(function () {
            max = { cmp: function () { return 0 } };
          });

          it("should return true when matching inclusively", function () {
            var validator = MaximumValidator.create(max);
            expect(validator.validate()).to.be.true;
          });

          it("should return false when matching exclusively", function () {
            var validator = MaximumValidator.create(max, { exclusive: true });
            expect(validator.validate()).to.be.false;
          });

        });

      });

      context("when the maximum does not respond to .cmp()", function () {

        it("should return true when value < maximum", function () {
          var validator = MaximumValidator.create(2);
          expect(validator.validate(1)).to.be.true;
        });

        it("should return false when value > maximum", function () {
          var validator = MaximumValidator.create(2);
          expect(validator.validate(3)).to.be.false;
        });

        context("when value === maximum", function () {

          it("should return true when matching inclusively", function () {
            var validator = MaximumValidator.create(2);
            expect(validator.validate(2)).to.be.true;
          });

          it("should return false when matching exclusively", function () {
            var validator = MaximumValidator.create(2, { exclusive: true });
            expect(validator.validate(2)).to.be.false;
          });

        });

      });

    });

  });

});
