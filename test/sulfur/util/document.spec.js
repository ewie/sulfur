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
        var doc = Document.make('urn:example:y', 'y:x');
        var d = doc.document;
        var e = d.documentElement;
        expect(e.nodeName).to.equal('y:x');
        expect(e.namespaceURI).to.equal('urn:example:y');
      });

    });

    describe('#document', function () {

      it("should return the underlying XML document", function () {
        var d = {};
        var doc = Document.create(d);
        expect(doc.document).to.equal(d);
      });

    });

    describe('#root', function () {

      it("should return the root element", function () {
        var d = document.implementation.createDocument('urn:example:x', 'x:y', null);
        var doc = Document.create(d);
        expect(doc.root).to.equal(d.documentElement);
      });

    });

    describe('#createElement()', function () {

      it("should create an element with the given namespace URI and qualified name", function () {
        var doc = Document.make('urn:example:y', 'y:x');
        var e = doc.createElement('urn:example:z', 'z:x');
        expect(e.nodeName).to.equal('z:x');
        expect(e.namespaceURI).to.equal('urn:example:z');
      });

    });

    describe('#declareNamespace()', function () {

      var doc;

      beforeEach(function () {
        doc = Document.make('urn:example:foo', 'foo:bar');
      });

      it("should declare the given namespace on the given element", function () {
        var e = doc.createElement('urn:example:foo', 'foo:bar');
        doc.root.appendChild(e);
        doc.declareNamespace('urn:example:bar', 'bar', e);
        expect(e.getAttribute('xmlns:bar')).to.equal('urn:example:bar');
      });

      it("should default to the root element if no element is given", function () {
        doc.declareNamespace('urn:example:bar', 'bar');
        expect(doc.root.getAttribute('xmlns:bar')).to.equal('urn:example:bar');
      });

      it("should handle an empty prefix", function () {
        doc.declareNamespace('urn:example:bar', '');
        expect(doc.root.getAttribute('xmlns')).to.equal('urn:example:bar');
      });

      context("when the prefix is already declared", function () {

        it("should reject when the prefix has been declared manually", function () {
          doc.declareNamespace('urn:example:bar', 'bar');
          expect(bind(doc, 'declareNamespace', 'urn:example:bar', 'bar'))
            .to.throw('prefix "bar" is already declared');
        });

        it("should reject when the prefix has been declared on document creation", function () {
          expect(bind(doc, 'declareNamespace', 'urn:example:bar', 'foo'))
            .to.throw('prefix "foo" is already declared');
        });

        it("should handle the empty prefix", function () {
          doc.declareNamespace('urn:example:bar', '');
          expect(bind(doc, 'declareNamespace', 'urn:example:bar', ''))
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
          '<x:a xmlns:x="urn:example:x" xmlns:z="urn:example:z">' +
           '<x:b xmlns:x="urn:example:y">' +
            '<c xmlns="urn:example:void"/>' +
           '</x:b>' +
          '</x:a>');
        doc = Document.create(d);
      });

      it("should default to the root element when no context element is given", function () {
        expect(doc.lookupNamespaceURI('x')).to.equal('urn:example:x');
      });

      it("should return the namespace URI for the given prefix when declared", function () {
        var e = doc.root.firstChild;
        expect(doc.lookupNamespaceURI('x', e)).to.equal('urn:example:y');
      });

      it("should return the most locally declared namespace URI for the given context element", function () {
        var e = doc.root.firstChild.firstChild;
        expect(doc.lookupNamespaceURI('x', e)).to.equal('urn:example:y');
      });

      it("should handle the empty prefix", function () {
        var e = doc.root.firstChild.firstChild;
        expect(doc.lookupNamespaceURI('', e)).to.equal('urn:example:void');
      });

      it("should accept null as empty prefix", function () {
        var e = doc.root.firstChild.firstChild;
        expect(doc.lookupNamespaceURI(null, e)).to.equal('urn:example:void');
      });

      it("should handle namespace declarations not affecting the element where they occur", function () {
        expect(doc.lookupNamespaceURI('z')).to.equal('urn:example:z');
      });

      it("should return null when no namespace URI is associated with the given prefix", function () {
        expect(doc.lookupNamespaceURI('y')).to.be.null;
      });

      it("should return the namespace URI used for the root element when the document was created", function () {
        var d = document.implementation.createDocument('urn:example:foo', 'foo:bar', null);
        var doc = Document.create(d);
        expect(doc.lookupNamespaceURI('foo')).to.equal('urn:example:foo');
      });

      context("with a manually declared namespace", function () {

        it("should return the namespace URI for the given prefix when declared", function () {
          var e = doc.root.firstChild;
          e.setAttribute('xmlns:foo', 'urn:example:foo');
          expect(doc.lookupNamespaceURI('foo', e)).to.equal('urn:example:foo');
        });

        it("should return the most locally declared namespace URI for the given context element", function () {
          var f = doc.root.firstChild;
          f.setAttribute('xmlns:bar', 'urn:example:bar');
          var e = f.firstChild;
          expect(doc.lookupNamespaceURI('bar', e)).to.equal('urn:example:bar');
        });

        it("should handle the empty prefix", function () {
          var e = doc.root;
          e.setAttribute('xmlns', 'urn:example:empty');
          expect(doc.lookupNamespaceURI('', e)).to.equal('urn:example:empty');
        });

        it("should handle namespace declarations not affecting the element where they occur", function () {
          expect(doc.lookupNamespaceURI('z')).to.equal('urn:example:z');
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
          '<x:a xmlns:x="urn:example:x" xmlns:z="urn:example:z">' +
           '<y:b xmlns:y="urn:example:x">' +
            '<c xmlns="urn:example:void"/>' +
           '</y:b>' +
          '</x:a>');
        doc = Document.create(d);
      });

      it("should default to the root element when no context element is given", function () {
        expect(doc.lookupPrefix('urn:example:x')).to.equal('x');
      });

      it("should return the prefix for the given namespace URI when declared", function () {
        var e = doc.root.firstChild;
        expect(doc.lookupPrefix('urn:example:x', e)).to.equal('y');
      });

      it("should return the most locally declared prefix for the given context element", function () {
        var e = doc.root.firstChild.firstChild;
        expect(doc.lookupPrefix('urn:example:x', e)).to.equal('y');
      });

      it("should handle the empty prefix", function () {
        var e = doc.root.firstChild.firstChild;
        expect(doc.lookupPrefix('urn:example:void', e)).to.equal('');
      });

      it("should handle namespace declarations not affecting the element where they occur", function () {
        expect(doc.lookupPrefix('urn:example:z')).to.equal('z');
      });

      it("should return null when no prefix is associated with the given namespace URI", function () {
        expect(doc.lookupPrefix('urn:example:y')).to.be.null;
      });

      it("should return the prefix used for the root element when the document was created", function () {
        var d = document.implementation.createDocument('urn:example:foo', 'foo:bar', null);
        var doc = Document.create(d);
        expect(doc.lookupPrefix('urn:example:foo')).to.equal('foo');
      });

      it("should return the empty prefix when used for the root element when the document was created", function () {
        var d = document.implementation.createDocument('urn:example:foo', 'bar', null);
        var doc = Document.create(d);
        expect(doc.lookupPrefix('urn:example:foo')).to.equal('');
      });

      context("with a manually declared namespace", function () {

        it("should return the prefix for the given namespace URI when declared", function () {
          var e = doc.root.firstChild;
          e.setAttribute('xmlns:foo', 'urn:example:foo');
          expect(doc.lookupPrefix('urn:example:foo', e)).to.equal('foo');
        });

        it("should return the most locally declared prefix for the given context element", function () {
          var f = doc.root.firstChild;
          f.setAttribute('xmlns:bar', 'urn:example:bar');
          var e = f.firstChild;
          expect(doc.lookupPrefix('urn:example:bar', e)).to.equal('bar');
        });

        it("should handle the empty prefix", function () {
          var e = doc.root;
          e.setAttribute('xmlns', 'urn:example:empty');
          expect(doc.lookupPrefix('urn:example:empty', e)).to.equal('');
        });

        it("should handle namespace declarations not affecting the element where they occur", function () {
          expect(doc.lookupPrefix('urn:example:z')).to.equal('z');
        });

      });

    });

  });

});
