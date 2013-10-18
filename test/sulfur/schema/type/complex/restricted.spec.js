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
  'sulfur/schema/type/complex/primitive',
  'sulfur/schema/type/complex/restricted',
  'sulfur/schema/validator/all',
  'sulfur/schema/validator/property',
  'sulfur/schema/validator/prototype'
], function (
    $shared,
    $element,
    $elements,
    $primitiveType,
    $restrictedType,
    $allValidator,
    $propertyValidator,
    $prototypeValidator
) {

  'use strict';

  var expect = $shared.expect;
  var bind = $shared.bind;
  var returns = $shared.returns;

  describe('sulfur/schema/type/complex/restricted', function () {

    describe('#initialize()', function () {

      it("should reject missing elements", function () {
        var type = {};
        var primitive = $primitiveType.create(
          { elements: $elements.create(
              [ $element.create('foo', type),
                $element.create('bar', type)
              ])
          });
        var elements = $elements.create(
          [ $element.create('foo', type) ]);
        expect(bind($restrictedType, 'create', primitive, elements))
          .to.throw('expecting element with name "bar"');
      });

      it("should reject elements not defined by the primitive", function () {
        var type = { isRestrictionOf: returns(true) };
        var primitive = $primitiveType.create(
          { elements: $elements.create(
              [ $element.create('foo', type) ])
          });
        var elements = $elements.create(
          [ $element.create('foo', type),
            $element.create('bar', type)
          ]);
        expect(bind($restrictedType, 'create', primitive, elements))
          .to.throw('unexpected element with name "bar"');
      });

      it("should reject any element with a type less restrictive than the type of the corresponding element of the primitive", function () {
        var type = { isRestrictionOf: returns(false) };
        var primitive = $primitiveType.create(
          { elements: $elements.create(
              [ $element.create('foo', type) ])
          });
        var elements = $elements.create(
          [ $element.create('foo', type) ]);
        expect(bind($restrictedType, 'create', primitive, elements))
          .to.throw('element "foo" is not a restriction of the corresponding primitive element');

      });

    });

    describe('#getPrimitive()', function () {

      it("should return the primitive type", function () {
        var type = { isRestrictionOf: returns(true) };
        var primitive = $primitiveType.create(
          { elements: $elements.create(
              [ $element.create('foo', type) ])
          });
        var elements = $elements.create(
          [ $element.create('foo', type) ]);
        var restriction = $restrictedType.create(primitive, elements);
        expect(restriction.getPrimitive()).to.equal(primitive);
      });

    });

    describe('#getValueType()', function () {

      it("should return the primitive's value type", function () {
        var type = { isRestrictionOf: returns(true) };
        var valueType = {};
        var primitive = $primitiveType.create(
          { valueType: valueType,
            elements: $elements.create(
              [ $element.create('foo', type) ])
          });
        var elements = $elements.create(
          [ $element.create('foo', type) ]);
        var restriction = $restrictedType.create(primitive, elements);
        expect(restriction.getValueType()).to.equal(valueType);
      });

    });

    describe('#getElements()', function () {

      it("should return the elements", function () {
        var type = { isRestrictionOf: returns(true) };
        var base = $primitiveType.create(
          { elements: $elements.create(
              [ $element.create('foo', type) ])
          });
        var elements = $elements.create(
          [ $element.create('foo', type) ]);
        var restriction = $restrictedType.create(base, elements);
        expect(restriction.getElements()).to.equal(elements);
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
        valueType = { prototype: {} };
        var primitive = $primitiveType.create(
          { valueType: valueType,
            elements: $elements.create(
              [ $element.create('foo', type) ])
          });
        elements = $elements.create(
          [ $element.create('foo', type) ]);
        restriction = $restrictedType.create(primitive, elements);
      });

      it("should return a sulfur/schema/validator/all", function () {
        var v = restriction.createValidator();
        expect($allValidator.prototype).to.be.prototypeOf(v);
      });

      it("should include a sulfur/schema/validator/prototype using the value type's prototype", function () {
        var v = restriction.createValidator();
        expect(v.getValidators()).to.include.something.eql(
          $prototypeValidator.create(valueType.prototype));
      });

      it("should include a sulfur/schema/validator/property with method 'getValue', the element name as argument, and the element type's validator", function () {
        var v = restriction.createValidator();
        expect(v.getValidators()).to.include.something.eql(
          $propertyValidator.create('getValue',
            elements.getElement('foo').getType().createValidator(),
            [ 'foo' ]));
      });

    });

  });

});
