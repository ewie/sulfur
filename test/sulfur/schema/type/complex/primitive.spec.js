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
    $shared,
    $element,
    $elements,
    $qname,
    $primitiveType,
    $allValidator,
    $propertyValidator,
    $prototypeValidator
) {

  'use strict';

  var expect = $shared.expect;
  var returns = $shared.returns;

  describe('sulfur/schema/type/complex/primitive', function () {

    var type;
    var qname;
    var valueType;
    var elements;

    beforeEach(function () {
      qname = $qname.create('foo', 'urn:bar');
      valueType = {};
      elements = $elements.create([
        $element.create('x', { createValidator: returns({}) })
      ]);
      type = $primitiveType.create({
        qname: qname,
        valueType: valueType,
        elements: elements
      });
    });

    describe('#getQName()', function () {

      it("should return the qualified name", function () {
        expect(type.getQName()).to.equal(qname);
      });

    });

    describe('#getValueType()', function () {

      it("should return the value type", function () {
        expect(type.getValueType()).to.equal(valueType);
      });

    });

    describe('#getAllowedElements()', function () {

      it("should return the elements", function () {
        expect(type.getAllowedElements()).to.equal(elements);
      });

    });

    describe('#createValidator()', function () {

      it("should return a sulfur/schema/validator/all", function () {
        var v = type.createValidator();
        expect($allValidator.prototype).to.be.prototypeOf(v);
      });

      it("should include a sulfur/schema/validator/prototype using the value type's prototype", function () {
        var v = type.createValidator();
        expect(v.getValidators()).to.include.something.eql(
          $prototypeValidator.create(valueType.prototype));
      });

      it("should include a sulfur/schema/validator/property with method 'getValue', the element name as argument, and the element type's validator", function () {
        var v = type.createValidator();
        expect(v.getValidators()).to.include.something.eql(
          $propertyValidator.create('getValue',
            elements.getElement('x').getType().createValidator(),
            [ 'x' ]));
      });

    });

  });

});
