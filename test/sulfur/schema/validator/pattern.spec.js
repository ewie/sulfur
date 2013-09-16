/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global beforeEach, describe, it */

define([
  'shared',
  'sulfur/schema/validator/pattern'
], function ($shared, $patternValidator) {

  'use strict';

  var expect = $shared.expect;
  var sinon = $shared.sinon;

  describe('sulfur/schema/validator/pattern', function () {

    describe('#validate()', function () {

      var validator;
      var pattern;

      beforeEach(function () {
        pattern = /^[a-z]$/;
        validator = $patternValidator.create(pattern);
      });

      it("should return the result of calling #test() on the pattern with value#toString() as argument", function () {
        var spy = sinon.spy(pattern, 'test');
        var value = { toString: sinon.stub().returns('a') };
        var result = validator.validate(value);
        expect(spy)
          .to.be.calledOn(pattern)
          .to.be.calledWith(value.toString.returnValue)
          .to.have.returned(result);
      });

      it("should return true when a value satisfies the pattern", function () {
        expect(validator.validate('a')).to.be.true;
      });

      it("should return false when a value does not satisfy the pattern", function () {
        expect(validator.validate('1')).to.be.false;
      });

    });

  });

});
