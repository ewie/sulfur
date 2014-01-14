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
  'sulfur/schema/validator/all'
], function (shared, AllValidator) {

  'use strict';

  var expect = shared.expect;
  var sinon = shared.sinon;

  describe('sulfur/schema/validator/all', function () {

    describe('#validators', function () {

      it("should return the array of validators", function () {
        var validators = [];
        var validator = AllValidator.create(validators);
        expect(validator.validators).to.equal(validators);
      });

    });

    describe('#validate()', function () {

      var validator;
      var validators;

      beforeEach(function () {
        validators = [
          { validate: function (x) { return x; } },
          { validate: function (x) { return x; } }
        ];
        validator = AllValidator.create(validators);
      });

      it("should invoke each validators .validate() in initialization order", function () {
        var spy1 = sinon.stub(validators[0], 'validate').returns(true);
        var spy2 = sinon.stub(validators[1], 'validate').returns(true);
        validator.validate();
        expect(spy2).to.be.calledAfter(spy1);
      });

      it("should pass the value to each validators .validate()", function () {
        var spy1 = sinon.stub(validators[0], 'validate').returns(true);
        var spy2 = sinon.stub(validators[1], 'validate').returns(true);
        var value = {};
        validator.validate(value);
        expect(spy1).to.be.calledWith(sinon.match.same(value));
        expect(spy2).to.be.calledWith(sinon.match.same(value));
      });

      it("should pass the errors array to each validators .validate()", function () {
        var spy1 = sinon.stub(validators[0], 'validate').returns(true);
        var spy2 = sinon.stub(validators[1], 'validate').returns(true);
        var value = {};
        var errors = [];
        validator.validate(value, errors);
        expect(spy1).to.be.calledWith(
          sinon.match.same(value),
          sinon.match.same(errors));
        expect(spy2).to.be.calledWith(
          sinon.match.same(value),
          sinon.match.same(errors));
      });

      it("should return true when all validators pass", function () {
        expect(validator.validate(true)).to.be.true;
      });

      context("when any validator fails", function () {

        it("should return false", function () {
          expect(validator.validate(false)).to.be.false;
        });

        it("should skip the following validators", function () {
          var spy = sinon.spy(validators[1], 'validate');
          validator.validate(false);
          expect(spy).to.not.be.called;
        });

      });

    });

  });

});
