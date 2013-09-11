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

      it("should pass the value to #test() on the used pattern", function () {
        var spy = sinon.spy(pattern, 'test');
        var value = 'a';
        var result = validator.validate(value);
        expect(spy).to.be.calledWith(value);
        expect(result).to.equal(spy.getCall(0).returnValue);
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
