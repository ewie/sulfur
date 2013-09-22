/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global beforeEach, context, describe, it */

define([
  'shared',
  'sulfur/schema/validator/property'
], function ($shared, $propertyValidator) {

  'use strict';

  var expect = $shared.expect;
  var sinon = $shared.sinon;

  describe('sulfur/schema/validator/property', function () {

    describe('#validate()', function () {

      var validator;
      var subvalidator;

      beforeEach(function () {
        subvalidator = { validate: function () {} };
        validator = $propertyValidator.create('foo', subvalidator);
      });

      context("when the property is not callable", function () {

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
          sinon.stub(subvalidator, 'validate').returns(true);
          expect(validator.validate(value)).to.be.true;
        });

        it("should return false when the subvalidator returns false", function () {
          sinon.stub(subvalidator, 'validate').returns(false);
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
          sinon.stub(subvalidator, 'validate').returns(true);
          expect(validator.validate(value)).to.be.true;
        });

        it("should return false when the subvalidator returns false", function () {
          sinon.stub(subvalidator, 'validate').returns(false);
          expect(validator.validate(value)).to.be.false;
        });

      });

    });

  });

});
