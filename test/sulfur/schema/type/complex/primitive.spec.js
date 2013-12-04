/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global beforeEach, describe, it */

define([
  'shared',
  'sulfur/schema/element',
  'sulfur/schema/elements',
  'sulfur/schema/qname',
  'sulfur/schema/type/complex/primitive',
  'sulfur/schema/validator/all',
  'sulfur/schema/validator/property',
  'sulfur/schema/validator/prototype'
], function (
    shared,
    Element,
    Elements,
    QName,
    PrimitiveType,
    AllValidator,
    PropertyValidator,
    PrototypeValidator
) {

  'use strict';

  var expect = shared.expect;
  var returns = shared.returns;

  describe('sulfur/schema/type/complex/primitive', function () {

    var type;
    var qname;
    var valueType;
    var elements;

    beforeEach(function () {
      qname = QName.create('foo', 'urn:example:bar');
      elements = Elements.create([
        Element.create('x', { createValidator: returns({}) })
      ]);
      valueType = {
        allowedElements: elements
      };
      type = PrimitiveType.create({
        qname: qname,
        valueType: valueType
      });
    });

    describe('#qname', function () {

      it("should return the qualified name", function () {
        expect(type.qname).to.equal(qname);
      });

    });

    describe('#valueType', function () {

      it("should return the value type", function () {
        expect(type.valueType).to.equal(valueType);
      });

    });

    describe('#allowedElements', function () {

      it("should return the elements", function () {
        expect(type.allowedElements).to.equal(elements);
      });

    });

    describe('#isRestrictionOf()', function () {

      it("should return true when this type and the other type are identical", function () {
        var type = PrimitiveType.create({});
        expect(type.isRestrictionOf(type)).to.be.true;
      });

    });

    describe('#createValidator()', function () {

      it("should return a sulfur/schema/validator/all", function () {
        var v = type.createValidator();
        expect(AllValidator.prototype).to.be.prototypeOf(v);
      });

      it("should include a sulfur/schema/validator/prototype using the value type's prototype", function () {
        var v = type.createValidator();
        expect(v.validators).to.include.something.eql(
          PrototypeValidator.create(valueType.prototype));
      });

      it("should include a sulfur/schema/validator/property with property 'value', the element name as argument, and the element type's validator", function () {
        var v = type.createValidator();
        expect(v.validators).to.include.something.eql(
          PropertyValidator.create('value',
            elements.getByName('x').type.createValidator(),
            [ 'x' ]));
      });

    });

  });

});
