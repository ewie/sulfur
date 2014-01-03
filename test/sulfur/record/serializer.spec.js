/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global beforeEach, context, describe, it */

define([
  'shared',
  'sulfur/record',
  'sulfur/record/serializer',
  'sulfur/schema',
  'sulfur/schema/element',
  'sulfur/schema/elements',
  'sulfur/schema/qname',
  'sulfur/schema/type/complex/list',
  'sulfur/schema/type/complex/primitive',
  'sulfur/schema/type/simple/primitive/string',
  'sulfur/schema/value/complex',
  'sulfur/schema/value/list',
  'sulfur/schema/value/simple',
  'sulfur/schema/value/simple/list',
  'sulfur/schema/value/simple/string'
], function (shared, Record, Serializer, Schema, Element, Elements, QName, ComplexListType, PrimitiveComplexType, StringType, ComplexValue, ListValue, SimpleValue, SimpleListValue, StringValue) {

  'use strict';

  var expect = shared.expect;
  var returns = shared.returns;

  describe('sulfur/record/serializer', function () {

    function mockSimpleValue(value) {
      return Object.create(SimpleValue.prototype, {
        toString: { value: returns(value) }
      });
    }

    describe('#serialize()', function () {

      it("should return an XML Document", function () {
        var qname = QName.create('foo', 'urn:example:bar');
        var schema = Schema.create(qname,
          Elements.create([ Element.create('x') ]));
        var serializer = Serializer.create(schema);
        var record = Record.create([]);
        var d = serializer.serialize(record);
        var e = d.documentElement;
        expect(e.namespaceURI).to.equal(schema.qname.namespaceURI);
        expect(e.tagName).to.equal('x:' + schema.qname.localName);
      });

      it("should serialize each record field with a child element under the root element", function () {
        var qname = QName.create('foo', 'urn:example:bar');
        var schema = Schema.create(qname,
          Elements.create(
            [ Element.create('x'),
              Element.create('y')
            ]));
        var serializer = Serializer.create(schema);
        var record = Record.create([
          [ 'x', mockSimpleValue('abc') ],
          [ 'y', mockSimpleValue('def') ]
        ]);
        var d = serializer.serialize(record);
        var ee = d.documentElement.children;
        expect(ee).to.have.lengthOf(2);
        var e = ee.item(0);
        expect(e.namespaceURI).to.equal(schema.qname.namespaceURI);
        expect(e.tagName).to.equal('x:x');
        e = ee.item(1);
        expect(e.namespaceURI).to.equal(schema.qname.namespaceURI);
        expect(e.tagName).to.equal('x:y');
      });


      it("should ignore fields with undefined value", function () {
        var qname = QName.create('foo', 'urn:example:bar');
        var schema = Schema.create(qname,
          Elements.create(
            [ Element.create('x'),
              Element.create('y')
            ]));
        var serializer = Serializer.create(schema);
        var record = Record.create([
          [ 'x' ],
          [ 'y', mockSimpleValue('xyz') ]
        ]);
        var d = serializer.serialize(record);
        var ee = d.documentElement.children;
        expect(ee).to.have.lengthOf(1);
        var e = ee.item(0);
        expect(e.namespaceURI).to.equal(schema.qname.namespaceURI);
        expect(e.tagName).to.equal('x:y');
      });

      context("when a field has an simple atomic value", function () {

        var record;
        var value;
        var serializer;

        beforeEach(function () {
          var qname = QName.create('foo', 'urn:example:bar');
          var schema = Schema.create(qname,
            Elements.create(
              [ Element.create('x') ]));
          serializer = Serializer.create(schema);
          value = mockSimpleValue('abc');
          record = Record.create([
            [ 'x', value ]
          ]);
        });

        it("should serialize the value using a text node", function () {
          var d = serializer.serialize(record);
          var e = d.documentElement.firstChild;
          expect(e.childNodes).to.have.lengthOf(1);
          var f = e.firstChild;
          expect(f.nodeType).to.equal(Node.TEXT_NODE);
        });

        it("should use the value's string representation using .toString()", function () {
          var d = serializer.serialize(record);
          var e = d.documentElement.firstChild;
          expect(e.childNodes).to.have.lengthOf(1);
          var f = e.firstChild;
          expect(f.nodeValue).to.equal(value.toString());
        });

      });

      context("when a field has an simple list value", function () {

        var record;
        var value;
        var serializer;

        beforeEach(function () {
          var qname = QName.create('foo', 'urn:example:bar');
          var schema = Schema.create(qname,
            Elements.create(
              [ Element.create('x') ]));
          serializer = Serializer.create(schema);
          value = SimpleListValue.create([
            mockSimpleValue('x'),
            mockSimpleValue('y'),
            mockSimpleValue('z')
          ]);
          record = Record.create([
            [ 'x', value ]
          ]);
        });

        it("should serialize the value using a text node", function () {
          var d = serializer.serialize(record);
          var e = d.documentElement.firstChild;
          expect(e.childNodes).to.have.lengthOf(1);
          var f = e.firstChild;
          expect(f.nodeType).to.equal(Node.TEXT_NODE);
        });

        it("should use the value's string representation using .toString()", function () {
          var d = serializer.serialize(record);
          var e = d.documentElement.firstChild;
          expect(e.childNodes).to.have.lengthOf(1);
          var f = e.firstChild;
          expect(f.nodeValue).to.equal(value.toString());
        });

      });

      context("when a field has a complex atomic value", function () {

        var record;
        var value;
        var serializer;
        var qname;

        beforeEach(function () {
          qname = QName.create('foo', 'urn:example:bar');
          var DerivedComplexValue = ComplexValue.clone({
            allowedElements: Elements.create(
              [ Element.create('a', StringType),
                Element.create('b', StringType)
              ])
          });
          var ComplexType = PrimitiveComplexType.create({
            qname: {},
            valueType: DerivedComplexValue
          });
          var schema = Schema.create(qname,
            Elements.create(
              [ Element.create('x', ComplexType) ]));
          serializer = Serializer.create(schema);
          value = DerivedComplexValue.create([
            [ 'a', StringValue.create('1') ],
            [ 'b', StringValue.create('2') ]
          ]);
          record = Record.create([
            [ 'x', value ]
          ]);
        });

        it("should serialize the value using a child element for each field", function () {
          var d = serializer.serialize(record);
          var e = d.documentElement.firstChild;
          var ee = e.children;
          expect(ee).to.have.lengthOf(2);
          var f = ee.item(0);
          expect(f.namespaceURI).to.equal(qname.namespaceURI);
          expect(f.tagName).to.equal('x:a');
          f = ee.item(1);
          expect(f.namespaceURI).to.equal(qname.namespaceURI);
          expect(f.tagName).to.equal('x:b');
        });

      });

      context("when a field has a generic list value", function () {

        var record;
        var value;
        var serializer;
        var qname;
        var type;

        beforeEach(function () {
          qname = QName.create('foo', 'urn:example:bar');
          type = ComplexListType.create(Element.create('item', StringType));
          var schema = Schema.create(qname,
            Elements.create([ Element.create('x', type) ]));
          serializer = Serializer.create(schema);
          value = ListValue.create([
            StringValue.create('x'),
            StringValue.create('y'),
            StringValue.create('z')
          ]);
          record = Record.create([
            [ 'x', value ]
          ]);
        });

        it("should serialize the value using a child element for each field", function () {
          var d = serializer.serialize(record);
          var e = d.documentElement.firstChild;
          var ee = e.children;
          expect(ee).to.have.lengthOf(3);
          Array.prototype.forEach.call(ee, function (e, i) {
            expect(e.namespaceURI).to.equal(qname.namespaceURI);
            expect(e.tagName).to.equal('x:' + type.element.name);
            expect(e.childNodes).to.have.lengthOf(1);
            var f = e.firstChild;
            expect(f.nodeType).to.equal(Node.TEXT_NODE);
            expect(f.nodeValue).to.equal(value.getValueAt(i).toString());
          });
        });

      });

    });

  });

});
