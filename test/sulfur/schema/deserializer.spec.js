/* Copyright (c) 2013, Erik Wienhold
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
  'sulfur/schema/deserializer/resolver/type/simple',
  'sulfur/schema/element',
  'sulfur/schema/facets',
  'sulfur/schema/qname',
  'sulfur/schema/type/simple/primitive'
], function (
    $shared,
    $schema,
    $deserializer,
    $simpleTypeResolver,
    $element,
    $facets,
    $qname,
    $primitiveType
) {

  'use strict';

  var expect = $shared.expect;
  var sinon = $shared.sinon;
  var bind = $shared.bind;
  var returns = $shared.returns;

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
        deserializer = $deserializer.create();
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
        var doc = parse('<xs:schema xmlns:xs="urn:dummy"/>');
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
            var facet = { getQName: returns($qname.create('x', 'urn:y')) };
            var facetResolver = {
              getFacet: returns(facet)
            };
            simpleType = $primitiveType.create(
              { qname: $qname.create('knownType', 'urn:y'),
                facets: $facets.create([ facet ])
              });
            var simpleTypeResolver = $simpleTypeResolver.create(
              [ simpleType ], [ facetResolver ]);
            deserializer = $deserializer.create([ simpleTypeResolver ]);
          });

          it("should use the first root element declaration which only declares elements with compatible types", function () {
            var doc = parse(
              '<schema' +
                ' xmlns="http://www.w3.org/2001/XMLSchema"' +
                ' xmlns:y="urn:y">' +
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
            expect(schema).to.eql(
              $schema.create('bar',
                [ $element.create('x', simpleType),
                  $element.create('y', simpleType)
                ]));
          });

          it("should ignore prohibited elements declarations", function () {
            var doc = parse(
              '<schema' +
                ' xmlns="http://www.w3.org/2001/XMLSchema"' +
                ' xmlns:y="urn:y">' +
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
            expect(schema).to.eql(
              $schema.create('bar',
                [ $element.create('x', simpleType) ]));
          });

          it("should ignore optional element declarations with incompatible type", function () {
            var doc = parse(
              '<schema' +
                ' xmlns="http://www.w3.org/2001/XMLSchema"' +
                ' xmlns:y="urn:y">' +
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
            expect(schema).to.eql(
              $schema.create('bar',
                [ $element.create('y', simpleType) ]));
          });

        });

      });

    });

  });

});
