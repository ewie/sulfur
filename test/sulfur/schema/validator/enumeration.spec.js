/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global beforeEach, describe, it */

define([
  'shared',
  'sulfur/schema/validator/enumeration'
], function ($shared, $enumerationValidator) {

  'use strict';

  var expect = $shared.expect;
  var bind = $shared.bind;

  describe('sulfur/schema/validator/enumeration', function () {

    describe('#initialize', function () {

      it("should reject an empty array", function () {
        expect(bind($enumerationValidator, 'create', []))
          .to.throw("must specify at least one value");
      });

    });

    describe('#validate()', function () {

      var validator;
      var values;

      beforeEach(function () {
        values = [ 'a', '0' ];
        validator = $enumerationValidator.create(values);
      });

      it("should check for strict equality", function () {
        expect(validator.validate(0)).to.be.false;
      });

      it("should return true on a valid value", function () {
        expect(validator.validate('a')).to.be.true;
      });

      it("should return false on an invalid value", function () {
        expect(validator.validate('b')).to.be.false;
      });

    });

  });

});
