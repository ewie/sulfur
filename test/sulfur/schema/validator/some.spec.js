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
  'sulfur/schema/validator/some'
], function (shared, SomeValidator) {

  'use strict';

  var expect = shared.expect;
  var sinon = shared.sinon;
  var bind = shared.bind;

  describe('sulfur/schema/validator/some', function () {

    describe('#initialize()', function () {

      it("should reject an empty array", function () {
        expect(bind(SomeValidator, 'create', []))
          .to.throw("must specify at least one validator");
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
        validator = SomeValidator.create(validators);
      });

      it("should invoke each validators .validate() in initialization order", function () {
        var spy1 = sinon.stub(validators[0], 'validate').returns(false);
        var spy2 = sinon.stub(validators[1], 'validate').returns(false);
        validator.validate();
        expect(spy2).to.be.calledAfter(spy1);
      });

      it("should pass the value to each validators .validate()", function () {
        var spy1 = sinon.stub(validators[0], 'validate').returns(false);
        var spy2 = sinon.stub(validators[1], 'validate').returns(false);
        var value = {};
        validator.validate(value);
        expect(spy1).to.be.calledWith(sinon.match.same(value));
        expect(spy2).to.be.calledWith(sinon.match.same(value));
      });

      it("should pass the errors array to each validators .validate()", function () {
        var spy1 = sinon.stub(validators[0], 'validate').returns(false);
        var spy2 = sinon.stub(validators[1], 'validate').returns(false);
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

      it("should return false when all validators fail", function () {
        expect(validator.validate(false)).to.be.false;
      });

      context("when any validator succeeds", function () {

        it("should return true", function () {
          expect(validator.validate(true)).to.be.true;
        });

        it("should skip all following validators", function () {
          var spy = sinon.spy(validators[1], 'validate');
          validator.validate(true);
          expect(spy).to.not.be.called;
        });

      });

    });

  });

});
