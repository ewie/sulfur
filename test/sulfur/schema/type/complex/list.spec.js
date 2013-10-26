/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global beforeEach, describe, it */

define([
  'shared',
  'sulfur/schema/type/complex/list',
  'sulfur/schema/validator/all',
  'sulfur/schema/validator/each',
  'sulfur/schema/validator/maximum',
  'sulfur/schema/validator/minimum',
  'sulfur/schema/validator/property'
], function (
    shared,
    ListType,
    AllValidator,
    EachValidator,
    MaximumValidator,
    MinimumValidator,
    PropertyValidator
) {

  'use strict';

  var expect = shared.expect;
  var returns = shared.returns;

  describe('sulfur/schema/type/complex/list', function () {

    describe('#element', function () {

      it("should return the element", function () {
        var element = {};
        var type = ListType.create(element);
        expect(type.element).to.equal(element);
      });

    });

    describe('#maxLength', function () {

      it("should return the allowed maximum number of entries when defined", function () {
        var type = ListType.create(undefined, { maxLength: 1 });
        expect(type.maxLength).to.equal(1);
      });

      it("should return undefined when no bound is defined", function () {
        var type = ListType.create();
        expect(type.maxLength).to.be.undefined;
      });

    });

    describe('#minLength', function () {

      it("should return the required minimum number of entries when defined", function () {
        var type = ListType.create(undefined, { minLength: 1 });
        expect(type.minLength).to.equal(1);
      });

      it("should return undefined when no bound is defined", function () {
        var type = ListType.create();
        expect(type.minLength).to.be.undefined;
      });

    });

    describe('#createValidator()', function () {

      var element;

      beforeEach(function () {
        var itemType = {
          createValidator: returns({ validate: returns() })
        };
        element = { type: itemType };
      });

      it("should return a sulfur/schema/validator/all", function () {
        var type = ListType.create(element);
        var v = type.createValidator();
        expect(AllValidator.prototype).to.be.prototypeOf(v);
      });

      it("should include a sulfur/schema/validator/property with property 'length' and a sulfur/schema/validator/maximum when a maximum length is defined", function () {
        var type = ListType.create(element, { maxLength: 3 });
        var v = type.createValidator();
        expect(v.validators).to.include.something.eql(
          PropertyValidator.create('length',
            MaximumValidator.create(3)));
      });

      it("should include a sulfur/schema/validator/property with property 'length' and a sulfur/schema/validator/minimum when a minimum length is defined", function () {
        var type = ListType.create(element, { minLength: 2 });
        var v = type.createValidator();
        expect(v.validators).to.include.something.eql(
          PropertyValidator.create('length',
            MinimumValidator.create(2)));
      });

      it("should include a sulfur/schema/validator/property with method 'toArray' and a sulfur/schema/validator/each using the element type's validator", function () {
        var type = ListType.create(element);
        var v = type.createValidator();
        expect(v.validators).to.include.something.eql(
          PropertyValidator.create('toArray',
            EachValidator.create(type.element.type.createValidator())));
      });

      it("should include no sulfur/schema/validator/property with property 'length' and a sulfur/schema/validator/maximum when a maximum length is not defined", function () {
        var type = ListType.create(element);
        var v = type.createValidator();
        expect(v.validators).to.not.include.something.eql(
          PropertyValidator.create('length',
            MaximumValidator.create(3)));
      });

      it("should include no sulfur/schema/validator/property with property 'length' and a sulfur/schema/validator/minimum when a minimum length is not defined", function () {
        var type = ListType.create(element);
        var v = type.createValidator();
        expect(v.validators).to.not.include.something.eql(
          PropertyValidator.create('length',
            MinimumValidator.create(2)));
      });

    });

  });

});
