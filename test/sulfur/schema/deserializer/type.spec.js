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

    describe('#resolveGlobalType()', function () {

      it("should return undefined when no global type with the given name is declared", function () {
        var doc = parse('<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema"/>');
        var xpath = XPath.create(doc);
        var typeDeserializer = TypeDeserializer.create();
        expect(typeDeserializer.resolveGlobalType('foo', xpath)).to.be.undefined;
      });

      it("should return the result of calling #deserializeType() with the xs:simpleType of the given name when declared", function () {
        var doc = parse(
          '<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">' +
           '<xs:simpleType name="foo"/>' +
          '</xs:schema>');
        var xpath = XPath.create(doc);
        var typeDeserializer = TypeDeserializer.create();
        var deserializeSpy = sinon.stub(typeDeserializer, 'deserializeType').returns({});
        var type = typeDeserializer.resolveGlobalType('foo', xpath);

        expect(deserializeSpy).to.have.returned(sinon.match.same(type));
        expect(deserializeSpy.getCall(0).args[0]).to.equal(doc.documentElement.firstChild),
        expect(deserializeSpy.getCall(0).args[1]).to.equal(xpath);
      });

      it("should return the result of calling #deserializeType() with the xs:complexType of the given name when declared", function () {
        var doc = parse(
          '<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">' +
           '<xs:complexType name="bar"/>' +
          '</xs:schema>');
        var xpath = XPath.create(doc);
        var typeDeserializer = TypeDeserializer.create();
        var deserializeSpy = sinon.stub(typeDeserializer, 'deserializeType').returns({});
        var type = typeDeserializer.resolveGlobalType('bar', xpath);

        expect(deserializeSpy).to.have.returned(sinon.match.same(type));
        expect(deserializeSpy.getCall(0).args[0]).to.equal(doc.documentElement.firstChild),
        expect(deserializeSpy.getCall(0).args[1]).to.equal(xpath);
      });

    });

    describe('#deserializeType()', function () {

      var typeDeserializers;

      beforeEach(function () {
        typeDeserializers = [
          { deserializeElement: function () {} },
          { deserializeElement: function () {} }
        ];
      });

      it("should reject when every type deserializer's #deserializeElement() returns undefined", function () {
        var element = { localName: 'x', namespaceURI: 'urn:y' };
        var xpath = {};
        var typeDeserializer = TypeDeserializer.create(typeDeserializers);
        var spies = typeDeserializers.map(function (typeDeserializer) {
          return sinon.spy(typeDeserializer, 'deserializeElement');
        });
        expect(bind(typeDeserializer, 'deserializeType', element, xpath))
          .to.throw("cannot deserialize type element {urn:y}x");
        spies.forEach(function (spy) {
          expect(spy).to.be.calledWith(
            sinon.match.same(element),
            sinon.match.same(typeDeserializer),
            sinon.match.same(xpath));
        });
      });

      it("should return the result of the first type deserializer whose #deserializeElement() returns a defined result", function () {
        var element = {};
        var xpath = {};
        var typeDeserializer = TypeDeserializer.create(typeDeserializers);
        var spy = sinon.stub(typeDeserializers[0], 'deserializeElement').returns({});
        var type = typeDeserializer.deserializeType(element, xpath);
        expect(spy)
          .to.be.calledWith(
            sinon.match.same(element),
            sinon.match.same(typeDeserializer),
            sinon.match.same(xpath))
          .to.have.returned(sinon.match.same(type));
      });

    });

    describe('#resolveNamedType()', function () {

      var typeDeserializers;

      beforeEach(function () {
        typeDeserializers = [
          { resolveQualifiedName: function () {} },
          { resolveQualifiedName: function () {} }
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

    describe('#isRecursiveElement()', function () {

      it("should return false when the element does not have attribute @ref", function () {
        var element = document.createElementNS('urn:foo', 'foo:bar');
        var typeDeserializer = TypeDeserializer.create();
        expect(typeDeserializer.isRecursiveElement(element)).to.be.false;
      });

      context("when the element has attribute @ref", function () {

        it("should return true when #deserializeElement() has not yet finished deserializing an element with the same reference", function () {
          var doc = parse(
            '<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">' +
             '<xs:element ref="foo"/>' +
             '<xs:element name="foo">' +
              '<xs:complexType>' +
               '<xs:all>' +
                '<xs:element ref="foo"/>' +
               '</xs:all>' +
              '</xs:complexType>' +
             '</xs:element>' +
            '</xs:schema>');

          var xpath = XPath.create(doc);
          var typeDeserializer = TypeDeserializer.create();
          var element = doc.documentElement.firstChild;
          var spy = sinon.stub(typeDeserializer, 'deserializeType', function () {
            var e = element.nextSibling.firstChild.firstChild.firstChild;
            expect(typeDeserializer.isRecursiveElement(e)).to.be.true;
          });
          typeDeserializer.deserializeElement(element, xpath);
          expect(spy).to.be.called;
          expect(typeDeserializer.isRecursiveElement(element)).to.be.false;
        });

        it("should return false when #deserializeElement() has no ongoing deserialization of an element with the same reference", function () {
          var doc = parse(
            '<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">' +
             '<xs:element ref="bar"/>' +
             '<xs:element name="bar">' +
              '<xs:complexType>' +
               '<xs:all>' +
                '<xs:element ref="baz"/>' +
               '</xs:all>' +
              '</xs:complexType>' +
             '</xs:element>' +
             '<xs:element name="baz"/>' +
            '</xs:schema>');

          var xpath = XPath.create(doc);
          var typeDeserializer = TypeDeserializer.create();
          var element = doc.documentElement.firstChild;
          var spy = sinon.stub(typeDeserializer, 'deserializeType', function () {
            var e = element.nextSibling.firstChild.firstChild.firstChild;
            expect(typeDeserializer.isRecursiveElement(e)).to.be.false;
          });
          typeDeserializer.deserializeElement(element, xpath);
          expect(spy).to.be.called;
          expect(typeDeserializer.isRecursiveElement(element)).to.be.false;
        });

      });

    });

    describe('#deserializeElement()', function () {

      it("should return an element with the declared name", function () {
        var doc = parse(
          '<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">' +
           '<xs:element name="foo" type="someType"/>' +
          '</xs:schema>');
        var root = doc.documentElement;
        var element = root.firstChild;

        var typeDeserializer = TypeDeserializer.create();
        var someType = {};
        sinon.stub(typeDeserializer, 'resolveGlobalType').returns(someType);

        var e = typeDeserializer.deserializeElement(element);

        expect(e.name).to.equal('foo');
      });

      it("should return an optional element when attribute @minOccurs has value '0'", function () {
        var doc = parse(
          '<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">' +
           '<xs:element name="foo" type="someType" minOccurs="0"/>' +
          '</xs:schema>');
        var root = doc.documentElement;
        var element = root.firstChild;

        var typeDeserializer = TypeDeserializer.create();
        var someType = {};
        sinon.stub(typeDeserializer, 'resolveGlobalType').returns(someType);

        var e = typeDeserializer.deserializeElement(element);

        expect(e.isOptional()).to.be.true;
      });

      context("with attribute @type", function () {

        it("should return an element with the resolved global when the referenced type is a global type", function () {
          var doc = parse(
            '<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">' +
             '<xs:element name="foo" type="someType"/>' +
            '</xs:schema>');
          var root = doc.documentElement;
          var element = root.firstChild;

          var typeDeserializer = TypeDeserializer.create();
          var type = {};
          var deserializeSpy = sinon.stub(typeDeserializer,
            'resolveGlobalType').returns(type);

          var e = typeDeserializer.deserializeElement(element);

          expect(e.type).to.equal(type);
          expect(deserializeSpy).to.be.calledWith('someType');
        });

        it("should return an element with the resolved named type when the referenced type is not a global type", function () {
          var doc = parse(
            '<xs:schema' +
              ' xmlns:xs="http://www.w3.org/2001/XMLSchema"' +
              ' xmlns:foo="urn:foo">' +
             '<xs:element name="baz" type="foo:bar"/>' +
            '</xs:schema>');
          var root = doc.documentElement;
          var element = root.firstChild;

          var typeDeserializer = TypeDeserializer.create();
          var type = {};
          var deserializeSpy = sinon.stub(typeDeserializer,
            'resolveNamedType').returns(type);
          sinon.stub(typeDeserializer, 'resolveGlobalType').returns(undefined);

          var e = typeDeserializer.deserializeElement(element);

          expect(e.type).to.equal(type);
          expect(deserializeSpy).to.be.calledWith(QName.create('bar', 'urn:foo'));
        });

      });

      context("without attribute @type", function () {

        context("with attribute @ref", function () {

          it("should return an element with name and type of the referenced element", function () {
            var doc = parse(
              '<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">' +
               '<xs:element ref="bar"/>' +
               '<xs:element name="bar" type="someType"/>' +
              '</xs:schema>');
            var root = doc.documentElement;
            var element = root.firstChild;

            var xpath = XPath.create(doc);
            var typeDeserializer = TypeDeserializer.create();
            var type = {};
            var deserializeSpy = sinon.spy(typeDeserializer, 'deserializeElement');
            sinon.stub(typeDeserializer, 'resolveGlobalType').returns(type);

            var e = typeDeserializer.deserializeElement(element, xpath);

            expect(e.name).to.equal('bar');
            expect(e.type).to.equal(type);

            expect(deserializeSpy).to.be.called;
            expect(deserializeSpy.getCall(1).args[0]).to.equal(element.nextSibling);
            expect(deserializeSpy.getCall(1).args[1]).to.equal(xpath);
          });

          it("should return an optional element if the referencing element has attribute @minOccurs with value '0'", function () {
            var doc = parse(
              '<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">' +
               '<xs:element ref="x" minOccurs="0"/>' +
               '<xs:element name="x" type="someType"/>' +
              '</xs:schema>');
            var root = doc.documentElement;
            var element = root.firstChild;

            var xpath = XPath.create(doc);
            var typeDeserializer = TypeDeserializer.create();
            var type = {};
            var deserializeSpy = sinon.spy(typeDeserializer, 'deserializeElement');
            sinon.stub(typeDeserializer, 'resolveGlobalType').returns(type);

            var e = typeDeserializer.deserializeElement(element, xpath);

            expect(e.name).to.equal('x');
            expect(e.type).to.equal(type);
            expect(e.isOptional()).to.be.true;

            expect(deserializeSpy).to.be.called;
            expect(deserializeSpy.getCall(1).args[0]).to.equal(element.nextSibling);
            expect(deserializeSpy.getCall(1).args[1]).to.equal(xpath);
          });

          it("should reject a mandatory element when the reference is recursive", function () {
            var doc = parse(
              '<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">' +
               '<xs:element ref="foo"/>' +
               '<xs:element name="foo">' +
                '<xs:complexType>' +
                 '<xs:all>' +
                  '<xs:element ref="foo"/>' +
                 '</xs:all>' +
                '</xs:complexType>' +
               '</xs:element>' +
              '</xs:schema>');

            var xpath = XPath.create(doc);
            var typeDeserializer = TypeDeserializer.create();
            var element = doc.documentElement.firstChild;
            var spy = sinon.stub(typeDeserializer, 'deserializeType', function () {
              var e = element.nextSibling.firstChild.firstChild.firstChild;
              expect(bind(typeDeserializer, 'deserializeElement', e))
                .to.throw("recursive element type");
            });
            typeDeserializer.deserializeElement(element, xpath);
            expect(spy).to.be.called;
          });

        });

        context("without attribute @ref", function () {

          it("should return an element with the deserialized type of child xs:simpleType when declared", function () {
            var doc = parse(
              '<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">' +
               '<xs:element>' +
                '<xs:simpleType/>' +
               '</xs:element>' +
              '</xs:schema>');
            var root = doc.documentElement;
            var element = root.firstChild;

            var xpath = XPath.create(doc);
            var typeDeserializer = TypeDeserializer.create();
            var type = {};
            var deserializeSpy = sinon.stub(typeDeserializer,
              'deserializeType').returns(type);

            var e = typeDeserializer.deserializeElement(element, xpath);

            expect(e.type).to.equal(type);

            expect(deserializeSpy).to.be.called;
            expect(deserializeSpy.getCall(0).args[0]).to.equal(element.firstChild);
            expect(deserializeSpy.getCall(0).args[1]).to.equal(xpath);
          });

          it("should return the result of calling #deserializeType() with child xs:complexType when declared", function () {
            var doc = parse(
              '<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">' +
               '<xs:element>' +
                '<xs:complexType/>' +
               '</xs:element>' +
              '</xs:schema>');
            var root = doc.documentElement;
            var element = root.firstChild;

            var xpath = XPath.create(doc);
            var typeDeserializer = TypeDeserializer.create();
            var type = {};
            var deserializeSpy = sinon.stub(typeDeserializer,
              'deserializeType').returns(type);

            var e = typeDeserializer.deserializeElement(element, xpath);

            expect(e.type).to.equal(type);

            expect(deserializeSpy).to.be.called;
            expect(deserializeSpy.getCall(0).args[0]).to.equal(element.firstChild);
            expect(deserializeSpy.getCall(0).args[1]).to.equal(xpath);
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
