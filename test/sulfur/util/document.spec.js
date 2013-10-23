/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global beforeEach, context, describe, it */

define([
  'shared',
  'sulfur/util/document'
], function (shared, Document) {

  'use strict';

  var expect = shared.expect;
  var bind = shared.bind;

  describe('sulfur/util/document', function () {

    describe('.make()', function () {

      it("should create an XML document with the given namespace URI and qualified name", function () {
        var doc = Document.make('urn:y', 'y:x');
        var d = doc.getDocument();
        var e = d.documentElement;
        expect(e.nodeName).to.equal('y:x');
        expect(e.namespaceURI).to.equal('urn:y');
      });

    });

    describe('#getDocument()', function () {

      it("should return the underlying XML document", function () {
        var d = {};
        var doc = Document.create(d);
        expect(doc.getDocument()).to.equal(d);
      });

    });

    describe('#getRoot()', function () {

      it("should return the root element", function () {
        var d = document.implementation.createDocument('urn:x', 'x:y', null);
        var doc = Document.create(d);
        expect(doc.getRoot()).to.equal(d.documentElement);
      });

    });

    describe('#createElement()', function () {

      it("should create an element with the given namespace URI and qualified name", function () {
        var doc = Document.make('urn:y', 'y:x');
        var e = doc.createElement('urn:z', 'z:x');
        expect(e.nodeName).to.equal('z:x');
        expect(e.namespaceURI).to.equal('urn:z');
      });

    });

    describe('#declareNamespace()', function () {

      var doc;

      beforeEach(function () {
        doc = Document.make('urn:foo', 'foo:bar');
      });

      it("should declare the given namespace on the given element", function () {
        var e = doc.createElement('urn:foo', 'foo:bar');
        doc.getRoot().appendChild(e);
        doc.declareNamespace('urn:bar', 'bar', e);
        expect(e.getAttribute('xmlns:bar')).to.equal('urn:bar');
      });

      it("should default to the root element if no element is given", function () {
        doc.declareNamespace('urn:bar', 'bar');
        expect(doc.getRoot().getAttribute('xmlns:bar')).to.equal('urn:bar');
      });

      it("should handle an empty prefix", function () {
        doc.declareNamespace('urn:bar', '');
        expect(doc.getRoot().getAttribute('xmlns')).to.equal('urn:bar');
      });

      context("when the prefix is already declared", function () {

        it("should reject when the prefix has been declared manually", function () {
          doc.declareNamespace('urn:bar', 'bar');
          expect(bind(doc, 'declareNamespace', 'urn:bar', 'bar'))
            .to.throw('prefix "bar" is already declared');
        });

        it("should reject when the prefix has been declared on document creation", function () {
          expect(bind(doc, 'declareNamespace', 'urn:bar', 'foo'))
            .to.throw('prefix "foo" is already declared');
        });

        it("should handle the empty prefix", function () {
          doc.declareNamespace('urn:bar', '');
          expect(bind(doc, 'declareNamespace', 'urn:bar', ''))
            .to.throw('prefix "" is already declared');
        });

      });

    });

    describe('#lookupNamespaceURI()', function () {

      function parse(s) {
        var p = new DOMParser();
        return p.parseFromString(s, 'text/xml');
      }

      var doc;

      beforeEach(function () {
        var d = parse(
          '<x:a xmlns:x="urn:x" xmlns:z="urn:z">' +
           '<x:b xmlns:x="urn:y">' +
            '<c xmlns="urn:void"/>' +
           '</x:b>' +
          '</x:a>');
        doc = Document.create(d);
      });

      it("should default to the root element when no context element is given", function () {
        expect(doc.lookupNamespaceURI('x')).to.equal('urn:x');
      });

      it("should return the namespace URI for the given prefix when declared", function () {
        var e = doc.getRoot().firstChild;
        expect(doc.lookupNamespaceURI('x', e)).to.equal('urn:y');
      });

      it("should return the most locally declared namespace URI for the given context element", function () {
        var e = doc.getRoot().firstChild.firstChild;
        expect(doc.lookupNamespaceURI('x', e)).to.equal('urn:y');
      });

      it("should handle the empty prefix", function () {
        var e = doc.getRoot().firstChild.firstChild;
        expect(doc.lookupNamespaceURI('', e)).to.equal('urn:void');
      });

      it("should accept null as empty prefix", function () {
        var e = doc.getRoot().firstChild.firstChild;
        expect(doc.lookupNamespaceURI(null, e)).to.equal('urn:void');
      });

      it("should handle namespace declarations not affecting the element where they occur", function () {
        expect(doc.lookupNamespaceURI('z')).to.equal('urn:z');
      });

      it("should return null when no namespace URI is associated with the given prefix", function () {
        expect(doc.lookupNamespaceURI('y')).to.be.null;
      });

      it("should return the namespace URI used for the root element when the document was created", function () {
        var d = document.implementation.createDocument('urn:foo', 'foo:bar', null);
        var doc = Document.create(d);
        expect(doc.lookupNamespaceURI('foo')).to.equal('urn:foo');
      });

      context("with a manually declared namespace", function () {

        it("should return the namespace URI for the given prefix when declared", function () {
          var e = doc.getRoot().firstChild;
          e.setAttribute('xmlns:foo', 'urn:foo');
          expect(doc.lookupNamespaceURI('foo', e)).to.equal('urn:foo');
        });

        it("should return the most locally declared namespace URI for the given context element", function () {
          var f = doc.getRoot().firstChild;
          f.setAttribute('xmlns:bar', 'urn:bar');
          var e = f.firstChild;
          expect(doc.lookupNamespaceURI('bar', e)).to.equal('urn:bar');
        });

        it("should handle the empty prefix", function () {
          var e = doc.getRoot();
          e.setAttribute('xmlns', 'urn:empty');
          expect(doc.lookupNamespaceURI('', e)).to.equal('urn:empty');
        });

        it("should handle namespace declarations not affecting the element where they occur", function () {
          expect(doc.lookupNamespaceURI('z')).to.equal('urn:z');
        });

      });

    });

    describe('#lookupPrefix()', function () {

      function parse(s) {
        var p = new DOMParser();
        return p.parseFromString(s, 'text/xml');
      }

      var doc;

      beforeEach(function () {
        var d = parse(
          '<x:a xmlns:x="urn:x" xmlns:z="urn:z">' +
           '<y:b xmlns:y="urn:x">' +
            '<c xmlns="urn:void"/>' +
           '</y:b>' +
          '</x:a>');
        doc = Document.create(d);
      });

      it("should default to the root element when no context element is given", function () {
        expect(doc.lookupPrefix('urn:x')).to.equal('x');
      });

      it("should return the prefix for the given namespace URI when declared", function () {
        var e = doc.getRoot().firstChild;
        expect(doc.lookupPrefix('urn:x', e)).to.equal('y');
      });

      it("should return the most locally declared prefix for the given context element", function () {
        var e = doc.getRoot().firstChild.firstChild;
        expect(doc.lookupPrefix('urn:x', e)).to.equal('y');
      });

      it("should handle the empty prefix", function () {
        var e = doc.getRoot().firstChild.firstChild;
        expect(doc.lookupPrefix('urn:void', e)).to.equal('');
      });

      it("should handle namespace declarations not affecting the element where they occur", function () {
        expect(doc.lookupPrefix('urn:z')).to.equal('z');
      });

      it("should return null when no prefix is associated with the given namespace URI", function () {
        expect(doc.lookupPrefix('urn:y')).to.be.null;
      });

      it("should return the prefix used for the root element when the document was created", function () {
        var d = document.implementation.createDocument('urn:foo', 'foo:bar', null);
        var doc = Document.create(d);
        expect(doc.lookupPrefix('urn:foo')).to.equal('foo');
      });

      it("should return the empty prefix when used for the root element when the document was created", function () {
        var d = document.implementation.createDocument('urn:foo', 'bar', null);
        var doc = Document.create(d);
        expect(doc.lookupPrefix('urn:foo')).to.equal('');
      });

      context("with a manually declared namespace", function () {

        it("should return the prefix for the given namespace URI when declared", function () {
          var e = doc.getRoot().firstChild;
          e.setAttribute('xmlns:foo', 'urn:foo');
          expect(doc.lookupPrefix('urn:foo', e)).to.equal('foo');
        });

        it("should return the most locally declared prefix for the given context element", function () {
          var f = doc.getRoot().firstChild;
          f.setAttribute('xmlns:bar', 'urn:bar');
          var e = f.firstChild;
          expect(doc.lookupPrefix('urn:bar', e)).to.equal('bar');
        });

        it("should handle the empty prefix", function () {
          var e = doc.getRoot();
          e.setAttribute('xmlns', 'urn:empty');
          expect(doc.lookupPrefix('urn:empty', e)).to.equal('');
        });

        it("should handle namespace declarations not affecting the element where they occur", function () {
          expect(doc.lookupPrefix('urn:z')).to.equal('z');
        });

      });

    });

  });

});
