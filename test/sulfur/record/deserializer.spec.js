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
  'sulfur/record',
  'sulfur/record/deserializer',
  'sulfur/schema',
  'sulfur/schema/element',
  'sulfur/schema/elements',
  'sulfur/schema/qname',
  'sulfur/schema/type/complex/list',
  'sulfur/schema/type/simple/primitive/string',
  'sulfur/schema/value/complex',
  'sulfur/schema/value/list',
  'sulfur/schema/value/simple/list',
  'sulfur/schema/value/simple/string'
], function (shared, Record, Deserializer, Schema, Element, Elements, QName, ComplexListType, StringType, ComplexValue, ListValue, SimpleListValue, StringValue) {

  'use strict';

  var expect = shared.expect;
  var bind = shared.bind;

  describe('sulfur/record/deserializer', function () {

    function parse(s) {
      var p = new DOMParser();
      return p.parseFromString(s, 'text/xml');
    }

    describe('#deserialize', function () {

      it("should reject an XML Document whose root element has a different namespace than the schema", function () {
        var doc = parse(
          '<x:foo xmlns:x="urn:example:xxx">' +
          '</x:foo>');
        var schema = Schema.create(QName.create('foo', 'urn:example:bar'));
        var deserializer = Deserializer.create(schema);
        expect(bind(deserializer, 'deserialize', doc))
          .to.throw("record document with unexpected root element");
      });

      it("should reject an XML Document whose root element has a different name than the schema", function () {
        var doc = parse(
          '<x:xxx xmlns:x="urn:example:bar">' +
          '</x:xxx>');
        var schema = Schema.create(QName.create('foo', 'urn:example:bar'));
        var deserializer = Deserializer.create(schema);
        expect(bind(deserializer, 'deserialize', doc))
          .to.throw("record document with unexpected root element");
      });

      it("should parse an XML Document with the root element defined by the schema", function () {
        var doc = parse(
          '<x:foo xmlns:x="urn:example:bar">' +
          '</x:foo>');
        var schema = Schema.create(QName.create('foo', 'urn:example:bar'));
        var deserializer = Deserializer.create(schema);
        var record = deserializer.deserialize(doc);
        expect(record).to.eql(Record.create([]));
      });

      it("should extract the ID when defined", function () {
        var doc = parse(
          '<x:foo dm:ID="xyz-123"' +
           ' xmlns:x="urn:example:bar"' +
           ' xmlns:dm="http://www.webcomposition.net/2008/02/dgs/">' +
          '</x:foo>');
        var schema = Schema.create(QName.create('foo', 'urn:example:bar'));
        var deserializer = Deserializer.create(schema);
        var record = deserializer.deserialize(doc);
        expect(record).to.eql(Record.create([], 'xyz-123'));
      });

      it("should deserialize each element defined by the schema", function () {
        var doc = parse(
          '<x:foo xmlns:x="urn:example:bar">' +
            '<x:x/>' +
            '<x:y/>' +
          '</x:foo>');
        var schema = Schema.create(
          QName.create('foo', 'urn:example:bar'),
          Elements.create(
            [ Element.create('x', { valueType: StringValue }),
              Element.create('y', { valueType: StringValue })
            ]));
        var deserializer = Deserializer.create(schema);
        var record = deserializer.deserialize(doc);
        expect(record).to.eql(
          Record.create(
            [ [ 'x', StringValue.create() ],
              [ 'y', StringValue.create() ]
            ]));
      });

      describe("with elements not defined by the schema", function () {

        it("should reject elements with unexpected local name", function () {
          var doc = parse(
            '<x:foo xmlns:x="urn:example:bar">' +
              '<x:xxx/>' +
            '</x:foo>');
          var schema = Schema.create(
            QName.create('foo', 'urn:example:bar'),
            Elements.create(
              [ Element.create('x', { valueType: StringValue }) ]));
          var deserializer = Deserializer.create(schema);
          expect(bind(deserializer, 'deserialize', doc))
            .to.throw("unexpected element {urn:example:bar}xxx");
        });

        it("should reject elements with unexpected namespace", function () {
          var doc = parse(
            '<x:foo xmlns:x="urn:example:bar">' +
              '<y:x xmlns:y="urn:example:xxx"/>' +
            '</x:foo>');
          var schema = Schema.create(
            QName.create('foo', 'urn:example:bar'),
            Elements.create(
              [ Element.create('x', { valueType: StringValue }) ]));
          var deserializer = Deserializer.create(schema);
          expect(bind(deserializer, 'deserialize', doc))
            .to.throw("unexpected element {urn:example:xxx}x");
        });

      });

      it("should deserialize elements whose value type responds to .parse()", function () {
        var doc = parse(
          '<x:foo xmlns:x="urn:example:bar">' +
            '<x:x>abc</x:x>' +
            '<x:y>x y z</x:y>' +
          '</x:foo>');
        var listValueType = SimpleListValue.withItemValueType(StringValue);
        var schema = Schema.create(
          QName.create('foo', 'urn:example:bar'),
          Elements.create(
            [ Element.create('x', { valueType: StringValue }),
              Element.create('y', { valueType: listValueType })
            ]));
        var deserializer = Deserializer.create(schema);
        var record = deserializer.deserialize(doc);
        expect(record).to.eql(
          Record.create(
            [ [ 'x', StringValue.create('abc') ],
              [ 'y', listValueType.parse('x y z') ]
            ]));
      });

      it("should deserialize elements with a complex type", function () {
        var doc = parse(
          '<x:foo xmlns:x="urn:example:bar">' +
            '<x:x>' +
             '<x:a>1</x:a>' +
             '<x:b>2</x:b>' +
            '</x:x>' +
          '</x:foo>');
        var DerivedComplexValue = ComplexValue.clone({
          allowedElements: Elements.create(
            [ Element.create('a', StringType),
              Element.create('b', StringType)
            ])
        });
        var schema = Schema.create(
          QName.create('foo', 'urn:example:bar'),
          Elements.create(
            [ Element.create('x', { valueType: DerivedComplexValue }) ]));
        var deserializer = Deserializer.create(schema);
        var record = deserializer.deserialize(doc);
        expect(record).to.eql(
          Record.create(
            [ [ 'x',
                DerivedComplexValue.create(
                  [ [ 'a', StringValue.create('1') ],
                    [ 'b', StringValue.create('2') ]
                  ])
              ]
            ]));
      });

      it("should deserialize elements with a complex list type", function () {
        var doc = parse(
          '<x:foo xmlns:x="urn:example:bar">' +
            '<x:x>' +
             '<x:item>1</x:item>' +
             '<x:item>2</x:item>' +
             '<x:item>3</x:item>' +
            '</x:x>' +
          '</x:foo>');
        var listType = ComplexListType.create(
          Element.create('item', StringType));
        var schema = Schema.create(
          QName.create('foo', 'urn:example:bar'),
          Elements.create(
            [ Element.create('x', listType) ]));
        var deserializer = Deserializer.create(schema);
        var record = deserializer.deserialize(doc);
        expect(record).to.eql(
          Record.create(
            [ [ 'x',
                ListValue.create(
                  [ StringValue.create('1'),
                    StringValue.create('2'),
                    StringValue.create('3')
                  ])
              ]
            ]));
      });

    });

  });

});
