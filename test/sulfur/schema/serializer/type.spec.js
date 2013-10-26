/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global beforeEach, context, describe, it */

define([
  'shared',
  'sulfur/schema/qname',
  'sulfur/schema/serializer/context',
  'sulfur/schema/serializer/type',
  'sulfur/util/document'
], function (shared, QName, Context, TypeSerializer, Document) {

  'use strict';

  var expect = shared.expect;
  var sinon = shared.sinon;
  var bind = shared.bind;
  var returns = shared.returns;

  describe('sulfur/schema/serializer/type', function () {

    describe('#hasTypeWithQualifiedName()', function () {

      var typeSerializer;
      var typeSerializers;

      beforeEach(function () {
        typeSerializers = [
          { hasTypeWithQualifiedName: function () {} },
          { hasTypeWithQualifiedName: function () {} }
        ];
        typeSerializer = TypeSerializer.create(typeSerializers);
      });

      it("should return true when any type serializer's .hasTypeWithQualifiedName() returns true", function () {
        var spy1 = sinon.spy(typeSerializers[0], 'hasTypeWithQualifiedName');
        var spy2 = sinon.stub(typeSerializers[1], 'hasTypeWithQualifiedName').returns(true);
        var qname = {};
        expect(typeSerializer.hasTypeWithQualifiedName(qname)).to.be.true;
        expect(spy1).to.be.calledWith(sinon.match.same(qname));
        expect(spy2).to.be.calledWith(sinon.match.same(qname));
      });

      it("should return false when every type serializer's .hasTypeWithQualifiedName() returns false", function () {
        var spy1 = sinon.spy(typeSerializers[0], 'hasTypeWithQualifiedName');
        var spy2 = sinon.spy(typeSerializers[1], 'hasTypeWithQualifiedName');
        var qname = {};
        expect(typeSerializer.hasTypeWithQualifiedName(qname)).to.be.false;
        expect(spy1).to.be.calledWith(sinon.match.same(qname));
        expect(spy2).to.be.calledWith(sinon.match.same(qname));
      });

    });

    describe('#serializeType()', function () {

      var typeSerializer;
      var typeSerializers;

      beforeEach(function () {
        typeSerializers = [
          { serializeType: function () {} },
          { serializeType: function () {} }
        ];
        typeSerializer = TypeSerializer.create(typeSerializers);
      });

      it("should return the result of the first type serializer which can serialize the type", function () {
        var spy1 = sinon.spy(typeSerializers[0], 'serializeType');
        var spy2 = sinon.stub(typeSerializers[1], 'serializeType').returns({});
        var type = {};
        var ctx = {};
        var r = typeSerializer.serializeType(type, ctx);
        expect(spy1).to.be.calledWith(
          sinon.match.same(type),
          sinon.match.same(typeSerializer),
          sinon.match.same(ctx));
        expect(spy2)
          .to.be.calledWith(
            sinon.match.same(type),
            sinon.match.same(typeSerializer),
            sinon.match.same(ctx))
          .to.have.returned(sinon.match.same(r));
      });

      it("should reject the type when no type serializer can serialize the type", function () {
        var spy1 = sinon.spy(typeSerializers[0], 'serializeType');
        var spy2 = sinon.spy(typeSerializers[1], 'serializeType');
        var type = {};
        var ctx = {};
        expect(bind(typeSerializer, 'serializeType', type, ctx))
          .to.throw("cannot serialize type");
        expect(spy1).to.be.calledWith(
          sinon.match.same(type),
          sinon.match.same(typeSerializer),
          sinon.match.same(ctx));
        expect(spy2).to.be.calledWith(
          sinon.match.same(type),
          sinon.match.same(typeSerializer),
          sinon.match.same(ctx));
      });

    });

    describe('#serializeElement()', function () {

      var ctx;
      var typeSerializer;

      beforeEach(function () {
        var doc = Document.make('urn:x', 'x:y');
        ctx = Context.create(doc);
        typeSerializer = TypeSerializer.create([]);
      });

      it("should return an xs:element", function () {
        var element = {
          type: {},
          name: 'foo',
          isOptional: returns(false)
        };
        sinon.stub(typeSerializer, 'serializeType')
          .returns(ctx.createElement('urn:dummy', 'dummy:void'));
        var e = typeSerializer.serializeElement(element, ctx);
        expect(e.nodeName).to.equal('xs:element');
        expect(e.namespaceURI).to.equal('http://www.w3.org/2001/XMLSchema');
      });

      it("should add attribute @name with the element name as value", function () {
        var element = {
          type: {},
          name: 'foo',
          isOptional: returns(false)
        };
        sinon.stub(typeSerializer, 'serializeType')
          .returns(ctx.createElement('urn:dummy', 'dummy:void'));
        var e = typeSerializer.serializeElement(element, ctx);
        expect(e.getAttribute('name')).to.equal('foo');
      });

      it("should add attribute @minOccurs with value zero when the element is optional", function () {
        var type = {};
        var element = {
          name: 'foo',
          type: type,
          isOptional: returns(true)
        };
        var child = ctx.createElement('urn:z', 'z:y');
        sinon.stub(typeSerializer, 'serializeType').returns(child);
        var e = typeSerializer.serializeElement(element, ctx);
        expect(e.getAttribute('minOccurs')).to.equal('0');
      });

      it("should add the serialize type as child when the element's type does not respond to .qname", function () {
        var type = {};
        var element = {
          name: 'foo',
          type: type,
          isOptional: returns(false)
        };
        var child = ctx.createElement('urn:z', 'z:y');
        var spy = sinon.stub(typeSerializer, 'serializeType').returns(child);
        var e = typeSerializer.serializeElement(element, ctx);
        expect(spy).to.be.calledWith(
          sinon.match.same(type),
          sinon.match.same(ctx));
        expect(e.firstChild).to.equal(child);
      });

      context("when the element's type responds to .qname", function () {

        var qname;
        var element;

        beforeEach(function () {
          qname = QName.create('bar', 'urn:foo');
          element = {
            name: 'bar',
            type: { qname: qname },
            isOptional: returns(false)
          };
        });

        it("should reject the element when #hasTypeWithQualifiedName() returns false", function () {
          var spy = sinon.stub(typeSerializer, 'hasTypeWithQualifiedName').returns(false);
          expect(bind(typeSerializer, 'serializeElement', element, ctx))
            .to.throw("element of unknown type {urn:foo}bar");
          expect(spy).to.be.calledWith(sinon.match.same(qname));
        });

        it("should return an xs:element with attribute @type and the qualified name as value when #hasTypeWithQualifiedName() is true", function () {
          sinon.stub(typeSerializer, 'hasTypeWithQualifiedName').returns(true);
          var spy = sinon.spy(ctx, 'getNamespacePrefix');
          var e = typeSerializer.serializeElement(element, ctx);
          expect(e.nodeName).to.equal('xs:element');
          expect(e.namespaceURI).to.equal('http://www.w3.org/2001/XMLSchema');
          expect(e.getAttribute('name')).to.equal('bar');
          expect(e.getAttribute('type')).to.equal('ns1:bar');
          expect(spy).to.be.calledWith(qname.namespaceURI);
        });

      });

    });

  });

});
