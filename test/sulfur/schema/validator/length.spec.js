/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global describe, it */

define([
  'shared',
  'sulfur/schema/validator/length'
], function ($shared, $lengthValidator) {

  'use strict';

  var expect = $shared.expect;
  var bind = $shared.bind;

  describe('sulfur/schema/validator/length', function () {

    describe('#initialize()', function () {

      it("should use 0 as minimum required length when option `min` not given", function () {
        var validator = $lengthValidator.create();
        expect(validator.validate({ length: -1 })).to.be.false;
      });

      it("should reject a negative minimum", function () {
        expect(bind($lengthValidator, 'create', { min: -1 }))
          .to.throw("`min` must be non-negative");
      });

      it("should reject a negative maximum", function () {
        expect(bind($lengthValidator, 'create', { max: -1 }))
          .to.throw("`max` must be non-negative");
      });

      it("should reject a minimum greater than the maximum", function () {
        expect(bind($lengthValidator, 'create', { min: 3, max: 1 }))
          .to.throw("`min` must be less than or equal `max`");
      });

    });

    describe('#validate()', function () {

      it("should return true when a value has a valid length", function () {
        var validator = $lengthValidator.create({ min: 1, max: 3 });
        expect(validator.validate({ length: 2 })).to.be.true;
      });

      it("should return false when a value not satisfies the minimum required length", function () {
        var validator = $lengthValidator.create({ min: 1 });
        expect(validator.validate({ length: 0 })).to.be.false;
      });

      it("should return false when a value exceeds the maximum allowed length", function () {
        var validator = $lengthValidator.create({ max: 3 });
        expect(validator.validate({ length: 4 })).to.be.false;
      });

      it("should accept values of any length greater than the minimum required length when there's no maximum allowed length", function () {
        var validator = $lengthValidator.create({ min: 3 });
        expect(validator.validate({ length: Number.POSITIVE_INFINITY })).to.be.true;
      });

    });

  });

});
