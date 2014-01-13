/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global beforeEach, describe, it */

define([
  'shared',
  'sulfur/schema',
  'sulfur/schema/element',
  'sulfur/schema/elements',
  'sulfur/schema/type/simple/list',
  'sulfur/schema/type/simple/primitive/fileRef',
  'sulfur/schema/validator/all',
  'sulfur/schema/validator/existence',
  'sulfur/schema/validator/property'
], function (
    shared,
    Schema,
    Element,
    Elements,
    SimpleListType,
    FileRefType,
    AllValidator,
    ExistenceValidator,
    PropertyValidator
) {

  'use strict';

  var expect = shared.expect;
  var returns = shared.returns;

  describe('sulfur/schema', function () {

    var qname;
    var elements;
    var schema;

    beforeEach(function () {
      qname = {};
      elements = Elements.create([ { name: 'name' } ]);
      schema = Schema.create(qname, elements);
    });

    describe('#qname', function () {

      it("should return the qualified name", function () {
        expect(schema.qname).to.equal(qname);
      });

    });

    describe('#elements', function () {

      it("should return the element collection", function () {
        expect(schema.elements).to.equal(elements);
      });

    });

    describe('#hasFiles', function () {

      it("should return true when any element has base type sulfur/schema/simple/primitive/fileRef", function () {
        var s = Schema.create(null, Elements.create(
          [ Element.create('x', FileRefType) ]));
        expect(s.hasFiles).to.be.true;
      });

      it("should return true when any element has list type with sulfur/schema/simple/primitive/fileRef", function () {
        var s = Schema.create(null, Elements.create(
          [ Element.create('x', SimpleListType.create(FileRefType)) ]));
        expect(s.hasFiles).to.be.true;
      });

      it("should return false when no element has base type sulfur/schema/simple/primitive/fileRef", function () {
        var s = Schema.create(null, Elements.create(
          [ Element.create('x', { valueType: {} }) ]));
        expect(s.hasFiles).to.be.false;
      });

    });

    describe('#createValidator()', function () {

      var aType;
      var bType;

      beforeEach(function () {
        var aValidator = { a: 1 };
        var bValidator = { b: 2 };
        aType = { createValidator: returns(aValidator) };
        bType = { createValidator: returns(bValidator) };
      });

      it("should return an validator/all using a validator/property on method .value() and the element name using an element's validator for each element", function () {
        var a = Element.create('a', aType, { optional: true });
        var b = Element.create('b', bType, { optional: true });
        var elements = Elements.create([ a, b ]);
        var schema = Schema.create(null, elements);

        var v = schema.createValidator();

        expect(v).to.eql(
          AllValidator.create(
            [ PropertyValidator.create('value',
                a.type.createValidator(), [ a.name ]),
              PropertyValidator.create('value',
                b.type.createValidator(), [ b.name ])
            ]));
      });

      it("should include a validator/existence on method .value() and the element name for each mandatory element", function () {
        var a = Element.create('a', aType, { optional: true });
        var b = Element.create('b', bType);
        var elements = Elements.create([ a, b ]);
        var schema = Schema.create(null, elements);

        var v = schema.createValidator();

        expect(v).to.eql(
          AllValidator.create(
            [ PropertyValidator.create('value',
                a.type.createValidator(), [ a.name ]),
              PropertyValidator.create('value',
                AllValidator.create(
                  [ ExistenceValidator.create(),
                    b.type.createValidator()
                  ]), [ b.name ])
            ]));
      });

    });

  });

});
