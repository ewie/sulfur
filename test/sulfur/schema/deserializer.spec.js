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
  'sulfur/schema',
  'sulfur/schema/deserializer',
  'sulfur/schema/deserializer/type/simple',
  'sulfur/schema/element',
  'sulfur/schema/elements',
  'sulfur/schema/facets',
  'sulfur/schema/qname',
  'sulfur/schema/type/simple/primitive'
], function (
    shared,
    Schema,
    Deserializer,
    SimpleTypeDeserializer,
    Element,
    Elements,
    Facets,
    QName,
    PrimitiveType
) {

  'use strict';

  var expect = shared.expect;
  var sinon = shared.sinon;
  var bind = shared.bind;

  describe('sulfur/schema/deserializer', function () {

    describe('#deserialize()', function () {

      function parse(s) {
        var p = new DOMParser();
        return p.parseFromString(s, 'text/xml');
      }

      var deserializer;
      var sandbox;

      beforeEach(function () {
        sandbox = sinon.sandbox.create();
        deserializer = Deserializer.create();
      });

      afterEach(function () {
        sandbox.restore();
      });

      it("should reject when the root element's name other then 'schema'", function () {
        var doc = parse('<xxx/>');
        expect(bind(deserializer, 'deserialize', doc))
          .to.throw("expecting an XML Schema document");
      });

      it("should reject when the root element's namespace is not {http://www.w3.org/2001/XMLSchema}", function () {
        var doc = parse('<xs:schema xmlns:xs="urn:example:dummy"/>');
        expect(bind(deserializer, 'deserialize', doc))
          .to.throw("expecting an XML Schema document");
      });

      it("should reject when there are no root element declarations", function () {
        var doc = parse('<schema xmlns="http://www.w3.org/2001/XMLSchema"/>');
        expect(bind(deserializer, 'deserialize', doc))
          .to.throw("expecting a compatible root element declaration");
      });

      context("with root element declarations", function () {

        it("should reject when there's no compatible root element declaration", function () {
          var doc = parse(
            '<schema xmlns="http://www.w3.org/2001/XMLSchema">' +
             '<element>' +
              '<complexType>' +
               '<sequence/>' +
              '</complexType>' +
             '</element>' +
             '<element>' +
              '<complexType>' +
               '<sequence/>' +
              '</complexType>' +
             '</element>' +
            '</schema>');
          expect(bind(deserializer, 'deserialize', doc))
            .to.throw("expecting a compatible root element declaration");
        });

        context("with a compatible root element declaration", function () {

          var deserializer;
          var simpleType;

          beforeEach(function () {
            var facet = { qname: QName.create('x', 'urn:example:y') };
            var facetDeserializer = { facet: facet };
            simpleType = PrimitiveType.create(
              { qname: QName.create('knownType', 'urn:example:y'),
                facets: Facets.create([ facet ])
              });
            var simpleTypeDeserializer = SimpleTypeDeserializer.create(
              [ simpleType ], [ facetDeserializer ]);
            deserializer = Deserializer.create([ simpleTypeDeserializer ]);
          });

          it("should return a sulfur/schema", function () {
            var doc = parse(
              '<schema targetNamespace="urn:example:bar"' +
                ' xmlns="http://www.w3.org/2001/XMLSchema"' +
                ' xmlns:y="urn:example:y">' +
               '<element name="foo">' +
                '<complexType>' +
                 '<all>' +
                  '<element name="x" type="y:knownType"/>' +
                 '</all>' +
                '</complexType>' +
               '</element>' +
              '</schema>');
            var schema = deserializer.deserialize(doc);
            expect(Schema.prototype).to.be.prototypeOf(schema);
          });

          it("should use the value of attribute xs:schema/@targetNamespace as the schema's namespace URI", function () {
            var doc = parse(
              '<schema targetNamespace="urn:example:bar"' +
                ' xmlns="http://www.w3.org/2001/XMLSchema"' +
                ' xmlns:y="urn:example:y">' +
               '<element name="foo">' +
                '<complexType>' +
                 '<all>' +
                  '<element name="x" type="y:knownType"/>' +
                 '</all>' +
                '</complexType>' +
               '</element>' +
              '</schema>');
            var schema = deserializer.deserialize(doc);
            expect(schema.qname).to.eql(QName.create('foo', 'urn:example:bar'));
          });

          it("should use the first root element declaration which only declares elements with compatible types", function () {
            var doc = parse(
              '<schema' +
                ' xmlns="http://www.w3.org/2001/XMLSchema"' +
                ' xmlns:y="urn:example:y">' +
               '<element name="foo">' +
                '<complexType>' +
                 '<all>' +
                  '<element name="x" type="y:unknownType"/>' +
                 '</all>' +
                '</complexType>' +
               '</element>' +
               '<element name="bar">' +
                '<complexType>' +
                 '<all>' +
                  '<element name="x" type="y:knownType"/>' +
                  '<element name="y" type="y:knownType"/>' +
                 '</all>' +
                '</complexType>' +
               '</element>' +
              '</schema>');
            var schema = deserializer.deserialize(doc);
            expect(schema.elements).to.eql(
              Elements.create([
                Element.create('x', simpleType),
                Element.create('y', simpleType)
              ]));
          });

          it("should ignore prohibited elements declarations", function () {
            var doc = parse(
              '<schema' +
                ' xmlns="http://www.w3.org/2001/XMLSchema"' +
                ' xmlns:y="urn:example:y">' +
               '<element name="bar">' +
                '<complexType>' +
                 '<all>' +
                  '<element name="x" type="y:knownType"/>' +
                  '<element name="y" type="y:knownType" minOccurs="0" maxOccurs="0"/>' +
                 '</all>' +
                '</complexType>' +
               '</element>' +
              '</schema>');
            var schema = deserializer.deserialize(doc);
            expect(schema.elements).to.eql(
              Elements.create([ Element.create('x', simpleType) ]));
          });

          it("should ignore optional element declarations with incompatible type", function () {
            var doc = parse(
              '<schema' +
                ' xmlns="http://www.w3.org/2001/XMLSchema"' +
                ' xmlns:y="urn:example:y">' +
               '<element name="bar">' +
                '<complexType>' +
                 '<all>' +
                  '<element name="x" type="y:someType" minOccurs="0"/>' +
                  '<element name="y" type="y:knownType"/>' +
                 '</all>' +
                '</complexType>' +
               '</element>' +
              '</schema>');
            var schema = deserializer.deserialize(doc);
            expect(schema.elements).to.eql(
              Elements.create([ Element.create('y', simpleType) ]));
          });

        });

      });

    });

  });

});
