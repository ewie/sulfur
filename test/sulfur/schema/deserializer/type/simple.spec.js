/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global afterEach, beforeEach, context, describe, it */

define([
  'shared',
  'sulfur/schema/facet',
  'sulfur/schema/facet/enumeration',
  'sulfur/schema/facets',
  'sulfur/schema/deserializer/type',
  'sulfur/schema/deserializer/type/simple',
  'sulfur/schema/qname',
  'sulfur/schema/type/simple/primitive',
  'sulfur/schema/type/simple/derived',
  'sulfur/schema/type/simple/list',
  'sulfur/schema/type/simple/restricted',
  'sulfur/util/xpath'
], function (
    shared,
    Facet,
    EnumerationFacet,
    Facets,
    TypeDeserializer,
    SimpleTypeDeserializer,
    QName,
    PrimitiveType,
    DerivedType,
    ListType,
    RestrictedType,
    XPath
) {

  'use strict';

  var expect = shared.expect;
  var bind = shared.bind;
  var sinon = shared.sinon;
  var returns = shared.returns;

  describe('sulfur/schema/deserializer/type/simple', function () {

    function parse(s) {
      var p = new DOMParser();
      return p.parseFromString(s, 'text/xml');
    }

    function mockFacet(qname) {
      var facet = Facet.clone({
        getQName: returns(qname),
        getMutualExclusiveFacets: returns([]),
        isShadowingLowerRestrictions: returns(true)
      });
      facet.augment({
        isRestrictionOf: returns(true)
      });
      return facet;
    }

    describe('#initialize()', function () {

      it("should accept types derived from sulfur/schema/type/simple/primitive", function () {
        var facet = mockFacet(QName.create('foo', 'urn:bar'));
        var type = PrimitiveType.create(
          { qname: QName.create('x', 'urn:y'),
            facets: Facets.create(
              [ facet ])
          });
        var facetDeserializer = { getFacet: returns(facet) };
        expect(bind(SimpleTypeDeserializer, 'create', [ type ], [ facetDeserializer ]))
          .to.not.throw();
      });

      it("should accept types derived from sulfur/schema/type/simple/derived", function () {
        var facet = mockFacet(QName.create('foo', 'urn:bar'));
        var base = PrimitiveType.create(
          { qname: QName.create('x', 'urn:y'),
            facets: Facets.create([ facet ])
          });
        var type = DerivedType.create(
          { base: base,
            qname: QName.create('z', 'urn:y'),
            facets: Facets.create([ facet.create() ])
          });
        var facetDeserializer = { getFacet: returns(facet) };
        expect(bind(SimpleTypeDeserializer, 'create', [ type ], [ facetDeserializer ]))
          .to.not.throw();
      });

      it("should reject an empty array of types", function () {
        expect(bind(SimpleTypeDeserializer, 'create', []))
          .to.throw("expecting an array of one or more types");
      });

      it("should reject types which are not a sulfur/schema/type/simple/{derived,primitive}", function () {
        var facetDeserializer = {
          getFacet: returns(
            { getQName: returns(QName.create('foo', 'urn:bar')) })
        };
        expect(bind(SimpleTypeDeserializer, 'create', [{}], [ facetDeserializer ]))
          .to.throw("expecting only sulfur/schema/type/simple/{derived,primitive} types");
      });

      it("should reject types with duplicate qualified name", function () {
        var facet = {
          getQName: returns(QName.create('foo', 'urn:bar'))
        };
        var types = [
          PrimitiveType.create(
            { qname: QName.create('foo', 'urn:bar'),
              facets: Facets.create([ facet ])
           }),
          PrimitiveType.create(
            { qname: QName.create('foo', 'urn:bar'),
              facets: Facets.create([ facet ])
            })
        ];
        var facetDeserializer = { getFacet: returns(facet) };
        expect(bind(SimpleTypeDeserializer, 'create', types, [ facetDeserializer ]))
          .to.throw("type with duplicate qualified name {urn:bar}foo");
      });

      it("should reject an empty array of facet deserializers", function () {
        var types = [
          PrimitiveType.create(
            { qname: QName.create('foo', 'urn:bar') })
        ];
        expect(bind(SimpleTypeDeserializer, 'create', types, []))
          .to.throw("expecting an array of one or more facet deserializers");
      });

      it("should reject facet deserializers with duplicate facets", function () {
        var types = [
          PrimitiveType.create(
            { qname: QName.create('foo', 'urn:bar') })
        ];
        var facet = {
          getQName: returns(QName.create('foo', 'urn:bar'))
        };
        var facetDeserializers = [
          { getFacet: returns(facet) },
          { getFacet: returns(facet) }
        ];
        expect(bind(SimpleTypeDeserializer, 'create', types, facetDeserializers))
          .to.throw("facet deserializer with duplicate facet {urn:bar}foo");
      });

      it("should reject missing facet deserializers", function () {
        var allowedFacet = {
          getQName: returns(QName.create('x', 'urn:y'))
        };
        var types = [
          PrimitiveType.create(
            { qname: QName.create('foo', 'urn:bar'),
              facets: Facets.create([ allowedFacet ])
            })
        ];
        var someFacet = {
          getQName: returns(QName.create('x', 'urn:z'))
        };
        var facetDeserializers = [
          { getFacet: returns(someFacet) }
        ];
        expect(bind(SimpleTypeDeserializer, 'create', types, facetDeserializers))
          .to.throw("expecting a facet deserializer for facet {urn:y}x");
      });

    });

    describe('#resolveQualifiedName()', function () {

      var type;
      var simpleTypeDeserializer;

      beforeEach(function () {
        var facet = {
          getQName: returns(QName.create('foo', 'urn:bar'))
        };
        type = PrimitiveType.create(
          { qname: QName.create('x', 'urn:y'),
            facets: Facets.create([ facet ])
          });
        var facetDeserializer = { getFacet: returns(facet) };
        simpleTypeDeserializer = SimpleTypeDeserializer.create([ type ], [ facetDeserializer ]);
      });

      it("should return the type matching the name and namespace", function () {
        var t = simpleTypeDeserializer.resolveQualifiedName(QName.create('x', 'urn:y'));
        expect(t).to.equal(type);
      });

      it("should return undefined when no type with the given name is defined", function () {
        expect(simpleTypeDeserializer.resolveQualifiedName(QName.create('z', 'urn:y'))).to.be.undefined;
      });

      it("should return undefined when no type with the given namespace is defined", function () {
        expect(simpleTypeDeserializer.resolveQualifiedName(QName.create('x', 'urn:z'))).to.be.undefined;
      });

    });

    describe('#deserializeElement()', function () {

      var type;
      var simpleTypeDeserializer;
      var typeDeserializers;
      var valueType;
      var allowedFacets;
      var facetDeserializers;

      beforeEach(function () {
        var parseFn = function (s) { return '{' + s + '}'; };
        valueType = {
          parse: parseFn
        };
        allowedFacets = Facets.create(
          [ mockFacet(QName.create('foo', 'http://www.w3.org/2001/XMLSchema')),
            mockFacet(QName.create('bar', 'http://www.w3.org/2001/XMLSchema')),
            mockFacet(QName.create('abc', 'urn:bar')),
            mockFacet(QName.create('def', 'urn:foo'))
          ]);
        type = PrimitiveType.create(
          { qname: QName.create('x', 'urn:y'),
            valueType: valueType,
            facets: allowedFacets
          });

        function createFacetDeserializer(facet) {
          return {
            getFacet: returns(facet),
            parseValue: parseFn,
            createFacet: function (values) {
              return facet.create(values);
            }
          };
        }

        facetDeserializers = [
          createFacetDeserializer(allowedFacets.getFacet(QName.create('foo', 'http://www.w3.org/2001/XMLSchema'))),
          createFacetDeserializer(allowedFacets.getFacet(QName.create('bar', 'http://www.w3.org/2001/XMLSchema'))),
          createFacetDeserializer(allowedFacets.getFacet(QName.create('abc', 'urn:bar'))),
          createFacetDeserializer(allowedFacets.getFacet(QName.create('def', 'urn:foo')))
        ];
        simpleTypeDeserializer = SimpleTypeDeserializer.create([ type ], facetDeserializers);
        typeDeserializers = [ simpleTypeDeserializer ];
      });

      it("should return undefined when the element's local name is not 'simpleType", function () {
        var element = { localName: 'notASimpleType' };
        expect(simpleTypeDeserializer.deserializeElement(element)).to.be.undefined;
      });

      it("should return undefined when the element's namespace is not 'http://www.w3.org/2001/XMLSchema'", function () {
        var element = { localName: 'simpleType', namespaceURI: 'urn:void' };
        expect(simpleTypeDeserializer.deserializeElement(element)).to.be.undefined;
      });

      context("with element xs:simpleType", function () {

        it("should return undefined when it does not have child xs:list nor xs:restriction", function () {
          var doc = parse('<simpleType xmlns="http://www.w3.org/2001/XMLSchema"/>');
          var element = doc.documentElement;
          var xpath = XPath.create(doc);
          var typeDeserializer = TypeDeserializer.create();
          expect(simpleTypeDeserializer.deserializeElement(element, typeDeserializer, xpath)).to.be.undefined;
        });

        context("with child xs:restriction", function () {

          var sandbox;

          beforeEach(function () {
            sandbox = sinon.sandbox.create();
          });

          afterEach(function () {
            sandbox.restore();
          });

          context("with child xs:simpleType", function () {

            it("should recursively deserialize child xs:simpleType", function () {
              var doc = parse(
                '<xs:schema' +
                  ' xmlns:xs="http://www.w3.org/2001/XMLSchema"' +
                  ' xmlns:y="urn:y">' +
                 '<xs:simpleType>' +
                  '<xs:restriction>' +
                   '<xs:simpleType>' +
                    '<xs:restriction base="y:x"/>' +
                   '</xs:simpleType>' +
                  '</xs:restriction>' +
                 '</xs:simpleType>' +
                '</xs:schema>');
              var root = doc.documentElement;
              var xpath = XPath.create(doc);
              var typeDeserializer = TypeDeserializer.create(typeDeserializers);

              var t = simpleTypeDeserializer.deserializeElement(
                root.firstChild, typeDeserializer, xpath);

              expect(t).to.eql(type);
            });

          });

          context("with attribute @base", function () {

            it("should use the global type declaration if resolvable", function () {
              var doc = parse(
                '<xs:schema' +
                  ' xmlns:xs="http://www.w3.org/2001/XMLSchema"' +
                  ' xmlns:y="urn:y">' +
                 '<xs:simpleType>' +
                  '<xs:restriction base="foo"/>' +
                 '</xs:simpleType>' +
                 '<xs:simpleType name="foo">' +
                  '<xs:restriction base="y:x"/>' +
                 '</xs:simpleType>' +
                '</xs:schema>');
              var root = doc.documentElement;
              var xpath = XPath.create(doc);
              var typeDeserializer = TypeDeserializer.create(typeDeserializers);

              var t = simpleTypeDeserializer.deserializeElement(
                root.firstChild, typeDeserializer, xpath);

              expect(t).to.eql(type);
            });

            it("should deserialize the qualified name when there's no global type declaration", function () {
              var doc = parse(
                '<xs:simpleType' +
                  ' xmlns:xs="http://www.w3.org/2001/XMLSchema"' +
                  ' xmlns:y="urn:y">' +
                 '<xs:restriction base="y:x"/>' +
                '</xs:simpleType>');
              var xpath = XPath.create(doc);
              var typeDeserializer = TypeDeserializer.create(typeDeserializers);

              var t = simpleTypeDeserializer.deserializeElement(
                doc.documentElement, typeDeserializer, xpath);

              expect(t).to.eql(type);
            });

            it("should reject the type when the qualified name cannot be resolved", function () {
              var doc = parse(
                '<xs:simpleType' +
                  ' xmlns:xs="http://www.w3.org/2001/XMLSchema"' +
                  ' xmlns:y="urn:y">' +
                 '<xs:restriction base="y:z"/>' +
                '</xs:simpleType>');
              var xpath = XPath.create(doc, {
                xs: 'http://www.w3.org/2001/XMLSchema'
              });
              var typeDeserializer = TypeDeserializer.create(typeDeserializers);

              expect(bind(simpleTypeDeserializer, 'deserializeElement',
                  doc.documentElement, typeDeserializer, xpath))
                .to.throw("cannot resolve type {urn:y}z");
            });

          });

          context("with facets", function () {

            var parseSpies;
            var createSpies;

            beforeEach(function () {
              parseSpies = facetDeserializers.map(function (facetDeserializer) {
                return sinon.spy(facetDeserializer, 'parseValue');
              });
              createSpies = facetDeserializers.map(function (facetDeserializer) {
                return sinon.spy(facetDeserializer, 'createFacet');
              });
            });

            it("should handle standard facets (namespace 'http://www.w3.org/2001/XMLSchema')", function () {
              var doc = parse(
                '<xs:simpleType' +
                  ' xmlns:xs="http://www.w3.org/2001/XMLSchema"' +
                  ' xmlns:y="urn:y">' +
                 '<xs:restriction base="y:x">' +
                  '<xs:foo value="x"/>' +
                  '<xs:bar value="y"/>' +
                  '<xs:foo value="z"/>' +
                 '</xs:restriction>' +
                '</xs:simpleType>');

              var element = doc.documentElement;
              var xpath = XPath.create(doc);
              var typeDeserializer = TypeDeserializer.create(typeDeserializers);

              var t = simpleTypeDeserializer.deserializeElement(
                element, typeDeserializer, xpath);

              expect(parseSpies[0].getCall(0).args[0])
                .to.equal('x');
              expect(parseSpies[0].getCall(0).args[1])
                .to.equal(valueType);
              expect(parseSpies[1])
                .to.be.calledWith('y', sinon.match.same(valueType));
              expect(parseSpies[0].getCall(1).args[0])
                .to.equal('z');
              expect(parseSpies[0].getCall(1).args[1])
                .to.equal(valueType);

              expect(createSpies[0])
                .to.be.calledWith([
                  parseSpies[0].getCall(0).returnValue,
                  parseSpies[0].getCall(1).returnValue
                ]);

              expect(createSpies[1])
                .to.be.calledWith([
                  parseSpies[1].getCall(0).returnValue
                ]);

              expect(t).to.eql(
                RestrictedType.create(
                  type, Facets.create(
                    [ createSpies[0].getCall(0).returnValue,
                      createSpies[1].getCall(0).returnValue
                    ])));
            });

            it("should handle non-standard facets under xs:annotation/xs:appinfo defined by the resolved type", function () {
              var doc = parse(
                '<xs:simpleType' +
                  ' xmlns:xs="http://www.w3.org/2001/XMLSchema"' +
                  ' xmlns:y="urn:y"' +
                  ' xmlns:foo="urn:foo"' +
                  ' xmlns:bar="urn:bar">' +
                 '<xs:restriction base="y:x">' +
                  '<xs:annotation>' +
                   '<xs:appinfo>' +
                    '<bar:abc value="1"/>' +
                    '<foo:def value="2"/>' +
                    '<bar:abc value="3"/>' +
                   '</xs:appinfo>' +
                  '</xs:annotation>' +
                 '</xs:restriction>' +
                '</xs:simpleType>');

              var element = doc.documentElement;
              var xpath = XPath.create(doc);
              var typeDeserializer = TypeDeserializer.create(typeDeserializers);

              var t = simpleTypeDeserializer.deserializeElement(
                element, typeDeserializer, xpath);

              expect(parseSpies[2].getCall(0).args[0])
                .to.equal('1');
              expect(parseSpies[2].getCall(0).args[1])
                .to.equal(valueType);
              expect(parseSpies[3])
                .to.be.calledWith('2', sinon.match.same(valueType));
              expect(parseSpies[2].getCall(1).args[0])
                .to.equal('3');
              expect(parseSpies[2].getCall(1).args[1])
                .to.equal(valueType);

              expect(createSpies[2])
                .to.be.calledWith([
                  parseSpies[2].getCall(0).returnValue,
                  parseSpies[2].getCall(1).returnValue
                ]);

              expect(createSpies[3])
                .to.be.calledWith([
                  parseSpies[3].getCall(0).returnValue
                ]);

              expect(t).to.eql(
                RestrictedType.create(
                  type, Facets.create(
                    [ createSpies[2].getCall(0).returnValue,
                      createSpies[3].getCall(0).returnValue
                    ])));
            });

          });

        });

        context("with child xs:list", function () {

          it("should deserialize child xs:simpleType when declared", function () {
            var doc = parse(
              '<xs:schema' +
                ' xmlns:xs="http://www.w3.org/2001/XMLSchema"' +
                ' xmlns:y="urn:y">' +
               '<xs:simpleType>' +
                '<xs:list>' +
                 '<xs:simpleType>' +
                  '<xs:restriction base="y:x"/>' +
                 '</xs:simpleType>' +
                '</xs:list>' +
               '</xs:simpleType>' +
              '</xs:schema>');
            var element = doc.documentElement.firstChild;
            var xpath = XPath.create(doc);
            var typeDeserializer = TypeDeserializer.create(typeDeserializers);

            var t = simpleTypeDeserializer.deserializeElement(
              element, typeDeserializer, xpath);

            expect(ListType.prototype).to.be.prototypeOf(t);
            expect(t.getItemType()).to.equal(type);
          });

          context("with attribute @itemType", function () {

            it("should use the global simple type declaration if resolvable", function () {
              var doc = parse(
                '<xs:schema' +
                  ' xmlns:xs="http://www.w3.org/2001/XMLSchema"' +
                  ' xmlns:y="urn:y">' +
                 '<xs:simpleType>' +
                  '<xs:list itemType="foo"/>' +
                 '</xs:simpleType>' +
                 '<xs:simpleType name="foo">' +
                  '<xs:restriction base="y:x"/>' +
                 '</xs:simpleType>' +
                '</xs:schema>');
              var element = doc.documentElement.firstChild;
              var xpath = XPath.create(doc);
              var typeDeserializer = TypeDeserializer.create(typeDeserializers);

              var t = simpleTypeDeserializer.deserializeElement(
                element, typeDeserializer, xpath);

              expect(ListType.prototype).to.be.prototypeOf(t);
              expect(t.getItemType()).to.equal(type);
            });

            it("should deserialize the qualified name when there's no global type declaration", function () {
              var doc = parse(
                '<xs:simpleType' +
                  ' xmlns:xs="http://www.w3.org/2001/XMLSchema"' +
                  ' xmlns:y="urn:y">' +
                 '<xs:list itemType="y:x"/>' +
                '</xs:simpleType>');
              var element = doc.documentElement;
              var xpath = XPath.create(doc);
              var typeDeserializer = TypeDeserializer.create(typeDeserializers);

              var t = simpleTypeDeserializer.deserializeElement(
                element, typeDeserializer, xpath);

              expect(ListType.prototype).to.be.prototypeOf(t);
              expect(t.getItemType()).to.equal(type);
            });

            it("should reject the type when the qualified name cannot be resolved", function () {
              var doc = parse(
                '<xs:simpleType' +
                  ' xmlns:xs="http://www.w3.org/2001/XMLSchema"' +
                  ' xmlns:y="urn:y">' +
                 '<xs:list itemType="y:z"/>' +
                '</xs:simpleType>');
              var xpath = XPath.create(doc);
              var typeDeserializer = TypeDeserializer.create(typeDeserializers);

              expect(bind(simpleTypeDeserializer, 'deserializeElement',
                  doc.documentElement, typeDeserializer, xpath))
                .to.throw("cannot resolve type {urn:y}z");
            });

          });

        });

      });

    });

  });

});
