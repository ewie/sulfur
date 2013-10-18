/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global afterEach, beforeEach, context, describe, it */

define([
  'shared',
  'sulfur/schema/deserializer/resolver',
  'sulfur/schema/qname',
  'sulfur/util/xpath'
], function ($shared, $resolver, $qname, $xpath) {

  'use strict';

  var expect = $shared.expect;
  var sinon = $shared.sinon;
  var bind = $shared.bind;

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

    describe('#getXPath()', function () {

      it("should return the XPath object", function () {
        var xpath = {};
        var context = $resolver.create(undefined, xpath);
        expect(context.getXPath()).to.equal(xpath);
      });

    });

    describe('#resolveGlobalType()', function () {

      it("should return undefined when no global type with the given name is declared", function () {
        var doc = parse('<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema"/>');
        var xpath = $xpath.create(doc);
        var context = $resolver.create(undefined, xpath);
        expect(context.resolveGlobalType('foo')).to.be.undefined;
      });

      it("should return the result of calling #resolveTypeElement() with the xs:simpleType of the given name when declared", function () {
        var doc = parse(
          '<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">' +
           '<xs:simpleType name="foo"/>' +
          '</xs:schema>');
        var xpath = $xpath.create(doc);
        var context = $resolver.create(undefined, xpath);
        var resolveSpy = sinon.stub(context, 'resolveTypeElement').returns({});
        var type = context.resolveGlobalType('foo');
        expect(resolveSpy)
          .to.be.calledWith(doc.documentElement.firstChild)
          .to.have.returned(sinon.match.same(type));
      });

      it("should return the result of calling #resolveTypeElement() with the xs:complexType of the given name when declared", function () {
        var doc = parse(
          '<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">' +
           '<xs:complexType name="bar"/>' +
          '</xs:schema>');
        var xpath = $xpath.create(doc);
        var context = $resolver.create(undefined, xpath);
        var resolveSpy = sinon.stub(context, 'resolveTypeElement').returns({});
        var type = context.resolveGlobalType('bar');
        expect(resolveSpy)
          .to.be.calledWith(doc.documentElement.firstChild)
          .to.have.returned(sinon.match.same(type));
      });

    });

    describe('#resolveTypeElement()', function () {

      var converters;

      beforeEach(function () {
        converters = [
          {
            resolveElement: function () {}
          },
          {
            resolveElement: function () {}
          }
        ];
      });

      it("should reject when every converter's #resolveElement() returns undefined", function () {
        var element = { localName: 'x', namespaceURI: 'urn:y' };
        var context = $resolver.create(converters);
        var spies = converters.map(function (converter) {
          return sinon.spy(converter, 'resolveElement');
        });
        expect(bind(context, 'resolveTypeElement', element))
          .to.throw("cannot resolve type element {urn:y}x");
        spies.forEach(function (spy) {
          expect(spy).to.be.calledWith(
            sinon.match.same(element),
            sinon.match.same(context));
        });
      });

      it("should return the defined result of any converter's #resolveElement()", function () {
        var element = {};
        var context = $resolver.create(converters);
        var spy = sinon.stub(converters[0], 'resolveElement').returns({});
        var type = context.resolveTypeElement(element);
        expect(spy)
          .to.be.calledWith(
            sinon.match.same(element),
            sinon.match.same(context))
          .to.have.returned(sinon.match.same(type));
      });

    });

    describe('#resolveNamedType()', function () {

      var converters;

      beforeEach(function () {
        converters = [
          {
            resolveQualifiedName: function () {}
          },
          {
            resolveQualifiedName: function () {}
          }
        ];
      });

      it("should reject when every converter's #resolveQualifiedName() returns undefined", function () {
        var context = $resolver.create(converters);
        var spies = converters.map(function (converter) {
          return sinon.spy(converter, 'resolveQualifiedName');
        });
        var qname = $qname.create('foo', 'urn:bar');
        expect(bind(context, 'resolveNamedType', qname))
          .to.throw("cannot resolve type {urn:bar}foo");
        spies.forEach(function (spy) {
          expect(spy).to.be.calledWith(sinon.match.same(qname));
        });
      });

      it("should return the defined result of any converter's #resolveQualifiedName()", function () {
        var context = $resolver.create(converters);
        var spy = sinon.stub(converters[0], 'resolveQualifiedName').returns({});
        var qname = $qname.create('foo', 'urn:bar');
        var type = context.resolveNamedType(qname);
        expect(spy)
          .to.be.calledWith(sinon.match.same(qname))
          .to.have.returned(sinon.match.same(type));
      });

    });

    describe('#resolveElementType()', function () {

      it("should reject an element without a supported type declaration", function () {
        var doc = parse(
          '<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">' +
           '<xs:element/>' +
          '</xs:schema>');
        var root = doc.documentElement;
        var element = root.firstChild;
        var xpath = $xpath.create(doc);
        var context = $resolver.create(undefined, xpath);
        expect(bind(context, 'resolveElementType', element))
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
            var context = $resolver.create();
            var resolveSpy = sinon.stub(context, 'resolveGlobalType').returns({});
            var type = context.resolveElementType(element);
            expect(resolveSpy)
              .to.be.calledWith('someType')
              .to.have.returned(sinon.match.same(type));
          });

          it("should return the result of calling #resolveNamedType() with the resolved type name when #resolveGlobalType() returns undefined", function () {
            var doc = parse(
              '<xs:schema' +
                ' xmlns:xs="http://www.w3.org/2001/XMLSchema"' +
                ' xmlns:foo="urn:foo">' +
               '<xs:element type="foo:bar"/>' +
              '</xs:schema>');
            var root = doc.documentElement;
            var element = root.firstChild;
            var context = $resolver.create();
            sinon.stub(context, 'resolveGlobalType').returns(undefined);
            var resolveSpy = sinon.stub(context, 'resolveNamedType').returns({});
            var type = context.resolveElementType(element);
            expect(resolveSpy)
              .to.be.calledWith($qname.create('bar', 'urn:foo'))
              .to.have.returned(sinon.match.same(type));
          });

        });

        context("without attribute @type", function () {

          it("should return the result of calling #resolveTypeElement() with child xs:simpleType when declared", function () {
            var doc = parse(
              '<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">' +
               '<xs:element>' +
                '<xs:simpleType/>' +
               '</xs:element>' +
              '</xs:schema>');
            var root = doc.documentElement;
            var element = root.firstChild;
            var xpath = $xpath.create(doc);
            var context = $resolver.create(undefined, xpath);
            var resolveSpy = sinon.stub(context, 'resolveTypeElement').returns({});
            var type = context.resolveElementType(element);
            expect(resolveSpy)
              .to.be.calledWith(element.firstChild)
              .to.have.returned(sinon.match.same(type));
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
            var xpath = $xpath.create(doc);
            var context = $resolver.create(undefined, xpath);
            var resolveSpy = sinon.stub(context, 'resolveTypeElement').returns({});
            var type = context.resolveElementType(element);
            expect(resolveSpy)
              .to.be.calledWith(element.firstChild)
              .to.have.returned(sinon.match.same(type));
          });

        });

      });

    });

    describe('#resolveQualifiedName()', function () {

      it("should resolve the prefix when the qualified name has a prefix", function () {
        var doc = parse('<foo xmlns:xxx="urn:baz"/>');
        var context = $resolver.create();
        var resolvePrefixSpy = sinon.spy(context, 'resolvePrefix');
        var r = context.resolveQualifiedName('xxx:foo', doc.documentElement);
        expect(resolvePrefixSpy)
          .to.be.calledWith('xxx', sinon.match.same(doc.documentElement));
        expect(r).to.eql($qname.create('foo', 'urn:baz'));
      });

      it("should resolve the empty prefix when the qualified name has no prefix", function () {
        var doc = parse('<foo xmlns="urn:bar"/>');
        var context = $resolver.create();
        var resolvePrefixSpy = sinon.spy(context, 'resolvePrefix');
        var r = context.resolveQualifiedName('foo', doc.documentElement);
        expect(resolvePrefixSpy)
          .to.be.calledWith('', sinon.match.same(doc.documentElement));
        expect(r).to.eql($qname.create('foo', 'urn:bar'));
      });

    });

    describe('#resolvePrefix()', function () {

      it("should resolve to the most local namespace declaration", function () {
        var doc = parse(
          '<foo>' +
           '<bar xmlns:xxx="urn:bar"/>' +
          '</foo>');
        var context = $resolver.create();
        var element = doc.documentElement.firstChild;
        var r = context.resolvePrefix('xxx', element);
        expect(r).to.equal('urn:bar');
      });

      it("should go up the document tree", function () {
        var doc = parse(
          '<foo xmlns:bar="urn:foo">' +
           '<bar/>' +
          '</foo>');
        var context = $resolver.create();
        var element = doc.documentElement.firstChild;
        var r = context.resolvePrefix('bar', element);
        expect(r).to.equal('urn:foo');
      });

      it("should handle the empty prefix", function () {
        var doc = parse('<foo xmlns="urn:bar"/>');
        var context = $resolver.create();
        var element = doc.documentElement;
        var r = context.resolvePrefix('', element);
        expect(r).to.equal('urn:bar');
      });

      it("should reject an undeclared prefix", function () {
        var doc = parse('<foo/>');
        var context = $resolver.create();
        var element = doc.documentElement;
        expect(bind(context, 'resolvePrefix', 'foo', element))
          .to.throw('cannot resolve undeclared prefix "foo"');
      });

    });

  });

});
