/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global describe, it */

define([
  'shared',
  'sulfur/schema/validator/equal'
], function ($shared, $equalValidator) {

  'use strict';

  var expect = $shared.expect;

  describe('sulfur/schema/validator/equal', function () {

    describe('#validate()', function () {

      it("should return true when the value is equal to the expected value", function () {
        var validator = $equalValidator.create(true);
        expect(validator.validate(true)).to.be.true;
      });

      it("should return false when the value is not equal to the expected value", function () {
        var validator = $equalValidator.create(true);
        expect(validator.validate(false)).to.be.false;
      });

      it("should test for strict equality", function () {
        var validator = $equalValidator.create(0);
        expect(validator.validate('0')).to.be.false;
      });

    });

  });

});
