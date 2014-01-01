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
  'sulfur/schema/validator/presence'
], function (shared, PresenceValidator) {

  'use strict';

  var expect = shared.expect;
  var sinon = shared.sinon;
  var returns = shared.returns;

  describe('sulfur/schema/validator/presence', function () {

    describe('#validate()', function () {

      var validator;
      var subvalidator;

      beforeEach(function () {
        subvalidator = { validate: function () {} };
        validator = PresenceValidator.create('foo', subvalidator);
      });

      it("should return true when the property value is undefined", function () {
        expect(validator.validate({})).to.be.true;
      });

      context("when the property is defined and not callable", function () {

        var value;

        beforeEach(function () {
          value = { foo: {} };
        });

        it("should call #validate() on the subvalidator with the property value", function () {
          var spy = sinon.spy(subvalidator, 'validate');
          validator.validate(value);
          expect(spy)
            .to.be.calledOn(subvalidator)
            .to.be.calledWith(sinon.match.same(value.foo));
        });

        it("should return true when the subvalidator returns true", function () {
          subvalidator.validate = returns(true);
          expect(validator.validate(value)).to.be.true;
        });

        it("should return false when the subvalidator returns false", function () {
          subvalidator.validate = returns(false);
          expect(validator.validate(value)).to.be.false;
        });

      });

      context("when the property is callable", function () {

        var value;

        beforeEach(function () {
          var v = {};
          value = { foo: function () { return v; } };
        });

        it("should call #validate() on the subvalidator with the property result", function () {
          var spy = sinon.spy(subvalidator, 'validate');
          validator.validate(value);
          expect(spy)
            .to.be.calledOn(subvalidator)
            .to.be.calledWith(sinon.match.same(value.foo()));
        });

        it("should return true when the subvalidator returns true", function () {
          subvalidator.validate = returns(true);
          expect(validator.validate(value)).to.be.true;
        });

        it("should return false when the subvalidator returns false", function () {
          subvalidator.validate = returns(false);
          expect(validator.validate(value)).to.be.false;
        });

      });

    });

  });

});
