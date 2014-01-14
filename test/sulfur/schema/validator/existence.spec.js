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
  'sulfur/schema/validator/existence'
], function (shared, ExistenceValidator) {

  'use strict';

  var expect = shared.expect;

  describe('sulfur/schema/validator/existence', function () {

    describe('#initialize()', function () {

      describe("option `errorPrefix`", function () {

        it("should use the value when given", function () {
          var validator = ExistenceValidator.create({ errorPrefix: "foo bar" });
          expect(validator.errorPrefix).to.equal("foo bar");
        });

        it("should use 'must be defined' when not given", function () {
          var validator = ExistenceValidator.create();
          expect(validator.errorPrefix).to.equal("must be defined");
        });

      });

    });

    describe('#errorPrefix', function () {

      it("should return the error message prefixy", function () {
        var v = ExistenceValidator.create({ errorPrefix: 'foo' });
        expect(v.errorPrefix).to.equal('foo');
      });

    });

    describe('#validate()', function () {

      var validator;

      beforeEach(function () {
        validator = ExistenceValidator.create();
      });

      it("should return true when the value is not undefined", function () {
        expect(validator.validate({})).to.be.true;
      });

      it("should return false when the value is undefined", function () {
        expect(validator.validate(undefined)).to.be.false;
      });

      it("should generate an error message from the minimum value when an errors array is given", function () {
        var validator = ExistenceValidator.create({ errorPrefix: "must exist" });
        var errors = [];
        validator.validate(undefined, errors);
        expect(errors).to.have.lengthOf(1);
        expect(errors[0]).to.equal(validator.errorPrefix);
      });

    });

  });

});
