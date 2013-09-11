/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global beforeEach, context, describe, it */

define([
  'shared',
  'sulfur/schema/validator/some'
], function ($shared, $someValidator) {

  'use strict';

  var expect = $shared.expect;
  var sinon = $shared.sinon;
  var bind = $shared.bind;

  describe('sulfur/schema/validator/some', function () {

    describe('#initialize()', function () {

      it("should reject an empty array", function () {
        expect(bind($someValidator, 'create', []))
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
        validator = $someValidator.create(validators);
      });

      it("should pass the value to each validator's #validate() in initialization order", function () {
        var spy1 = sinon.spy(validators[0], 'validate');
        var spy2 = sinon.spy(validators[1], 'validate');
        var value = false;
        validator.validate(value);
        expect(spy2).to.be.calledAfter(spy1);
        expect(spy1).to.be.calledWith(value);
        expect(spy2).to.be.calledWith(value);
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
