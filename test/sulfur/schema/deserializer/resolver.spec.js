/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global afterEach, beforeEach, context, describe, it */

define([
  'shared',
  'sulfur/schema/deserializer/resolver',
  'sulfur/schema/qname'
], function (shared, Resolver, QName) {

  'use strict';

  var expect = shared.expect;
  var sinon = shared.sinon;
  var bind = shared.bind;
  var returns = shared.returns;

  describe('sulfur/schema/deserializer/resolver', function () {

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

    describe('#resolveTypeElement()', function () {

      var typeResolvers;

      beforeEach(function () {
        typeResolvers = [
          { resolveTypeElement: function () {} },
          { resolveTypeElement: function () {} }
        ];
      });

      it("should return the result of the first type resolver whose .resolveTypeElement() returns a defined result", function () {
        var doc = parse('<schema xmlns="http://www.w3.org/2001/XMLSchema" targetNamespace="urn:example:bar"/>');
        var element = {};
        var resolver = Resolver.create(doc, typeResolvers);
        var spy = sinon.stub(typeResolvers[0], 'resolveTypeElement').returns({});
        var type = resolver.resolveTypeElement(element);
        expect(spy).to.have.returned(sinon.match.same(type));
        expect(spy.getCall(0).args[0]).to.equal(element);
        expect(spy.getCall(0).args[1]).to.equal(resolver);
      });

      it("should reject when every type resolver's .resolveTypeElement() returns undefined", function () {
        var doc = parse('<schema xmlns="http://www.w3.org/2001/XMLSchema" targetNamespace="urn:example:bar"/>');
        var element = { localName: 'x', namespaceURI: 'urn:example:y' };
        var resolver = Resolver.create(doc, typeResolvers);
        var spies = typeResolvers.map(function (resolver) {
          return sinon.spy(resolver, 'resolveTypeElement');
        });
        expect(bind(resolver, 'resolveTypeElement', element))
          .to.throw("cannot resolve type element {urn:example:y}x");
        spies.forEach(function (spy) {
          expect(spy.getCall(0).args[0]).to.equal(element);
          expect(spy.getCall(0).args[1]).to.equal(resolver);
        });
      });

    });

    describe('#resolveNamedType()', function () {

      var typeResolvers;

      beforeEach(function () {
        typeResolvers = [
          { resolveQualifiedName: function () {} },
          { resolveQualifiedName: function () {} }
        ];
      });

      context("when the qualified name does not match the schema's target namespace", function () {

        var doc;
        var resolver;

        beforeEach(function () {
          doc = parse('<schema xmlns="http://www.w3.org/2001/XMLSchema" targetNamespace="urn:example:bar"/>');
          resolver = Resolver.create(doc, typeResolvers);
        });

        it("should return the defined result of any type resolver's .resolveQualifiedName()", function () {
          var spy = sinon.stub(typeResolvers[0], 'resolveQualifiedName').returns({});
          var qname = QName.create('bar', 'urn:example:foo');
          var type = resolver.resolveNamedType(qname);
          expect(spy)
            .to.be.calledWith(sinon.match.same(qname))
            .to.have.returned(sinon.match.same(type));
        });

        it("should reject when every type resolver's .resolveQualifiedName() returns undefined", function () {
          var spies = typeResolvers.map(function (resolver) {
            return sinon.spy(resolver, 'resolveQualifiedName');
          });
          var qname = QName.create('bar', 'urn:example:foo');
          expect(bind(resolver, 'resolveNamedType', qname))
            .to.throw("cannot resolve type {urn:example:foo}bar");
          spies.forEach(function (spy) {
            expect(spy).to.be.calledWith(sinon.match.same(qname));
          });
        });

      });

      context("when the qualified name matched the schema's target namespace", function () {

        context("when a global type with the given qualified name is defined", function () {

          it("should resolve the type element when it's an xs:simpleType", function () {
            var doc = parse(
              '<schema xmlns="http://www.w3.org/2001/XMLSchema"' +
                ' targetNamespace="urn:example:foo">' +
               '<simpleType name="bar"/>' +
              '</schema>');
            var resolver = Resolver.create(doc);
            var spy = sinon.stub(resolver, 'resolveTypeElement').returns({});
            var type = resolver.resolveNamedType(QName.create('bar', 'urn:example:foo'));
            expect(spy)
              .to.be.calledWith(sinon.match.same(doc.documentElement.firstChild))
              .to.have.returned(sinon.match.same(type));
          });

          it("should resolve the type element when it's an xs:complexType", function () {
            var doc = parse(
              '<schema xmlns="http://www.w3.org/2001/XMLSchema"' +
                ' targetNamespace="urn:example:bar">' +
               '<complexType name="foo"/>' +
              '</schema>');
            var resolver = Resolver.create(doc);
            var spy = sinon.stub(resolver, 'resolveTypeElement').returns({});
            var type = resolver.resolveNamedType(QName.create('foo', 'urn:example:bar'));
            expect(spy)
              .to.be.calledWith(sinon.match.same(doc.documentElement.firstChild))
              .to.have.returned(sinon.match.same(type));
          });

        });

        context("when no global type with the given qualified name is defined", function () {

          var doc;
          var resolver;

          beforeEach(function () {
            doc = parse('<schema xmlns="http://www.w3.org/2001/XMLSchema" targetNamespace="urn:example:bar"/>');
            resolver = Resolver.create(doc, typeResolvers);
          });

          it("should return the defined result of any type resolver's .resolveQualifiedName()", function () {
            var spy = sinon.stub(typeResolvers[0], 'resolveQualifiedName').returns({});
            var qname = QName.create('foo', 'urn:example:bar');
            var type = resolver.resolveNamedType(qname);
            expect(spy)
              .to.be.calledWith(sinon.match.same(qname))
              .to.have.returned(sinon.match.same(type));
          });

          it("should reject when every type resolver's .resolveQualifiedName() returns undefined", function () {
            var spies = typeResolvers.map(function (resolver) {
              return sinon.spy(resolver, 'resolveQualifiedName');
            });
            var qname = QName.create('foo', 'urn:example:bar');
            expect(bind(resolver, 'resolveNamedType', qname))
              .to.throw("cannot resolve type {urn:example:bar}foo");
            spies.forEach(function (spy) {
              expect(spy).to.be.calledWith(sinon.match.same(qname));
            });
          });

        });

      });

    });

    describe('#isRecursiveElementDeclaration()', function () {

      it("should return false when the element does not have attribute @ref", function () {
        var doc = parse(
          '<schema xmlns="http://www.w3.org/2001/XMLSchema" targetNamespace="urn:example:bar">' +
           '<element/>' +
          '</schema>');
        var resolver = Resolver.create(doc);
        var element = doc.documentElement;
        expect(resolver.isRecursiveElementDeclaration(element)).to.be.false;
      });

      context("when the element has attribute @ref", function () {

        it("should return true when #resolveElementDeclaration() has not yet finished deserializing an element with the same reference", function () {
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

          var resolver = Resolver.create(doc);
          var element = doc.documentElement.firstChild;
          var spy = sinon.stub(resolver, 'resolveTypeElement', function () {
            var e = element.nextSibling.firstChild.firstChild.firstChild;
            expect(resolver.isRecursiveElementDeclaration(e)).to.be.true;
          });
          resolver.resolveElementDeclaration(element);
          expect(spy).to.be.called;
          expect(resolver.isRecursiveElementDeclaration(element)).to.be.false;
        });

        it("should return false when #resolveElementDeclaration() has no ongoing deserialization of an element with the same reference", function () {
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

          var resolver = Resolver.create(doc);
          var element = doc.documentElement.firstChild;
          var spy = sinon.stub(resolver, 'resolveTypeElement', function () {
            var e = element.nextSibling.firstChild.firstChild.firstChild;
            expect(resolver.isRecursiveElementDeclaration(e)).to.be.false;
          });
          resolver.resolveElementDeclaration(element);
          expect(spy).to.be.called;
          expect(resolver.isRecursiveElementDeclaration(element)).to.be.false;
        });

      });

    });

    describe('#resolveElementDeclaration()', function () {

      it("should return an element with the declared name", function () {
        var doc = parse(
          '<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">' +
           '<xs:element name="foo" type="someType"/>' +
          '</xs:schema>');
        var root = doc.documentElement;
        var element = root.firstChild;

        var resolver = Resolver.create(doc);
        var someType = {};
        resolver.resolveNamedType = returns(someType);

        var e = resolver.resolveElementDeclaration(element);

        expect(e.name).to.equal('foo');
      });

      it("should return an optional element when attribute @minOccurs has value '0'", function () {
        var doc = parse(
          '<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">' +
           '<xs:element name="foo" type="someType" minOccurs="0"/>' +
          '</xs:schema>');
        var root = doc.documentElement;
        var element = root.firstChild;

        var resolver = Resolver.create(doc);
        var someType = {};
        resolver.resolveNamedType = returns(someType);

        var e = resolver.resolveElementDeclaration(element);

        expect(e.isOptional).to.be.true;
      });

      it("should parse the value of attribute @default and use it as default value when specified", function () {
        var doc = parse(
          '<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">' +
           '<xs:element name="foo" type="someType" default="xyz"/>' +
          '</xs:schema>');
        var root = doc.documentElement;
        var element = root.firstChild;

        var resolver = Resolver.create(doc);
        var value = {};
        var valueType = { parse: returns(value) };
        var someType = { valueType: valueType };
        var spy = sinon.spy(valueType, 'parse');
        resolver.resolveNamedType = returns(someType);

        var e = resolver.resolveElementDeclaration(element);

        expect(spy).to.be.calledWith('xyz');
        expect(e.defaultValue).to.equal(value);
      });

      context("with attribute @type", function () {

        it("should return an element with the resolved global when the referenced type is a global type", function () {
          var doc = parse(
            '<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">' +
             '<xs:element name="foo" type="someType"/>' +
            '</xs:schema>');
          var root = doc.documentElement;
          var element = root.firstChild;

          var resolver = Resolver.create(doc);
          var type = {};
          var spy = sinon.stub(resolver, 'resolveNamedType').returns(type);

          var e = resolver.resolveElementDeclaration(element);

          expect(e.type).to.equal(type);
          expect(spy).to.be.calledWith(QName.create('someType', null));
        });

        it("should return an element with the resolved named type when the referenced type is not a global type", function () {
          var doc = parse(
            '<xs:schema' +
              ' xmlns:xs="http://www.w3.org/2001/XMLSchema"' +
              ' xmlns:foo="urn:example:foo">' +
             '<xs:element name="baz" type="foo:bar"/>' +
            '</xs:schema>');
          var root = doc.documentElement;
          var element = root.firstChild;

          var resolver = Resolver.create(doc);
          var type = {};
          var spy = sinon.stub(resolver, 'resolveNamedType').returns(type);

          var e = resolver.resolveElementDeclaration(element);

          expect(e.type).to.equal(type);
          expect(spy).to.be.calledWith(QName.create('bar', 'urn:example:foo'));
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

            var resolver = Resolver.create(doc);
            var type = {};
            var resolveSpy = sinon.spy(resolver, 'resolveElementDeclaration');
            resolver.resolveNamedType = returns(type);

            var e = resolver.resolveElementDeclaration(element);

            expect(e.name).to.equal('bar');
            expect(e.type).to.equal(type);

            expect(resolveSpy).to.be.called;
            expect(resolveSpy.getCall(1).args[0]).to.equal(element.nextSibling);
          });

          it("should return an optional element if the referencing element has attribute @minOccurs with value '0'", function () {
            var doc = parse(
              '<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">' +
               '<xs:element ref="x" minOccurs="0"/>' +
               '<xs:element name="x" type="someType"/>' +
              '</xs:schema>');
            var root = doc.documentElement;
            var element = root.firstChild;

            var resolver = Resolver.create(doc);
            var type = {};
            var resolveSpy = sinon.spy(resolver, 'resolveElementDeclaration');
            resolver.resolveNamedType = returns(type);

            var e = resolver.resolveElementDeclaration(element);

            expect(e.name).to.equal('x');
            expect(e.type).to.equal(type);
            expect(e.isOptional).to.be.true;

            expect(resolveSpy).to.be.called;
            expect(resolveSpy.getCall(1).args[0]).to.equal(element.nextSibling);
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

            var resolver = Resolver.create(doc);
            var element = doc.documentElement.firstChild;
            var spy = sinon.stub(resolver, 'resolveTypeElement', function () {
              var e = element.nextSibling.firstChild.firstChild.firstChild;
              expect(bind(resolver, 'resolveElementDeclaration', e))
                .to.throw("recursive element type");
            });
            resolver.resolveElementDeclaration(element);
            expect(spy).to.be.called;
          });

        });

        context("without attribute @ref", function () {

          it("should return an element with the resolved type of child xs:simpleType when declared", function () {
            var doc = parse(
              '<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">' +
               '<xs:element>' +
                '<xs:simpleType/>' +
               '</xs:element>' +
              '</xs:schema>');
            var root = doc.documentElement;
            var element = root.firstChild;

            var resolver = Resolver.create(doc);
            var type = {};
            var spy = sinon.stub(resolver, 'resolveTypeElement').returns(type);

            var e = resolver.resolveElementDeclaration(element);

            expect(e.type).to.equal(type);

            expect(spy).to.be.called;
            expect(spy.getCall(0).args[0]).to.equal(element.firstChild);
          });

          it("should return the result of calling #resolveTypeElement() with child xs:complexType when declared", function () {
            var doc = parse(
              '<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">' +
               '<xs:element>' +
                '<xs:complexType/>' +
               '</xs:element>' +
              '</xs:schema>');
            var root = doc.documentElement;
            var element = root.firstChild;

            var resolver = Resolver.create(doc);
            var type = {};
            var spy = sinon.stub(resolver, 'resolveTypeElement').returns(type);

            var e = resolver.resolveElementDeclaration(element);

            expect(e.type).to.equal(type);

            expect(spy).to.be.called;
            expect(spy.getCall(0).args[0]).to.equal(element.firstChild);
          });

        });

      });

    });

    describe('#resolveQualifiedName()', function () {

      context("with prefix", function () {

        var doc;
        var resolver;

        beforeEach(function () {
          doc = parse('<foo xmlns:xxx="urn:example:baz"/>');
          resolver = Resolver.create(doc);
        });

        it("should return a sulfur/schema/qname with the local name and the namespace URI declared with the prefix", function () {
          var resolvePrefixSpy = sinon.spy(resolver, 'resolvePrefix');
          var r = resolver.resolveQualifiedName('xxx:foo', doc.documentElement);
          expect(resolvePrefixSpy)
            .to.be.calledWith('xxx', sinon.match.same(doc.documentElement));
          expect(r).to.eql(QName.create('foo', 'urn:example:baz'));
        });

        it("should reject when no namespace is declared for the prefix", function () {
          expect(bind(resolver, 'resolveQualifiedName', 'yyy:foo', doc.documentElement))
            .to.throw('cannot resolve prefix "yyy"');
        });

      });

      context("with no prefix", function () {

        it("should return a sulfur/schema/qname with the local name and the namespace URI declared with the empty prefix", function () {
          var doc = parse('<foo xmlns="urn:example:bar"/>');
          var resolver = Resolver.create(doc);
          var resolvePrefixSpy = sinon.spy(resolver, 'resolvePrefix');
          var r = resolver.resolveQualifiedName('foo', doc.documentElement);
          expect(resolvePrefixSpy)
            .to.be.calledWith('', sinon.match.same(doc.documentElement));
          expect(r).to.eql(QName.create('foo', 'urn:example:bar'));
        });

        it("should return a sulfur/schema/qname with no namespace URI no namespace for the empty prefix is declared", function () {
          var doc = parse('<foo/>');
          var resolver = Resolver.create(doc);
          var resolvePrefixSpy = sinon.spy(resolver, 'resolvePrefix');
          var r = resolver.resolveQualifiedName('foo', doc.documentElement);
          expect(resolvePrefixSpy)
            .to.be.calledWith('', sinon.match.same(doc.documentElement));
          expect(r).to.eql(QName.create('foo', null));
        });

      });

    });

    describe('#resolvePrefix()', function () {

      it("should resolve to the most local namespace declaration", function () {
        var doc = parse(
          '<foo>' +
           '<bar xmlns:xxx="urn:example:bar"/>' +
          '</foo>');
        var resolver = Resolver.create(doc);
        var element = doc.documentElement.firstChild;
        var r = resolver.resolvePrefix('xxx', element);
        expect(r).to.equal('urn:example:bar');
      });

      it("should go up the document tree", function () {
        var doc = parse(
          '<foo xmlns:bar="urn:example:foo">' +
           '<bar/>' +
          '</foo>');
        var resolver = Resolver.create(doc);
        var element = doc.documentElement.firstChild;
        var r = resolver.resolvePrefix('bar', element);
        expect(r).to.equal('urn:example:foo');
      });

      it("should handle the empty prefix", function () {
        var doc = parse('<foo xmlns="urn:example:bar"/>');
        var resolver = Resolver.create(doc);
        var element = doc.documentElement;
        var r = resolver.resolvePrefix('', element);
        expect(r).to.equal('urn:example:bar');
      });

      it("should return undefined for an undeclared prefix", function () {
        var doc = parse('<foo/>');
        var resolver = Resolver.create(doc);
        var element = doc.documentElement;
        expect(resolver.resolvePrefix('foo', element)).to.be.undefined;
      });

    });

  });

});
