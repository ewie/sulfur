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
  'sulfur/schema/qname',
  'sulfur/schema/serializer/context',
  'sulfur/schema/serializer/type',
  'sulfur/schema/serializer/type/complex',
  'sulfur/schema/type/complex/list',
  'sulfur/schema/type/complex/restricted',
  'sulfur/util/document'
], function (
    shared,
    Element,
    Elements,
    QName,
    Context,
    TypeSerializer,
    ComplexTypeSerializer,
    ListType,
    RestrictedType,
    Document
) {

  'use strict';

  var expect = shared.expect;
  var sinon = shared.sinon;
  var bind = shared.bind;
  var returns = shared.returns;

  describe('sulfur/schema/serializer/type/complex', function () {

    describe('#initialize()', function () {

      it("should reject types with duplicate qualified name", function () {
        var types = [
          { qname: QName.create('x', 'urn:y') },
          { qname: QName.create('x', 'urn:y') }
        ];
        expect(bind(ComplexTypeSerializer, 'create', types))
          .to.throw("type with duplicate qualified name {urn:y}x");
      });

    });

    describe('#hasTypeWithQualifiedName()', function () {

      var type;
      var typeSerializer;

      beforeEach(function () {
        type = { qname: QName.create('x', 'urn:y') };
        typeSerializer = ComplexTypeSerializer.create([ type ]);
      });

      it("should return true when a type with matching qualified name is defined", function () {
        var qname = QName.create('x', 'urn:y');
        expect(typeSerializer.hasTypeWithQualifiedName(qname)).to.be.true;
      });

      it("should return false when no type with the given name is defined", function () {
        var qname = QName.create('z', 'urn:y');
        expect(typeSerializer.hasTypeWithQualifiedName(qname)).to.be.false;
      });

      it("should return false when no type with the given namespace is defined", function () {
        var qname = QName.create('x', 'urn:z');
        expect(typeSerializer.hasTypeWithQualifiedName(qname)).to.be.false;
      });

    });

    describe('#serializeType()', function () {

      it("should return undefined when the type is not a sulfur/schema/type/complex/{list,restricted}", function () {
        var typeSerializer = ComplexTypeSerializer.create([]);
        expect(typeSerializer.serializeType({})).to.be.undefined;
      });

      context("when the type is a sulfur/schema/type/complex/list", function () {

        var ctx;
        var typeSerializer;
        var complexTypeSerializer;
        var element;

        beforeEach(function () {
          var doc = Document.make('http://www.w3.org/2001/XMLSchema', 'xs:schema');
          ctx = Context.create(doc);

          var type = { qname: QName.create('x', 'urn:y') };
          element = Element.create('foo', type);

          complexTypeSerializer = ComplexTypeSerializer.create([]);
          var simpleTypeSerializer = { hasTypeWithQualifiedName: returns(true) };
          typeSerializer = TypeSerializer.create([ simpleTypeSerializer ]);
        });

        it("should return an xs:complexType", function () {
          var type = ListType.create(element);

          var e = complexTypeSerializer.serializeType(type, typeSerializer, ctx);

          expect(e.nodeName).to.equal('xs:complexType');
          expect(e.namespaceURI).to.equal('http://www.w3.org/2001/XMLSchema');
        });

        it("should append child xs:sequence", function () {
          var type = ListType.create(element);

          var e = complexTypeSerializer.serializeType(type, typeSerializer, ctx);

          e = e.firstChild;
          expect(e.nodeName).to.equal('xs:sequence');
          expect(e.namespaceURI).to.equal('http://www.w3.org/2001/XMLSchema');
        });

        it("should add attribute @maxOccurs with value 'unbounded' is no maximum length is defined", function () {
          var type = ListType.create(element);
          var e = complexTypeSerializer.serializeType(type, typeSerializer, ctx);
          expect(e.firstChild.getAttribute('maxOccurs')).to.equal('unbounded');
        });

        it("should add attribute @maxOccurs with the maximum length as value when defined", function () {
          var type = ListType.create(element, { maxLength: 3 });
          var e = complexTypeSerializer.serializeType(type, typeSerializer, ctx);
          expect(e.firstChild.getAttribute('maxOccurs')).to.equal('3');
        });

        it("should add attribute @minOccurs with value zero is no minimum length is defined", function () {
          var type = ListType.create(element);
          var e = complexTypeSerializer.serializeType(type, typeSerializer, ctx);
          expect(e.firstChild.getAttribute('minOccurs')).to.equal('0');
        });

        it("should add attribute @minOccurs with the minimum length as value when defined", function () {
          var type = ListType.create(element, { minLength: 1 });
          var e = complexTypeSerializer.serializeType(type, typeSerializer, ctx);
          expect(e.firstChild.getAttribute('minOccurs')).to.equal('1');
        });

        it("should serialize the element", function () {
          var type = ListType.create(element);
          var spy = sinon.spy(typeSerializer, 'serializeElement');

          var e = complexTypeSerializer.serializeType(type, typeSerializer, ctx);

          expect(spy)
            .to.be.calledWith(
              sinon.match.same(element),
              sinon.match.same(ctx))
            .to.have.returned(sinon.match.same(e.firstChild.firstChild));
        });

      });

      context("when the type is a sulfur/schema/type/complex/restricted", function () {

        var ctx;
        var typeSerializer;
        var complexTypeSerializer;
        var type;

        beforeEach(function () {
          var doc = Document.make('http://www.w3.org/2001/XMLSchema', 'xs:schema');
          ctx = Context.create(doc);

          var baseType = {
            qname: QName.create('x', 'urn:y'),
            allowedElements: Elements.create([
              Element.create('foo', {}),
              Element.create('bar', {})
            ])
          };

          var elements = Elements.create([
            Element.create('foo', {
              qname: QName.create('y', 'urn:z'),
              isRestrictionOf: returns(true)
            }),
            Element.create('bar', {
              qname: QName.create('y', 'urn:z'),
              isRestrictionOf: returns(true)
            })
          ]);
          type = RestrictedType.create(baseType, elements);

          var simpleTypeSerializer = { hasTypeWithQualifiedName: returns(true) };
          complexTypeSerializer = ComplexTypeSerializer.create([]);
          typeSerializer = TypeSerializer.create([ simpleTypeSerializer ]);
        });

        it("should return an xs:complexType", function () {
          var e = complexTypeSerializer.serializeType(type, typeSerializer, ctx);
          expect(e.nodeName).to.equal('xs:complexType');
          expect(e.namespaceURI).to.equal('http://www.w3.org/2001/XMLSchema');
        });

        it("should append child xs:all", function () {
          var e = complexTypeSerializer.serializeType(type, typeSerializer, ctx);

          e = e.firstChild;
          expect(e.nodeName).to.equal('xs:all');
          expect(e.namespaceURI).to.equal('http://www.w3.org/2001/XMLSchema');
        });

        it("should serialize each element", function () {
          var spy = sinon.spy(typeSerializer, 'serializeElement');
          var elements = type.elements.toArray();

          var e = complexTypeSerializer.serializeType(type, typeSerializer, ctx);

          expect(spy).to.be.calledTwice;

          expect(spy.getCall(0).args[0]).to.equal(elements[0]);
          expect(spy.getCall(0).args[1]).to.equal(ctx);
          expect(spy.getCall(0).returnValue).to.equal(e.firstChild.firstChild);

          expect(spy.getCall(1).args[0]).to.equal(elements[1]);
          expect(spy.getCall(1).args[1]).to.equal(ctx);
          expect(spy.getCall(1).returnValue).to.equal(e.firstChild.lastChild);
        });

      });

    });

  });

});
