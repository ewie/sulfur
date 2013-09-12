/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global beforeEach, context, describe, it */

define([
  'shared',
  'sulfur/schema/validator/enumeration'
], function ($shared, $enumerationValidator) {

  'use strict';

  var expect = $shared.expect;
  var bind = $shared.bind;
  var sinon = $shared.sinon;

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

      context("when the tested value responds to #cmp()", function () {

        beforeEach(function () {
          values = [ { dummy: 1 } ];
          validator = $enumerationValidator.create(values);
        });

        it("should call #cmp() on the tested value with the asserted value as argument", function () {
          var value = { cmp: sinon.spy() };
          validator.validate(value);
          expect(value.cmp).to.be.calledOn(value).and.to.be.calledWith(values[0]);
        });

        it("should return as soon as #cmp() returns zero", function () {
          values.push({ dummy: 2 });
          var value = { cmp: sinon.stub().returns(0) };
          validator.validate(value);
          expect(value.cmp).to.be.calledWith(values[0]);
          expect(value.cmp).to.not.be.calledWith(values[1]);
        });

        it("should return true if #cmp() returns zero for any value", function () {
          var value = { cmp: sinon.stub().returns(0) };
          expect(validator.validate(value)).to.be.true;
        });

        it("should return false if #cmp() never returns zero for any value", function () {
          var value = { cmp: sinon.stub().returns(1) };
          expect(validator.validate(value)).to.be.false;
        });

      });

      context("when the tested value does not respond to #cmp()", function () {

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

});
