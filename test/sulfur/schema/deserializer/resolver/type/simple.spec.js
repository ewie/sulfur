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
  'sulfur/schema/deserializer/resolver',
  'sulfur/schema/deserializer/resolver/type/simple',
  'sulfur/schema/qname',
  'sulfur/schema/type/simple/primitive',
  'sulfur/schema/type/simple/derived',
  'sulfur/schema/type/simple/list',
  'sulfur/schema/type/simple/restricted',
  'sulfur/util/xpath'
], function (
    $shared,
    $facet,
    $enumerationFacet,
    $facets,
    $resolver,
    $simpleTypeResolver,
    $qname,
    $primitiveType,
    $derivedType,
    $listType,
    $restrictedType,
    $xpath
) {

  'use strict';

  var expect = $shared.expect;
  var bind = $shared.bind;
  var sinon = $shared.sinon;
  var returns = $shared.returns;

  describe('sulfur/schema/deserializer/resolver/type/simple', function () {

    function parse(s) {
      var p = new DOMParser();
      return p.parseFromString(s, 'text/xml');
    }

    function mockFacet(qname) {
      var facet = $facet.clone({
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
        var facet = mockFacet($qname.create('foo', 'urn:bar'));
        var type = $primitiveType.create(
          { qname: $qname.create('x', 'urn:y'),
            facets: $facets.create(
              [ facet ])
          });
        var facetResolver = { getFacet: returns(facet) };
        expect(bind($simpleTypeResolver, 'create', [ type ], [ facetResolver ]))
          .to.not.throw();
      });

      it("should accept types derived from sulfur/schema/type/simple/derived", function () {
        var facet = mockFacet($qname.create('foo', 'urn:bar'));
        var base = $primitiveType.create(
          { qname: $qname.create('x', 'urn:y'),
            facets: $facets.create([ facet ])
          });
        var type = $derivedType.create(
          { base: base,
            qname: $qname.create('z', 'urn:y'),
            facets: $facets.create([ facet.create() ])
          });
        var facetResolver = { getFacet: returns(facet) };
        expect(bind($simpleTypeResolver, 'create', [ type ], [ facetResolver ]))
          .to.not.throw();
      });

      it("should reject an empty array of types", function () {
        expect(bind($simpleTypeResolver, 'create', []))
          .to.throw("expecting an array of one or more types");
      });

      it("should reject types which are not a sulfur/schema/type/simple/{primitive,derived}", function () {
        var facetResolver = {
          getFacet: returns(
            { getQName: returns($qname.create('foo', 'urn:bar')) })
        };
        expect(bind($simpleTypeResolver, 'create', [{}], [ facetResolver ]))
          .to.throw("expecting only sulfur/schema/type/simple/{primitive,derived} types");
      });

      it("should reject types with duplicate qualified name", function () {
        var facet = {
          getQName: returns($qname.create('foo', 'urn:bar'))
        };
        var types = [
          $primitiveType.create(
            { qname: $qname.create('foo', 'urn:bar'),
              facets: $facets.create([ facet ])
           }),
          $primitiveType.create(
            { qname: $qname.create('foo', 'urn:bar'),
              facets: $facets.create([ facet ])
            })
        ];
        var facetResolver = { getFacet: returns(facet) };
        expect(bind($simpleTypeResolver, 'create', types, [ facetResolver ]))
          .to.throw("type with duplicate qualified name {urn:bar}foo");
      });

      it("should reject an empty array of facet resolvers", function () {
        var types = [
          $primitiveType.create(
            { qname: $qname.create('foo', 'urn:bar') })
        ];
        expect(bind($simpleTypeResolver, 'create', types, []))
          .to.throw("expecting an array of one or more facet resolvers");
      });

      it("should reject facet resolvers with duplicate facets", function () {
        var types = [
          $primitiveType.create(
            { qname: $qname.create('foo', 'urn:bar') })
        ];
        var facet = {
          getQName: returns($qname.create('foo', 'urn:bar'))
        };
        var facetResolvers = [
          { getFacet: returns(facet) },
          { getFacet: returns(facet) }
        ];
        expect(bind($simpleTypeResolver, 'create', types, facetResolvers))
          .to.throw("facet resolver with duplicate facet {urn:bar}foo");
      });

      it("should reject missing facet resolvers", function () {
        var allowedFacet = {
          getQName: returns($qname.create('x', 'urn:y'))
        };
        var types = [
          $primitiveType.create(
            { qname: $qname.create('foo', 'urn:bar'),
              facets: $facets.create([ allowedFacet ])
            })
        ];
        var someFacet = {
          getQName: returns($qname.create('x', 'urn:z'))
        };
        var facetResolvers = [
          { getFacet: returns(someFacet) }
        ];
        expect(bind($simpleTypeResolver, 'create', types, facetResolvers))
          .to.throw("expecting a facet resolver for facet {urn:y}x");
      });

    });

    describe('#resolveQualifiedName()', function () {

      var type;
      var typeResolver;

      beforeEach(function () {
        var facet = {
          getQName: returns($qname.create('foo', 'urn:bar'))
        };
        type = $primitiveType.create(
          { qname: $qname.create('x', 'urn:y'),
            facets: $facets.create([ facet ])
          });
        var facetResolver = { getFacet: returns(facet) };
        typeResolver = $simpleTypeResolver.create([ type ], [ facetResolver ]);
      });

      it("should return the type matching the name and namespace", function () {
        var t = typeResolver.resolveQualifiedName($qname.create('x', 'urn:y'));
        expect(t).to.equal(type);
      });

      it("should return undefined when no type with the given name is defined", function () {
        expect(typeResolver.resolveQualifiedName($qname.create('z', 'urn:y'))).to.be.undefined;
      });

      it("should return undefined when no type with the given namespace is defined", function () {
        expect(typeResolver.resolveQualifiedName($qname.create('x', 'urn:z'))).to.be.undefined;
      });

    });

    describe('#resolveElement()', function () {

      var type;
      var typeResolver;
      var typeResolvers;
      var valueType;
      var allowedFacets;
      var facetResolvers;

      beforeEach(function () {
        var parseFn = function (s) { return '{' + s + '}'; };
        valueType = {
          parse: parseFn
        };
        allowedFacets = $facets.create(
          [ mockFacet($qname.create('foo', 'http://www.w3.org/2001/XMLSchema')),
            mockFacet($qname.create('bar', 'http://www.w3.org/2001/XMLSchema')),
            mockFacet($qname.create('abc', 'urn:bar')),
            mockFacet($qname.create('def', 'urn:foo'))
          ]);
        type = $primitiveType.create(
          { qname: $qname.create('x', 'urn:y'),
            valueType: valueType,
            facets: allowedFacets
          });

        function createFacetResolver(facet) {
          return {
            getFacet: returns(facet),
            parseValue: parseFn,
            createFacet: function (values) {
              return facet.create(values);
            }
          };
        }

        facetResolvers = [
          createFacetResolver(allowedFacets.getFacet($qname.create('foo', 'http://www.w3.org/2001/XMLSchema'))),
          createFacetResolver(allowedFacets.getFacet($qname.create('bar', 'http://www.w3.org/2001/XMLSchema'))),
          createFacetResolver(allowedFacets.getFacet($qname.create('abc', 'urn:bar'))),
          createFacetResolver(allowedFacets.getFacet($qname.create('def', 'urn:foo')))
        ];
        typeResolver = $simpleTypeResolver.create([ type ], facetResolvers);
        typeResolvers = [ typeResolver ];
      });

      it("should return undefined when the element's local name is not 'simpleType", function () {
        var element = { localName: 'notASimpleType' };
        expect(typeResolver.resolveElement(element)).to.be.undefined;
      });

      it("should return undefined when the element's namespace is not 'http://www.w3.org/2001/XMLSchema'", function () {
        var element = { localName: 'simpleType', namespaceURI: 'urn:void' };
        expect(typeResolver.resolveElement(element)).to.be.undefined;
      });

      context("with element xs:simpleType", function () {

        it("should return undefined when it does not have child xs:list nor xs:restriction", function () {
          var doc = parse('<simpleType xmlns="http://www.w3.org/2001/XMLSchema"/>');
          var element = doc.documentElement;
          var xpath = $xpath.create(doc);
          var resolver = $resolver.create(undefined, xpath);
          expect(typeResolver.resolveElement(element, resolver)).to.be.undefined;
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

            it("should recursively resolve child xs:simpleType", function () {
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
              var xpath = $xpath.create(doc);
              var resolver = $resolver.create(typeResolvers, xpath);

              var t = typeResolver.resolveElement(root.firstChild, resolver);

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
              var xpath = $xpath.create(doc);
              var resolver = $resolver.create(typeResolvers, xpath);

              var t = typeResolver.resolveElement(root.firstChild, resolver);

              expect(t).to.eql(type);
            });

            it("should resolve the qualified name when there's no global type declaration", function () {
              var doc = parse(
                '<xs:simpleType' +
                  ' xmlns:xs="http://www.w3.org/2001/XMLSchema"' +
                  ' xmlns:y="urn:y">' +
                 '<xs:restriction base="y:x"/>' +
                '</xs:simpleType>');
              var xpath = $xpath.create(doc);
              var resolver = $resolver.create(typeResolvers, xpath);

              var t = typeResolver.resolveElement(doc.documentElement, resolver);

              expect(t).to.eql(type);
            });

            it("should reject the type when the qualified name cannot be resolved", function () {
              var doc = parse(
                '<xs:simpleType' +
                  ' xmlns:xs="http://www.w3.org/2001/XMLSchema"' +
                  ' xmlns:y="urn:y">' +
                 '<xs:restriction base="y:z"/>' +
                '</xs:simpleType>');
              var xpath = $xpath.create(doc, {
                xs: 'http://www.w3.org/2001/XMLSchema'
              });
              var resolver = $resolver.create(typeResolvers, xpath);

              expect(bind(typeResolver, 'resolveElement', doc.documentElement, resolver))
                .to.throw("cannot resolve type {urn:y}z");
            });

          });

          context("with facets", function () {

            var parseSpies;
            var createSpies;

            beforeEach(function () {
              parseSpies = facetResolvers.map(function (facetResolver) {
                return sinon.spy(facetResolver, 'parseValue');
              });
              createSpies = facetResolvers.map(function (facetResolver) {
                return sinon.spy(facetResolver, 'createFacet');
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
              var xpath = $xpath.create(doc);
              var resolver = $resolver.create(typeResolvers, xpath);

              var t = typeResolver.resolveElement(element, resolver);

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
                $restrictedType.create(
                  type, $facets.create(
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
              var xpath = $xpath.create(doc);
              var resolver = $resolver.create(typeResolvers, xpath);

              var t = typeResolver.resolveElement(element, resolver);

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
                $restrictedType.create(
                  type, $facets.create(
                    [ createSpies[2].getCall(0).returnValue,
                      createSpies[3].getCall(0).returnValue
                    ])));
            });

          });

        });

        context("with child xs:list", function () {

          it("should resolve child xs:simpleType when declared", function () {
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
            var xpath = $xpath.create(doc);
            var resolver = $resolver.create(typeResolvers, xpath);

            var t = typeResolver.resolveElement(element, resolver);

            expect($listType.prototype).to.be.prototypeOf(t);
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
              var xpath = $xpath.create(doc);
              var resolver = $resolver.create(typeResolvers, xpath);

              var t = typeResolver.resolveElement(element, resolver);

              expect($listType.prototype).to.be.prototypeOf(t);
              expect(t.getItemType()).to.equal(type);
            });

            it("should resolve the qualified name when there's no global type declaration", function () {
              var doc = parse(
                '<xs:simpleType' +
                  ' xmlns:xs="http://www.w3.org/2001/XMLSchema"' +
                  ' xmlns:y="urn:y">' +
                 '<xs:list itemType="y:x"/>' +
                '</xs:simpleType>');
              var element = doc.documentElement;
              var xpath = $xpath.create(doc);
              var resolver = $resolver.create(typeResolvers, xpath);

              var t = typeResolver.resolveElement(element, resolver);

              expect($listType.prototype).to.be.prototypeOf(t);
              expect(t.getItemType()).to.equal(type);
            });

            it("should reject the type when the qualified name cannot be resolved", function () {
              var doc = parse(
                '<xs:simpleType' +
                  ' xmlns:xs="http://www.w3.org/2001/XMLSchema"' +
                  ' xmlns:y="urn:y">' +
                 '<xs:list itemType="y:z"/>' +
                '</xs:simpleType>');
              var xpath = $xpath.create(doc);
              var resolver = $resolver.create(typeResolvers, xpath);

              expect(bind(typeResolver, 'resolveElement', doc.documentElement, resolver))
                .to.throw("cannot resolve type {urn:y}z");
            });

          });

        });

      });

    });

  });

});
