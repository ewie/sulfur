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
  var returns = shared.returns;

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

      it("should use the value of option `message` as error message", function () {
        var v = EnumerationValidator.create([{}], { message: 'some message' });
        expect(v.message).to.equal('some message');
      });

      it("should use 'must be ???' as default message", function () {
        var v = EnumerationValidator.create([{}]);
        expect(v.message).to.equal('must be ???');
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

    describe('#message', function () {

      it("should return the error message", function () {
        var v = EnumerationValidator.create([{}], { message: "foo" });
        expect(v.message).to.equal('foo');
      });

    });

    describe('#validate()', function () {

      var validator;
      var values;

      context("with an errors array", function () {

        function mockValue(s) {
          return {
            match: sinon.stub().returnsArg(0),
            toString: returns(s)
          };
        }

        beforeEach(function () {
          values = [ mockValue('x'), mockValue('y'), mockValue('z') ];
          validator = EnumerationValidator.create(values,
            { testMethod: 'match', message: "should be ???" });
        });

        it("should generate an error message from the allowed values", function () {
          var errors = [];
          validator.validate(false, errors);
          expect(errors).to.have.lengthOf(1);
          expect(errors[0]).to.equal("should be x, y or z");
        });

      });

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
