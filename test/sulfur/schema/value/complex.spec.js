/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global beforeEach, context, describe, it */

define([
  'shared',
  'sulfur/schema/element',
  'sulfur/schema/elements',
  'sulfur/schema/value/complex',
  'sulfur/schema/value/simple/string'
], function (shared, Element, Elements, ComplexValue, StringValue) {

  'use strict';

  var expect = shared.expect;
  var sinon = shared.sinon;
  var bind = shared.bind;
  var returns = shared.returns;

  describe('sulfur/schema/value/complex', function () {

    describe('#initialize()', function () {

      var DerivedComplexValue;
      var allowedElement;
      var type;
      var validator;

      beforeEach(function () {
        validator = { validate: returns(true) };
        type = { createValidator: returns(validator) };
        allowedElement = Element.create('foo', type);
        var allowedElements = Elements.create([ allowedElement ]);
        DerivedComplexValue = ComplexValue.clone({
          allowedElements: allowedElements
        });
      });

      it("should initialize with an array of name/value pairs", function () {
        var values = [
          [ 'foo', StringValue.create() ]
        ];
        var type = DerivedComplexValue.create(values);
        expect(type.value('foo')).to.equal(values[0][1]);
      });

      it("should reject unexpected values", function () {
        expect(bind(DerivedComplexValue, 'create', [ [ 'xxx', null ] ]))
          .to.throw('unexpected value "xxx"');
      });

      it("should validate each value", function () {
        var value = {};
        var spy = sinon.spy(validator, 'validate');
        DerivedComplexValue.create([ [ 'foo', value ] ]);
        expect(spy).to.be.calledWith(sinon.match.same(value));
      });

      it("should reject invalid values", function () {
        validator.validate = returns(false);
        expect(bind(DerivedComplexValue, 'create', [ [ 'foo', null ] ]))
          .to.throw('invalid value "foo"');
      });

      it("should reject missing mandatory values", function () {
        expect(bind(DerivedComplexValue, 'create', []))
          .to.throw('missing value "foo"');
      });

      it("should reject duplicate values", function () {
        var values = [
          [ 'foo', StringValue.create() ],
          [ 'foo', StringValue.create() ]
        ];
        expect(bind(DerivedComplexValue, 'create', values))
          .to.throw('duplicate value "foo"');
      });

    });

    describe('#value()', function () {

      var DerivedComplexValue;

      beforeEach(function () {
        var type = {
          createValidator: function () {
            return { validate: returns(true) };
          }
        };
        var allowedElements = Elements.create([
          Element.create('foo', type)
        ]);
        DerivedComplexValue = ComplexValue.clone({
          allowedElements: allowedElements
        });
      });

      var type;
      var values;

      beforeEach(function () {
        values = [ [ 'foo', StringValue.create() ] ];
        type = DerivedComplexValue.create(values);
      });

      it("should return the value associated with the given name", function () {
        expect(type.value('foo')).to.equal(values[0][1]);
      });

      it("should reject when the given name is not associated with any value", function () {
        expect(bind(type, 'value', 'bar'))
          .to.throw('name "bar" is not associated with any value');
      });

    });

    describe('#eq()', function () {

      var DerivedComplexValue;

      beforeEach(function () {
        var type = {
          createValidator: function () {
            return { validate: returns(true) };
          }
        };
        var allowedElements = Elements.create([
          Element.create('x', type, { optional: true }),
          Element.create('y', type, { optional: true })
        ]);
        DerivedComplexValue = ComplexValue.clone({
          allowedElements: allowedElements
        });
      });

      it("should return false when LHS and RHS are of different prototype", function () {
        var lhs = DerivedComplexValue.create([]);
        expect(lhs.eq({})).to.be.false;
      });

      context("when LHS and RHS have the same prototype", function () {

        it("should return true when each LHS value is equal to the respective RHS value", function () {
          var lx = { eq: sinon.stub().returns(true) };
          var ly = { eq: sinon.stub().returns(true) };
          var rx = {};
          var ry = {};
          var lhs = DerivedComplexValue.create([
            [ 'x', lx ],
            [ 'y', ly ]
          ]);
          var rhs = DerivedComplexValue.create([
            [ 'x', rx ],
            [ 'y', ry ]
          ]);
          expect(lhs.eq(rhs)).to.be.true;
          expect(lx.eq).to.be.calledWith(sinon.match.same(rx));
          expect(ly.eq).to.be.calledWith(sinon.match.same(ry));
        });

        it("should return false when any LHS value is not equal to the respective RHS value", function () {
          var lx = { eq: sinon.stub().returns(false) };
          var ly = { eq: sinon.stub().returns(true) };
          var rx = {};
          var ry = {};
          var lhs = DerivedComplexValue.create([
            [ 'x', lx ],
            [ 'y', ly ]
          ]);
          var rhs = DerivedComplexValue.create([
            [ 'x', rx ],
            [ 'y', ry ]
          ]);
          expect(lhs.eq(rhs)).to.be.false;
          expect(lx.eq).to.be.calledWith(sinon.match.same(rx));
          expect(ly.eq).to.not.be.called;
        });

      });

    });

  });

});
