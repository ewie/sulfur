/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global describe, it */

define([
  'shared',
  'sulfur/schema',
  'sulfur/schema/element',
  'sulfur/schema/elements',
  'sulfur/schema/serializer',
  'sulfur/schema/serializer/context'
], function (shared, Schema, Element, Elements, Serializer, Context) {

  'use strict';

  var expect = shared.expect;
  var sinon = shared.sinon;
  var returns = shared.returns;

  describe('sulfur/schema/serializer', function () {

    describe('#serialize()', function () {

      function parse(s) {
        var p = new DOMParser();
        return p.parseFromString(s, 'text/xml');
      }

      function normalizeXML(doc) {
        var s = new XMLSerializer();
        return parse(s.serializeToString(doc));
      }

      it("should return an XML Schema document", function () {
        var qname = {};
        var schema = Schema.create(qname, { toArray: returns([]) });
        var serializer = Serializer.create();
        var doc = serializer.serialize(schema);
        var e = doc.documentElement;
        expect(e.nodeName).to.equal('xs:schema');
        expect(e.namespaceURI).to.equal('http://www.w3.org/2001/XMLSchema');
      });

      it("should set attribute @targetNamespace", function () {
        var qname = { namespaceURI: 'urn:example:bar' };
        var schema = Schema.create(qname, { toArray: returns([]) });
        var serializer = Serializer.create();
        var doc = serializer.serialize(schema);
        var e = doc.documentElement;
        expect(e.getAttribute('targetNamespace')).to.equal(qname.namespaceURI);
      });

      it("should set attribute @elementFormDefault to 'qualified'", function () {
        var qname = { namespaceURI: 'urn:example:bar' };
        var schema = Schema.create(qname, { toArray: returns([]) });
        var serializer = Serializer.create();
        var doc = serializer.serialize(schema);
        var e = doc.documentElement;
        expect(e.getAttribute('elementFormDefault')).to.equal('qualified');
      });

      it("should set attribute @attributeFormDefault to 'unqualified'", function () {
        var qname = { namespaceURI: 'urn:example:bar' };
        var schema = Schema.create(qname, { toArray: returns([]) });
        var serializer = Serializer.create();
        var doc = serializer.serialize(schema);
        var e = doc.documentElement;
        expect(e.getAttribute('attributeFormDefault')).to.equal('unqualified');
      });

      it("should include a root element declaration using the schema's local name", function () {
        var qname = { localName: 'foo' };
        var schema = Schema.create(qname, { toArray: returns([]) });
        var serializer = Serializer.create();
        var doc = serializer.serialize(schema);
        var e = doc.documentElement.firstChild;
        expect(e.nodeName).to.equal('xs:element');
        expect(e.namespaceURI).to.equal('http://www.w3.org/2001/XMLSchema');
        expect(e.attributes.name.value).to.equal('foo');
      });

      it("should serialize the schema elements", function () {
        var element1 = Element.create('x');
        var element2 = Element.create('y');
        var qname = {
          localName: 'bar',
          namespaceURI: 'urn:example:foo'
        };
        var schema = Schema.create(qname,
          Elements.create([ element1, element2 ]));
        var typeSerializer = {
          serializeElement: function (element) {
            var e = document.createElementNS('http://www.w3.org/2001/XMLSchema',
              'xs:element');
            e.setAttribute('name', element.name);
            e.setAttribute('type', 'xs:dummy');
            return e;
          }
        };
        var spy = sinon.spy(typeSerializer, 'serializeElement');
        var serializer = Serializer.create(typeSerializer);
        var doc = serializer.serialize(schema);
        var x = parse(
          '<xs:schema targetNamespace="urn:example:foo"' +
            ' elementFormDefault="qualified"' +
            ' attributeFormDefault="unqualified"' +
            ' xmlns:xs="http://www.w3.org/2001/XMLSchema">' +
           '<xs:element name="bar">' +
            '<xs:complexType>' +
             '<xs:all>' +
              '<xs:element name="x" type="xs:dummy"/>' +
              '<xs:element name="y" type="xs:dummy"/>' +
             '</xs:all>' +
            '</xs:complexType>' +
           '</xs:element>' +
          '</xs:schema>');
        expect(spy).to.be.calledTwice;
        expect(spy.getCall(0).args[0]).to.equal(element1);
        expect(Context.prototype).to.be.prototypeOf(spy.getCall(0).args[1]);
        expect(spy.getCall(1).args[0]).to.equal(element2);
        expect(Context.prototype).to.be.prototypeOf(spy.getCall(1).args[1]);
        expect(normalizeXML(doc).isEqualNode(x)).to.be.true;
      });

    });

  });

});
