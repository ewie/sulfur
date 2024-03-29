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
  'sulfur/schema/element',
  'sulfur/schema/elements',
  'sulfur/schema/type/complex/primitive',
  'sulfur/schema/type/complex/restricted',
  'sulfur/schema/validator/all',
  'sulfur/schema/validator/property',
  'sulfur/schema/validator/prototype'
], function (
    shared,
    Element,
    Elements,
    PrimitiveType,
    RestrictedType,
    AllValidator,
    PropertyValidator,
    PrototypeValidator
) {

  'use strict';

  var expect = shared.expect;
  var sinon = shared.sinon;
  var bind = shared.bind;
  var returns = shared.returns;

  describe('sulfur/schema/type/complex/restricted', function () {

    describe('#initialize()', function () {

      it("should reject missing elements", function () {
        var type = {};
        var valueType = {
          allowedElements: Elements.create(
            [ Element.create('foo', type),
              Element.create('bar', type)
            ])
        };
        var primitive = PrimitiveType.create({ valueType: valueType });
        var elements = Elements.create(
          [ Element.create('foo', type) ]);
        expect(bind(RestrictedType, 'create', primitive, elements))
          .to.throw('expecting element with name "bar"');
      });

      it("should reject elements not defined by the primitive", function () {
        var type = { isRestrictionOf: returns(true) };
        var valueType = {
          allowedElements: Elements.create([ Element.create('foo', type) ])
        };
        var primitive = PrimitiveType.create({ valueType: valueType });
        var elements = Elements.create(
          [ Element.create('foo', type),
            Element.create('bar', type)
          ]);
        expect(bind(RestrictedType, 'create', primitive, elements))
          .to.throw('unexpected element with name "bar"');
      });

      it("should reject any element with a type less restrictive than the type of the corresponding element of the primitive", function () {
        var type = { isRestrictionOf: returns(false) };
        var valueType = {
          allowedElements: Elements.create([ Element.create('foo', type) ])
        };
        var primitive = PrimitiveType.create({ valueType: valueType });
        var elements = Elements.create(
          [ Element.create('foo', type) ]);
        expect(bind(RestrictedType, 'create', primitive, elements))
          .to.throw('element "foo" is not a restriction of the corresponding primitive element');

      });

    });

    describe('#primitive', function () {

      it("should return the primitive type", function () {
        var type = { isRestrictionOf: returns(true) };
        var valueType = {
          allowedElements: Elements.create([ Element.create('foo', type) ])
        };
        var primitive = PrimitiveType.create({ valueType: valueType });
        var elements = Elements.create(
          [ Element.create('foo', type) ]);
        var restriction = RestrictedType.create(primitive, elements);
        expect(restriction.primitive).to.equal(primitive);
      });

    });

    describe('#valueType', function () {

      it("should return the primitive's value type", function () {
        var type = { isRestrictionOf: returns(true) };
        var valueType = {
          allowedElements: Elements.create([ Element.create('foo', type) ])
        };
        var primitive = PrimitiveType.create({ valueType: valueType });
        var elements = Elements.create(
          [ Element.create('foo', type) ]);
        var restriction = RestrictedType.create(primitive, elements);
        expect(restriction.valueType).to.equal(valueType);
      });

    });

    describe('#elements', function () {

      it("should return the elements", function () {
        var type = { isRestrictionOf: returns(true) };
        var valueType = {
          allowedElements: Elements.create([ Element.create('foo', type) ])
        };
        var primitive = PrimitiveType.create({ valueType: valueType });
        var elements = Elements.create(
          [ Element.create('foo', type) ]);
        var restriction = RestrictedType.create(primitive, elements);
        expect(restriction.elements).to.equal(elements);
      });

    });

    describe('#isRestrictionOf()', function () {

      context("when the other type is a sulfur/schema/type/complex/primitive", function () {

        it("should delegate to this restriction primitive's .isRestrictionOf()", function () {
          var type = { isRestrictionOf: returns(true) };
          var element = Element.create('foo', type);
          var valueType = { allowedElements: Elements.create([ element ]) };
          var otherValueType = { allowedElements: Elements.create([ element ]) };
          var primitive = PrimitiveType.create({ valueType: valueType });
          var otherPrimitive = PrimitiveType.create({ valueType: otherValueType });
          var restriction = RestrictedType.create(primitive,
            Elements.create([ element ]));
          var spy = sinon.spy(primitive, 'isRestrictionOf');
          var r = restriction.isRestrictionOf(otherPrimitive);
          expect(spy)
            .to.be.calledWith(sinon.match.same(otherPrimitive))
            .to.have.returned(r);
        });

      });

      context("when the other type is a sulfur/schema/type/complex/restricted", function () {

        it("should delegate to this restriction primitive's .isRestrictionOf()", function () {
          var type = { isRestrictionOf: returns(true) };
          var element = Element.create('foo', type);
          var valueType = { allowedElements: Elements.create([ element ]) };
          var otherValueType = { allowedElements: Elements.create([ element ]) };
          var primitive = PrimitiveType.create({ valueType: valueType });
          var otherPrimitive = PrimitiveType.create({ valueType: otherValueType });
          var restriction = RestrictedType.create(primitive,
            Elements.create([ element ]));
          var otherRestriction = RestrictedType.create(otherPrimitive,
            Elements.create([ element ]));
          var spy = sinon.spy(primitive, 'isRestrictionOf');
          var r = restriction.isRestrictionOf(otherRestriction);
          expect(spy)
            .to.be.calledWith(sinon.match.same(otherPrimitive))
            .to.have.returned(r);
        });

        it("should return true when every element type of this restriction is a restriction of the corresponding element type of the other restriction", function () {
          var type = { isRestrictionOf: returns(true) };
          var otherType = { isRestrictionOf: returns(true) };
          var element = Element.create('foo', type);
          var otherElement = Element.create('foo', otherType);
          var valueType = { allowedElements: Elements.create([ element ]) };
          var primitive = PrimitiveType.create({ valueType: valueType });
          var restriction = RestrictedType.create(primitive,
            Elements.create([ element ]));
          var otherRestriction = RestrictedType.create(primitive,
            Elements.create([ otherElement ]));
          var spy = sinon.spy(type, 'isRestrictionOf');
          var r = restriction.isRestrictionOf(otherRestriction);
          expect(r).to.be.true;
          expect(spy).to.be.calledWith(sinon.match.same(otherType));
        });

        it("should return false when any element type of this restriction is not a restriction of the corresponding element type of the other restriction", function () {
          var type = { isRestrictionOf: returns(true) };
          var otherType = { isRestrictionOf: returns(true) };
          var element = Element.create('foo', type);
          var otherElement = Element.create('foo', otherType);
          var valueType = { allowedElements: Elements.create([ element ]) };
          var primitive = PrimitiveType.create({ valueType: valueType });
          var restriction = RestrictedType.create(primitive,
            Elements.create([ element ]));
          var otherRestriction = RestrictedType.create(primitive,
            Elements.create([ otherElement ]));
          var spy = sinon.stub(type, 'isRestrictionOf').returns(false);
          var r = restriction.isRestrictionOf(otherRestriction);
          expect(r).to.be.false;
          expect(spy).to.be.calledWith(sinon.match.same(otherType));
        });

      });

    });

    describe('#createValidator()', function () {

      var restriction;
      var valueType;
      var elements;

      beforeEach(function () {
        var type = {
          isRestrictionOf: returns(true),
          createValidator: returns({})
        };
        valueType = {
          prototype: {},
          allowedElements: Elements.create([ Element.create('foo', type) ])
        };
        var primitive = PrimitiveType.create({ valueType: valueType });
        elements = Elements.create(
          [ Element.create('foo', type) ]);
        restriction = RestrictedType.create(primitive, elements);
      });

      it("should return a sulfur/schema/validator/all", function () {
        var v = restriction.createValidator();
        expect(AllValidator.prototype).to.be.prototypeOf(v);
      });

      it("should include a sulfur/schema/validator/prototype using the value type's prototype", function () {
        var v = restriction.createValidator();
        expect(v.validators).to.include.something.eql(
          PrototypeValidator.create(valueType.prototype));
      });

      it("should include a sulfur/schema/validator/property with property 'value', the element name as argument, and the element type's validator", function () {
        var v = restriction.createValidator();
        expect(v.validators).to.include.something.eql(
          PropertyValidator.create('value',
            elements.getByName('foo').type.createValidator(),
            [ 'foo' ]));
      });

    });

  });

});
