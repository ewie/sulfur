/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global afterEach, beforeEach, context, describe, it */

define([
  'shared',
  'sulfur/schema/deserializer/type',
  'sulfur/schema/qname',
  'sulfur/util/xpath'
], function (shared, TypeDeserializer, QName, XPath) {

  'use strict';

  var expect = shared.expect;
  var sinon = shared.sinon;
  var bind = shared.bind;

  describe('sulfur/schema/deserializer/type', function () {

    function parse(s) {
      var p = new DOMParser();
      return p.parseFromString(s, 'text/xml');
    }

    var sandbox;

    beforeEach(function () {
      sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
      sandbox.restore();
    });

    describe('#getXPath()', function () {

      it("should return the XPath object", function () {
        var xpath = {};
        var typeDeserializer = TypeDeserializer.create(undefined, xpath);
        expect(typeDeserializer.getXPath()).to.equal(xpath);
      });

    });

    describe('#resolveGlobalType()', function () {

      it("should return undefined when no global type with the given name is declared", function () {
        var doc = parse('<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema"/>');
        var xpath = XPath.create(doc);
        var typeDeserializer = TypeDeserializer.create(undefined, xpath);
        expect(typeDeserializer.resolveGlobalType('foo')).to.be.undefined;
      });

      it("should return the result of calling #deserializeTypeElement() with the xs:simpleType of the given name when declared", function () {
        var doc = parse(
          '<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">' +
           '<xs:simpleType name="foo"/>' +
          '</xs:schema>');
        var xpath = XPath.create(doc);
        var typeDeserializer = TypeDeserializer.create(undefined, xpath);
        var deserializeSpy = sinon.stub(typeDeserializer, 'deserializeTypeElement').returns({});
        var type = typeDeserializer.resolveGlobalType('foo');
        expect(deserializeSpy)
          .to.be.calledWith(doc.documentElement.firstChild)
          .to.have.returned(sinon.match.same(type));
      });

      it("should return the result of calling #deserializeTypeElement() with the xs:complexType of the given name when declared", function () {
        var doc = parse(
          '<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">' +
           '<xs:complexType name="bar"/>' +
          '</xs:schema>');
        var xpath = XPath.create(doc);
        var typeDeserializer = TypeDeserializer.create(undefined, xpath);
        var deserializeSpy = sinon.stub(typeDeserializer, 'deserializeTypeElement').returns({});
        var type = typeDeserializer.resolveGlobalType('bar');
        expect(deserializeSpy)
          .to.be.calledWith(doc.documentElement.firstChild)
          .to.have.returned(sinon.match.same(type));
      });

    });

    describe('#deserializeTypeElement()', function () {

      var typeDeserializers;

      beforeEach(function () {
        typeDeserializers = [
          {
            deserializeElement: function () {}
          },
          {
            deserializeElement: function () {}
          }
        ];
      });

      it("should reject when every type deserializer's #deserializeElement() returns undefined", function () {
        var element = { localName: 'x', namespaceURI: 'urn:y' };
        var typeDeserializer = TypeDeserializer.create(typeDeserializers);
        var spies = typeDeserializers.map(function (typeDeserializer) {
          return sinon.spy(typeDeserializer, 'deserializeElement');
        });
        expect(bind(typeDeserializer, 'deserializeTypeElement', element))
          .to.throw("cannot deserialize type element {urn:y}x");
        spies.forEach(function (spy) {
          expect(spy).to.be.calledWith(
            sinon.match.same(element),
            sinon.match.same(typeDeserializer));
        });
      });

      it("should return the result of the first type deserializer whose #deserializeElement() returns a defined result", function () {
        var element = {};
        var typeDeserializer = TypeDeserializer.create(typeDeserializers);
        var spy = sinon.stub(typeDeserializers[0], 'deserializeElement').returns({});
        var type = typeDeserializer.deserializeTypeElement(element);
        expect(spy)
          .to.be.calledWith(
            sinon.match.same(element),
            sinon.match.same(typeDeserializer))
          .to.have.returned(sinon.match.same(type));
      });

    });

    describe('#resolveNamedType()', function () {

      var typeDeserializers;

      beforeEach(function () {
        typeDeserializers = [
          {
            resolveQualifiedName: function () {}
          },
          {
            resolveQualifiedName: function () {}
          }
        ];
      });

      it("should reject when every type deserializer's #resolveQualifiedName() returns undefined", function () {
        var typeDeserializer = TypeDeserializer.create(typeDeserializers);
        var spies = typeDeserializers.map(function (typeDeserializer) {
          return sinon.spy(typeDeserializer, 'resolveQualifiedName');
        });
        var qname = QName.create('foo', 'urn:bar');
        expect(bind(typeDeserializer, 'resolveNamedType', qname))
          .to.throw("cannot resolve type {urn:bar}foo");
        spies.forEach(function (spy) {
          expect(spy).to.be.calledWith(sinon.match.same(qname));
        });
      });

      it("should return the defined result of any type deserializer's #resolveQualifiedName()", function () {
        var typeDeserializer = TypeDeserializer.create(typeDeserializers);
        var spy = sinon.stub(typeDeserializers[0], 'resolveQualifiedName').returns({});
        var qname = QName.create('foo', 'urn:bar');
        var type = typeDeserializer.resolveNamedType(qname);
        expect(spy)
          .to.be.calledWith(sinon.match.same(qname))
          .to.have.returned(sinon.match.same(type));
      });

    });

    describe('#deserializeElementType()', function () {

      it("should reject an element without a supported type declaration", function () {
        var doc = parse(
          '<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">' +
           '<xs:element/>' +
          '</xs:schema>');
        var root = doc.documentElement;
        var element = root.firstChild;
        var xpath = XPath.create(doc);
        var typeDeserializer = TypeDeserializer.create(undefined, xpath);
        expect(bind(typeDeserializer, 'deserializeElementType', element))
          .to.throw("element with unsupported type declaration");
      });

      context("with a supported type declaration", function () {

        context("with attribute @type", function () {

          it("should return the result of calling #resolveGlobalType() with the type name when #containsGlobalType() is true", function () {
            var element = {
              hasAttribute: function (name) { return name === 'type'; },
              getAttribute: function (name) {
                return this.hasAttribute(name) ? 'someType' : null;
              }
            };
            var typeDeserializer = TypeDeserializer.create();
            var deserializeSpy = sinon.stub(typeDeserializer, 'resolveGlobalType').returns({});
            var type = typeDeserializer.deserializeElementType(element);
            expect(deserializeSpy)
              .to.be.calledWith('someType')
              .to.have.returned(sinon.match.same(type));
          });

          it("should return the result of calling #resolveNamedType() with the deserialized type name when #resolveGlobalType() returns undefined", function () {
            var doc = parse(
              '<xs:schema' +
                ' xmlns:xs="http://www.w3.org/2001/XMLSchema"' +
                ' xmlns:foo="urn:foo">' +
               '<xs:element type="foo:bar"/>' +
              '</xs:schema>');
            var root = doc.documentElement;
            var element = root.firstChild;
            var typeDeserializer = TypeDeserializer.create();
            sinon.stub(typeDeserializer, 'resolveGlobalType').returns(undefined);
            var deserializeSpy = sinon.stub(typeDeserializer, 'resolveNamedType').returns({});
            var type = typeDeserializer.deserializeElementType(element);
            expect(deserializeSpy)
              .to.be.calledWith(QName.create('bar', 'urn:foo'))
              .to.have.returned(sinon.match.same(type));
          });

        });

        context("without attribute @type", function () {

          it("should return the result of calling #deserializeTypeElement() with child xs:simpleType when declared", function () {
            var doc = parse(
              '<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">' +
               '<xs:element>' +
                '<xs:simpleType/>' +
               '</xs:element>' +
              '</xs:schema>');
            var root = doc.documentElement;
            var element = root.firstChild;
            var xpath = XPath.create(doc);
            var typeDeserializer = TypeDeserializer.create(undefined, xpath);
            var deserializeSpy = sinon.stub(typeDeserializer, 'deserializeTypeElement').returns({});
            var type = typeDeserializer.deserializeElementType(element);
            expect(deserializeSpy)
              .to.be.calledWith(element.firstChild)
              .to.have.returned(sinon.match.same(type));
          });

          it("should return the result of calling #deserializeTypeElement() with child xs:complexType when declared", function () {
            var doc = parse(
              '<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">' +
               '<xs:element>' +
                '<xs:complexType/>' +
               '</xs:element>' +
              '</xs:schema>');
            var root = doc.documentElement;
            var element = root.firstChild;
            var xpath = XPath.create(doc);
            var typeDeserializer = TypeDeserializer.create(undefined, xpath);
            var deserializeSpy = sinon.stub(typeDeserializer, 'deserializeTypeElement').returns({});
            var type = typeDeserializer.deserializeElementType(element);
            expect(deserializeSpy)
              .to.be.calledWith(element.firstChild)
              .to.have.returned(sinon.match.same(type));
          });

        });

      });

    });

    describe('#resolveQualifiedName()', function () {

      it("should resolve the prefix when the qualified name has a prefix", function () {
        var doc = parse('<foo xmlns:xxx="urn:baz"/>');
        var typeDeserializer = TypeDeserializer.create();
        var deserializePrefixSpy = sinon.spy(typeDeserializer, 'resolvePrefix');
        var r = typeDeserializer.resolveQualifiedName('xxx:foo', doc.documentElement);
        expect(deserializePrefixSpy)
          .to.be.calledWith('xxx', sinon.match.same(doc.documentElement));
        expect(r).to.eql(QName.create('foo', 'urn:baz'));
      });

      it("should resolve the empty prefix when the qualified name has no prefix", function () {
        var doc = parse('<foo xmlns="urn:bar"/>');
        var typeDeserializer = TypeDeserializer.create();
        var deserializePrefixSpy = sinon.spy(typeDeserializer, 'resolvePrefix');
        var r = typeDeserializer.resolveQualifiedName('foo', doc.documentElement);
        expect(deserializePrefixSpy)
          .to.be.calledWith('', sinon.match.same(doc.documentElement));
        expect(r).to.eql(QName.create('foo', 'urn:bar'));
      });

    });

    describe('#resolvePrefix()', function () {

      it("should resolve to the most local namespace declaration", function () {
        var doc = parse(
          '<foo>' +
           '<bar xmlns:xxx="urn:bar"/>' +
          '</foo>');
        var typeDeserializer = TypeDeserializer.create();
        var element = doc.documentElement.firstChild;
        var r = typeDeserializer.resolvePrefix('xxx', element);
        expect(r).to.equal('urn:bar');
      });

      it("should go up the document tree", function () {
        var doc = parse(
          '<foo xmlns:bar="urn:foo">' +
           '<bar/>' +
          '</foo>');
        var typeDeserializer = TypeDeserializer.create();
        var element = doc.documentElement.firstChild;
        var r = typeDeserializer.resolvePrefix('bar', element);
        expect(r).to.equal('urn:foo');
      });

      it("should handle the empty prefix", function () {
        var doc = parse('<foo xmlns="urn:bar"/>');
        var typeDeserializer = TypeDeserializer.create();
        var element = doc.documentElement;
        var r = typeDeserializer.resolvePrefix('', element);
        expect(r).to.equal('urn:bar');
      });

      it("should reject an undeclared prefix", function () {
        var doc = parse('<foo/>');
        var typeDeserializer = TypeDeserializer.create();
        var element = doc.documentElement;
        expect(bind(typeDeserializer, 'resolvePrefix', 'foo', element))
          .to.throw('cannot resolve undeclared prefix "foo"');
      });

    });

  });

});
