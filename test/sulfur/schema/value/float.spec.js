/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global afterEach, beforeEach, describe, it */

define([
  'shared',
  'sulfur/schema/value/double',
  'sulfur/schema/value/float'
],function ($shared, $doubleValue, $floatValue) {

  'use strict';

  var expect = $shared.expect;
  var bind = $shared.bind;
  var sinon = $shared.sinon;

  describe('sulfur/schema/float', function () {

    var sandbox;

    beforeEach(function () {
      sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
      sandbox.restore();
    });

    it("should be derived from sulfur/schema/double", function () {
      expect($doubleValue).to.be.prototypeOf($floatValue);
    });

    describe('.getMaxValue()', function () {

      it("should return 3.4028234663852886E+38", function () {
        expect($floatValue.getMaxValue()).to.equal(3.4028234663852886E+38);
      });

    });

    describe('#initialize()', function () {

      it("should call sulfur/schema/double#initialize()", function () {
        var doubleInitializeSpy = sandbox.spy($doubleValue.prototype, 'initialize');
        var value = 123.456;
        var f = $floatValue.create(value);
        expect(doubleInitializeSpy).to.be.calledOn(f).and.be.calledWith(value);
      });

      it("should reject a finite value less than -(.getMinValue())", function () {
        expect(bind($floatValue, 'create', -$floatValue.getMaxValue() * 2))
          .to.throw("must not be less than " + -$floatValue.getMaxValue());
      });

      it("should reject a finite value greater than .getMaxValue()", function () {
        expect(bind($floatValue, 'create', $floatValue.getMaxValue() * 2))
          .to.throw("must not be greater than " + $floatValue.getMaxValue());
      });

    });

  });

});
