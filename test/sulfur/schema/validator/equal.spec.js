/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global describe, it */

define([
  'shared',
  'sulfur/schema/validator/equal'
], function (shared, EqualValidator) {

  'use strict';

  var expect = shared.expect;
  var returns = shared.returns;

  describe('sulfur/schema/validator/equal', function () {

    describe('#initialize()', function () {

      describe("option `errorPrefix`", function () {

        it("should use the value when given", function () {
          var validator = EqualValidator.create(null, { errorPrefix: "foo bar" });
          expect(validator.errorPrefix).to.equal("foo bar");
        });

        it("should use 'must be equal to' when not given", function () {
          var validator = EqualValidator.create();
          expect(validator.errorPrefix).to.equal("must be equal to");
        });

      });

    });

    describe('#errorPrefix', function () {

      it("should return the error message prefixy", function () {
        var v = EqualValidator.create(null, { errorPrefix: 'foo' });
        expect(v.errorPrefix).to.equal('foo');
      });

    });

    describe('#validate()', function () {

      it("should generate an error message from the minimum value when an errors array is given", function () {
        var validator = EqualValidator.create(
          { toString: returns('xxx') },
          { errorPrefix: "should be" });
        var errors = [];
        validator.validate(null, errors);
        expect(errors).to.have.lengthOf(1);
        expect(errors[0]).to.equal(validator.errorPrefix + " \u201Cxxx\u201D");
      });

      it("should return true when the value is equal to the expected value", function () {
        var validator = EqualValidator.create(true);
        expect(validator.validate(true)).to.be.true;
      });

      it("should return false when the value is not equal to the expected value", function () {
        var validator = EqualValidator.create(true);
        expect(validator.validate(false)).to.be.false;
      });

      it("should test for strict equality", function () {
        var validator = EqualValidator.create(0);
        expect(validator.validate('0')).to.be.false;
      });

    });

  });

});
