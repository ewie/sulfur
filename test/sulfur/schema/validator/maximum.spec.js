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
  'sulfur/schema/validator/maximum'
], function (shared, MaximumValidator) {

  'use strict';

  var expect = shared.expect;
  var sinon = shared.sinon;
  var returns = shared.returns;

  describe('sulfur/schema/validator/maximum', function () {

    describe('#initialize()', function () {

      describe("option `exclusive`", function () {

        it("should match exclusively when true", function () {
          var validator = MaximumValidator.create(null, { exclusive: true });
          expect(validator.exclusive).to.be.true;
        });

        it("should match inclusively when false", function () {
          var validator = MaximumValidator.create(null, { exclusive: false });
          expect(validator.exclusive).to.be.false;
        });

        it("should match inclusively by default", function () {
          var validator = MaximumValidator.create(null);
          expect(validator.exclusive).to.be.false;
        });

      });

      describe("option `errorPrefix`", function () {

        it("should use the value when given", function () {
          var validator = MaximumValidator.create(null, { errorPrefix: "foo bar" });
          expect(validator.errorPrefix).to.equal("foo bar");
        });

        context("when not given", function () {

          it("should use 'must be less than' when matching exclusively", function () {
            var validator = MaximumValidator.create(null, { exclusive: true });
            expect(validator.errorPrefix).to.equal("must be less than");
          });

          it("should use 'must be less than or equal to' when matching inclusively", function () {
            var validator = MaximumValidator.create();
            expect(validator.errorPrefix).to.equal("must be less than or equal to");
          });

        });

      });

    });

    describe('#exclusive', function () {

      it("should return true when matching exclusively", function () {
        var validator = MaximumValidator.create(null, { exclusive: true });
        expect(validator.exclusive).to.be.true;
      });

      it("should return false when matching inclusively", function () {
        var validator = MaximumValidator.create(null, { exclusive: false });
        expect(validator.exclusive).to.be.false;
      });

    });

    describe('#errorPrefix', function () {

      it("should return the error message prefixy", function () {
        var v = MaximumValidator.create(null, { errorPrefix: 'foo' });
        expect(v.errorPrefix).to.equal('foo');
      });

    });

    describe('#validate()', function () {

      it("should generate an error message from the maximum value when an errors array is given", function () {
        var validator = MaximumValidator.create({
          toString: returns('foo'),
          cmp: returns(-1)
        }, { errorPrefix: "should be less than" });
        var errors = [];
        validator.validate(false, errors);
        expect(errors).to.have.lengthOf(1);
        expect(errors[0]).to.equal(validator.errorPrefix + " \u201Cfoo\u201D");
      });

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
