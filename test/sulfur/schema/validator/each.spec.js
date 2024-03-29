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
  'sulfur/schema/validator/each'
], function (shared, EachValidator) {

  'use strict';

  var expect = shared.expect;
  var sinon = shared.sinon;

  describe('sulfur/schema/validator/each', function () {

    describe('#validate()', function () {

      var validator;
      var itemValidator;

      beforeEach(function () {
        itemValidator = {
          validate: function (x) { return x; }
        };
        validator = EachValidator.create(itemValidator);
      });

      it("should invoke the item validator's .validate() for each item", function () {
        var list = [{}, {}];
        var itemValidatorSpy = sinon.spy(itemValidator, 'validate');
        validator.validate(list);
        list.forEach(function (item, i) {
          expect(itemValidatorSpy.getCall(i))
            .to.be.calledOn(itemValidator)
            .and.to.be.calledWith(sinon.match.same(item));
        });
      });

      it("should invoke the item validator's .validate() with the errors array when given", function () {
        var list = [{}, {}];
        var errors = [];
        var itemValidatorSpy = sinon.spy(itemValidator, 'validate');
        validator.validate(list, errors);
        list.forEach(function (item, i) {
          expect(itemValidatorSpy.getCall(i))
            .to.be.calledOn(itemValidator)
            .and.to.be.calledWith(
              sinon.match.same(item),
              sinon.match.same(errors));
        });
      });

      it("should return true when all items are valid", function () {
        expect(validator.validate([true])).to.be.true;
      });

      context("with an invalid item", function () {

        it("should return false", function () {
          expect(validator.validate([false, false])).to.be.false;
        });

        it("should skip the following items", function () {
          var itemValidatorSpy = sinon.spy(itemValidator, 'validate');
          validator.validate([false, false]);
          expect(itemValidatorSpy).to.be.calledOnce;
        });

      });

    });

  });

});
