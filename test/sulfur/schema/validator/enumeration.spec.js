/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global beforeEach, context, describe, it */

define([
  'shared',
  'sulfur/schema/validator/enumeration'
], function (shared, EnumerationValidator) {

  'use strict';

  var expect = shared.expect;
  var sinon = shared.sinon;
  var bind = shared.bind;

  describe('sulfur/schema/validator/enumeration', function () {

    describe('#initialize', function () {

      it("should reject an empty array", function () {
        expect(bind(EnumerationValidator, 'create', []))
          .to.throw("must specify at least one value");
      });

      context("with option `testMethod`", function () {

        it("should use the value as name of the test method", function () {
          var v = EnumerationValidator.create(
            [{ test: function () {} }],
            { testMethod: 'test' });
          expect(v.testMethodName).to.equal('test');
        });

        it("should reject when none of the allowed values responds to the test method", function () {
          expect(bind(EnumerationValidator, 'create', [{}], { testMethod: 'foo' }))
            .to.throw('each allowed value must respond to method "foo"');
        });

      });

    });

    describe('#testMethodName', function () {

      it("should return the name of the test method when defined", function () {
        var v = EnumerationValidator.create(
          [{ matches: function () {} }],
          { testMethod: 'matches' });
        expect(v.testMethodName).to.equal('matches');
      });

      it("should return undefined when the test method name is not defined", function () {
        var v = EnumerationValidator.create([{}]);
        expect(v.testMethodName).to.be.undefined;
      });

    });

    describe('#validate()', function () {

      var validator;
      var values;

      context("when the test method name is defined", function () {

        beforeEach(function () {
          values = [ { match: sinon.stub().returnsArg(0) } ];
          validator = EnumerationValidator.create(values, { testMethod: 'match' });
        });

        it("should call the test method on each allowed value with the tested value as argument", function () {
          var value = {};
          validator.validate(value);
          expect(values[0].match)
            .to.be.calledOn(sinon.match.same(values[0]))
            .to.be.calledWith(sinon.match.same(value));
        });

        it("should return as soon as the test method returns true", function () {
          values.push({ match: sinon.spy() });
          var value = {};
          validator.validate(value);
          expect(values[0].match).to.be.called;
          expect(values[1].match).to.not.be.called;
        });

        it("should return true if the test method returns true for any value", function () {
          var value = {};
          expect(validator.validate(value)).to.be.true;
        });

        it("should return false if the test method never returns true for any value", function () {
          var value = false;
          expect(validator.validate(value)).to.be.false;
        });

      });

      context("when the test method name is not defined", function () {

        beforeEach(function () {
          values = [ 'a', '0' ];
          validator = EnumerationValidator.create(values);
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
