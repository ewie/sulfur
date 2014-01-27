/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global beforeEach, describe, it */

define([
  'shared',
  'sulfur/schema/validator/pattern'
], function (shared, PatternValidator) {

  'use strict';

  var expect = shared.expect;
  var sinon = shared.sinon;

  describe('sulfur/schema/validator/pattern', function () {

    describe('#initialize()', function () {

      describe("option `message`", function () {

        it("should use the value when given", function () {
          var validator = PatternValidator.create(null, { message: "foo bar" });
          expect(validator.message).to.equal("foo bar");
        });

        it("should use 'must match pattern ???' when not given", function () {
          var validator = PatternValidator.create();
          expect(validator.message).to.equal("must match pattern ???");
        });

      });

    });

    describe('#message', function () {

      it("should return the error message", function () {
        var v = PatternValidator.create(null, { message: 'foo' });
        expect(v.message).to.equal('foo');
      });

    });

    describe('#validate()', function () {

      var validator;
      var pattern;

      beforeEach(function () {
        pattern = /^[a-z]$/;
        validator = PatternValidator.create(pattern);
      });

      it("should return the result of calling .test() on the pattern with value as argument", function () {
        var spy = sinon.spy(pattern, 'test');
        var value = {};
        var result = validator.validate(value);
        expect(spy)
          .to.be.calledOn(pattern)
          .to.be.calledWith(sinon.match.same(value))
          .to.have.returned(result);
      });

      it("should return true when a value satisfies the pattern", function () {
        expect(validator.validate('a')).to.be.true;
      });

      it("should return false when a value does not satisfy the pattern", function () {
        expect(validator.validate('1')).to.be.false;
      });

      it("should generate an error message from the minimum value when an errors array is given", function () {
        var validator = PatternValidator.create(/^[0-9]$/,
          { message: "should match ???" });
        var errors = [];
        validator.validate(null, errors);
        expect(errors).to.have.lengthOf(1);
        expect(errors[0]).to.equal("should match ^[0-9]$");
      });

    });

  });

});
