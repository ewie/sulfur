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

    });

  });

});
