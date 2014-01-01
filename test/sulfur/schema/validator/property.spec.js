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
  'sulfur/schema/validator/property'
], function (shared, PropertyValidator) {

  'use strict';

  var expect = shared.expect;
  var sinon = shared.sinon;
  var returns = shared.returns;

  describe('sulfur/schema/validator/property', function () {

    describe('#propertyName', function () {

      it("should return the property name", function () {
        var name = 'foo';
        var validator = PropertyValidator.create(name);
        expect(validator.propertyName).to.equal(name);
      });

    });

    describe('#args', function () {

      it("should return an array with arguments to the property", function () {
        var args = [];
        var validator = PropertyValidator.create('', {}, args);
        expect(validator.args).to.eql(args);
      });

    });

    describe('#validator', function () {

      it("should return the subvalidator", function () {
        var subvalidator = {};
        var validator = PropertyValidator.create('', subvalidator);
        expect(validator.validator).to.equal(subvalidator);
      });

    });

    describe('#validate()', function () {

      var validator;
      var subvalidator;
      var argument;

      beforeEach(function () {
        subvalidator = { validate: function () {} };
        argument = {};
        validator = PropertyValidator.create('foo', subvalidator, [ argument ]);
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
          value = { foo: returns({}) };
        });

        it("should call the property with the arguments", function () {
          var spy = sinon.spy(value, 'foo');
          validator.validate(value);
          expect(spy)
            .to.be.calledOn(sinon.match.same(value))
            .to.be.calledWith(sinon.match.same(argument));
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
