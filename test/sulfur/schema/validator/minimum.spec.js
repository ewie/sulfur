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
  'sulfur/schema/validator/minimum'
], function (shared, MinimumValidator) {

  'use strict';

  var expect = shared.expect;
  var sinon = shared.sinon;
  var returns = shared.returns;

  describe('sulfur/schema/validator/minimum', function () {

    describe('#initialize()', function () {

      describe("option `exclusive`", function () {

        it("should match exclusively when true", function () {
          var validator = MinimumValidator.create(null, { exclusive: true });
          expect(validator.exclusive).to.be.true;
        });

        it("should match inclusively when false", function () {
          var validator = MinimumValidator.create(null, { exclusive: false });
          expect(validator.exclusive).to.be.false;
        });

        it("should match inclusively by default", function () {
          var validator = MinimumValidator.create(null);
          expect(validator.exclusive).to.be.false;
        });

      });

      describe("option `message`", function () {

        it("should use the value when given", function () {
          var validator = MinimumValidator.create(null, { message: "foo bar" });
          expect(validator.message).to.equal("foo bar");
        });

        context("when not given", function () {

          it("should use 'must be greater than' when matching exclusively", function () {
            var validator = MinimumValidator.create(null, { exclusive: true });
            expect(validator.message).to.equal("must be greater than ???");
          });

          it("should use 'must be greater than or equal to ???' when matching inclusively", function () {
            var validator = MinimumValidator.create();
            expect(validator.message).to.equal("must be greater than or equal to ???");
          });

        });

      });

    });

    describe('#exclusive', function () {

      it("should return true when matching exclusively", function () {
        var validator = MinimumValidator.create(null, { exclusive: true });
        expect(validator.exclusive).to.be.true;
      });

      it("should return false when matching inclusively", function () {
        var validator = MinimumValidator.create(null, { exclusive: false });
        expect(validator.exclusive).to.be.false;
      });

    });

    describe('#message', function () {

      it("should return the error message", function () {
        var v = MinimumValidator.create(null, { message: 'foo' });
        expect(v.message).to.equal('foo');
      });

    });

    describe('#validate()', function () {

      it("should generate an error message from the minimum value when an errors array is given", function () {
        var validator = MinimumValidator.create({
          toString: returns('bar'),
          cmp: returns(1)
        }, { message: "should be more than ???" });
        var errors = [];
        validator.validate(false, errors);
        expect(errors).to.have.lengthOf(1);
        expect(errors[0]).to.equal("should be more than bar");
      });

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
