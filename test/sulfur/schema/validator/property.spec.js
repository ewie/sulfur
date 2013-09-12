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
      var property;

      beforeEach(function () {
        property = 'foo';
        subvalidator = { validate: function () {} };
        validator = $propertyValidator.create(property, subvalidator);
      });

      it("should call #validate() on the subvalidator with the property's value as argument", function () {
        var spy = sinon.spy(subvalidator, 'validate');
        var obj = { foo: {} };
        validator.validate(obj);
        expect(spy)
          .to.be.calledOn(subvalidator)
          .and.to.be.calledWithMatch(sinon.match.same(obj.foo));
      });

      it("should return true when the subvalidator returns true", function () {
        sinon.stub(subvalidator, 'validate').returns(true);
        expect(validator.validate({})).to.be.true;
      });

      it("should return false when the subvalidator returns false", function () {
        sinon.stub(subvalidator, 'validate').returns(false);
        expect(validator.validate({})).to.be.false;
      });

      context("when the property is callable", function () {

        it("should pass the property's result to the subvalidator", function () {
          var spy = sinon.spy(subvalidator, 'validate');
          var dummy = {};
          var obj = { foo: function () { return dummy; } };
          validator.validate(obj);
          expect(spy).to.be.calledWithMatch(sinon.match.same(dummy));
        });

        it("should call the property on the object", function () {
          var obj = { foo: sinon.spy() };
          validator.validate(obj);
          expect(obj.foo).to.be.calledOn(obj);
        });

      });

    });

  });

});
