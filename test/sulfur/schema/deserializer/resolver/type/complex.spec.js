/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global beforeEach, context, describe, it */

define([
  'shared',
  'sulfur/schema/element',
  'sulfur/schema/elements',
  'sulfur/schema/facet/minInclusive',
  'sulfur/schema/facets',
  'sulfur/schema/deserializer/resolver',
  'sulfur/schema/deserializer/resolver/type/complex',
  'sulfur/schema/deserializer/resolver/type/simple',
  'sulfur/schema/qname',
  'sulfur/schema/type/complex/primitive',
  'sulfur/schema/type/complex/list',
  'sulfur/schema/type/complex/restricted',
  'sulfur/schema/type/simple/primitive',
  'sulfur/schema/type/simple/list',
  'sulfur/schema/type/simple/restricted',
  'sulfur/schema/value/simple/double',
  'sulfur/util/xpath'
], function (
    $shared,
    $element,
    $elements,
    $minInclusiveFacet,
    $facets,
    $typeResolver,
    $complexPrimitiveTypeResolver,
    $simpleTypeResolver,
    $qname,
    $complexPrimitiveType,
    $complexListType,
    $complexRestrictedType,
    $simplePrimitiveType,
    $listType,
    $simpleRestrictedType,
    $doubleValue,
    $xpath
) {

  'use strict';

  var expect = $shared.expect;
  var bind = $shared.bind;
  var returns = $shared.returns;

  describe('sulfur/schema/deserializer/resolver/type/complex', function () {

    function parse(s) {
      var p = new DOMParser();
      return p.parseFromString(s, 'text/xml');
    }

    describe('#initialize()', function () {

      it("should reject an empty array", function () {
        expect(bind($complexPrimitiveTypeResolver, 'create', []))
          .to.throw("expecting an array of one or more types");
      });

      it("should reject types which are not a sulfur/schema/type/complex", function () {
        expect(bind($complexPrimitiveTypeResolver, 'create', [{}]))
          .to.throw("expecting only sulfur/schema/type/complex types");
      });

      it("should reject types with duplicate qualified name", function () {
        var types = [
          $complexPrimitiveType.create({ qname: $qname.create('foo', 'urn:bar') }),
          $complexPrimitiveType.create({ qname: $qname.create('foo', 'urn:bar') })
        ];
        expect(bind($complexPrimitiveTypeResolver, 'create', types))
          .to.throw("type with duplicate qualified name {urn:bar}foo");
      });

    });

    describe('#resolveQualifiedName()', function () {

      var type;
      var typeResolver;

      beforeEach(function () {
        type = $complexPrimitiveType.create(
          { qname: $qname.create('x', 'urn:y'),
            elements: $elements.create([ $element.create('foo') ])
          });
        typeResolver = $complexPrimitiveTypeResolver.create([ type ]);
      });

      it("should return an instance of the type matching the name and namespace", function () {
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

      var typeResolver;
      var typeResolvers;
      var complexType;
      var complexType3;
      var simpleType;

      beforeEach(function () {
        simpleType = $simplePrimitiveType.create(
          { qname: $qname.create('simpleType', 'urn:y'),
            facets: $facets.create([ $minInclusiveFacet ])
          });
        var simpleType2 = $simplePrimitiveType.create(
          { qname: $qname.create('simpleType2', 'urn:y'),
            valueType: $doubleValue,
            facets: $facets.create([ $minInclusiveFacet ])
          });
        var otherType = $simplePrimitiveType.create(
          { qname: $qname.create('otherType', 'urn:y'),
            facets: $facets.create([ $minInclusiveFacet ])
          });
        complexType = $complexPrimitiveType.create(
          { qname: $qname.create('complexType', 'urn:y'),
            elements: $elements.create(
              [ $element.create('foo', simpleType) ])
          });
        var complexType2 = $complexPrimitiveType.create(
          { qname: $qname.create('complexType2', 'urn:y'),
            elements: $elements.create(
              [ $element.create('foo',
                  $simpleRestrictedType.create(simpleType2,
                    $facets.create(
                      [ $minInclusiveFacet.create($doubleValue.create(1)) ])))
              ])
          });
        complexType3 = $complexPrimitiveType.create(
          { qname: $qname.create('complexType3', 'urn:y'),
            elements: $elements.create(
              [ $element.create('foo', simpleType),
                $element.create('bar', simpleType),
                $element.create('baz', simpleType)
              ])
          });
        var complexType4 = $complexPrimitiveType.create(
          { qname: $qname.create('complexType4', 'urn:y'),
            elements: $elements.create(
              [ $element.create('foo', simpleType),
                $element.create('bar', simpleType)
              ])
          });
        typeResolver = $complexPrimitiveTypeResolver.create(
          [ complexType, complexType2, complexType3, complexType4 ]);
        var facetResolver = {
          getFacet: returns($minInclusiveFacet),
          parseValue: function (s) { return parseInt(s, 10); },
          createFacet: function (values) {
            return $minInclusiveFacet.create($doubleValue.create(values[0]));
          }
        };
        var simpleResolver = $simpleTypeResolver.create(
          [ simpleType, otherType, simpleType2 ], [ facetResolver ]);
        typeResolvers = [ typeResolver, simpleResolver ];
      });

      it("should return undefined when the element's local name is not 'complexType", function () {
        var element = { localName: 'notAComplexType' };
        expect(typeResolver.resolveElement(element)).to.be.undefined;
      });

      it("should return undefined when the element's namespace is not 'http://www.w3.org/2001/XMLSchema'", function () {
        var element = { localName: 'complexType', namespaceURI: 'urn:void' };
        expect(typeResolver.resolveElement(element)).to.be.undefined;
      });

      context("with element xs:complexType", function () {

        it("should return undefined when it does not have child xs:all", function () {
          var doc = parse('<complexType xmlns="http://www.w3.org/2001/XMLSchema"/>');
          var element = doc.documentElement;
          var xpath = $xpath.create(doc);
          var resolver = $typeResolver.create(undefined, xpath);
          expect(typeResolver.resolveElement(element, resolver)).to.be.undefined;
        });

        context("with child xs:all", function () {

          it("should reject elements requiring more than one occurrences", function () {
            var doc = parse(
              '<complexType xmlns="http://www.w3.org/2001/XMLSchema">' +
               '<all>' +
                '<element minOccurs="2"/>' +
               '</all>' +
              '</complexType>');
            var element = doc.documentElement;
            var xpath = $xpath.create(doc);
            var resolver = $typeResolver.create(undefined, xpath);
            expect(bind(typeResolver, 'resolveElement', element, resolver))
              .to.throw("incompatible complex type due to an element requiring more than one occurrence");
          });

          context("when a compatible type exists", function () {

            it("should return that type", function () {
              var doc = parse(
                '<complexType' +
                  ' xmlns="http://www.w3.org/2001/XMLSchema"' +
                  ' xmlns:y="urn:y">' +
                 '<all>' +
                  '<element name="foo" type="y:simpleType"/>' +
                 '</all>' +
                '</complexType>');
              var element = doc.documentElement;
              var xpath = $xpath.create(doc);
              var resolver = $typeResolver.create(typeResolvers, xpath);
              var type = typeResolver.resolveElement(element, resolver);
              expect(type).to.eql(
                $complexRestrictedType.create(complexType,
                  $elements.create(
                    [ $element.create('foo', simpleType) ])));
            });

            it("should return the type that could be satisfied with the most optional elements", function () {
              var doc = parse(
                '<complexType' +
                  ' xmlns="http://www.w3.org/2001/XMLSchema"' +
                  ' xmlns:y="urn:y">' +
                 '<all>' +
                  '<element name="foo" type="y:simpleType"/>' +
                  '<element name="bar" type="y:simpleType" minOccurs="0"/>' +
                  '<element name="baz" type="y:simpleType" minOccurs="0"/>' +
                 '</all>' +
                '</complexType>');
              var element = doc.documentElement;
              var xpath = $xpath.create(doc);
              var resolver = $typeResolver.create(typeResolvers, xpath);
              var type = typeResolver.resolveElement(element, resolver);
              expect(type).to.eql(
                $complexRestrictedType.create(complexType3,
                  $elements.create(
                    [ $element.create('foo', simpleType),
                      $element.create('bar', simpleType, { optional: true }),
                      $element.create('baz', simpleType, { optional: true })
                    ])));
            });

            it("should ignore prohibited elements", function () {
              var doc = parse(
                '<complexType' +
                  ' xmlns="http://www.w3.org/2001/XMLSchema"' +
                  ' xmlns:y="urn:y">' +
                 '<all>' +
                  '<element name="foo" type="y:simpleType"/>' +
                  '<element name="xxx" type="y:simpleType" minOccurs="0" maxOccurs="0"/>' +
                 '</all>' +
                '</complexType>');
              var element = doc.documentElement;
              var xpath = $xpath.create(doc);
              var resolver = $typeResolver.create(typeResolvers, xpath);
              var type = typeResolver.resolveElement(element, resolver);
              expect(type).to.eql(
                $complexRestrictedType.create(complexType,
                  $elements.create(
                    [ $element.create('foo', simpleType) ])));
            });

          });

          context("when no compatible complex type exists", function () {

            it("should reject", function () {
              var doc = parse(
                '<complexType' +
                  ' xmlns="http://www.w3.org/2001/XMLSchema"' +
                  ' xmlns:y="urn:y">' +
                 '<all>' +
                  '<element name="xxx" type="y:simpleType"/>' +
                 '</all>' +
                '</complexType>');
              var element = doc.documentElement;
              var xpath = $xpath.create(doc);
              var resolver = $typeResolver.create(typeResolvers, xpath);
              expect(bind(typeResolver, 'resolveElement', element, resolver))
                .to.throw("incompatible complex type");
            });

            it("should detect missing elements", function () {
              var doc = parse(
                '<complexType' +
                  ' xmlns="http://www.w3.org/2001/XMLSchema"' +
                  ' xmlns:y="urn:y">' +
                 '<all>' +
                  '<element name="bar" type="y:simpleType"/>' +
                 '</all>' +
                '</complexType>');
              var element = doc.documentElement;
              var xpath = $xpath.create(doc);
              var resolver = $typeResolver.create(typeResolvers, xpath);
              expect(bind(typeResolver, 'resolveElement', element, resolver))
                .to.throw("incompatible complex type");
            });

            it("should detect additional elements", function () {
              var doc = parse(
                '<complexType' +
                  ' xmlns="http://www.w3.org/2001/XMLSchema"' +
                  ' xmlns:y="urn:y">' +
                 '<all>' +
                  '<element name="foo" type="y:simpleType"/>' +
                  '<element name="additional" type="y:simpleType"/>' +
                 '</all>' +
                '</complexType>');
              var element = doc.documentElement;
              var xpath = $xpath.create(doc);
              var resolver = $typeResolver.create(typeResolvers, xpath);
              expect(bind(typeResolver, 'resolveElement', element, resolver))
                .to.throw("incompatible complex type");
            });

            it("should detect mismatching element types based on their prototypes", function () {
              var doc = parse(
                '<complexType' +
                  ' xmlns="http://www.w3.org/2001/XMLSchema"' +
                  ' xmlns:y="urn:y">' +
                 '<all>' +
                  '<element name="foo" type="y:otherType"/>' +
                 '</all>' +
                '</complexType>');
              var element = doc.documentElement;
              var xpath = $xpath.create(doc);
              var resolver = $typeResolver.create(typeResolvers, xpath);
              expect(bind(typeResolver, 'resolveElement', element, resolver))
                .to.throw("incompatible complex type");
            });

            it("should detect element types with insufficient restriction", function () {
              var doc = parse(
                '<complexType' +
                  ' xmlns="http://www.w3.org/2001/XMLSchema"' +
                  ' xmlns:y="urn:y">' +
                 '<all>' +
                  '<element name="foo">' +
                   '<simpleType>' +
                    '<restriction base="y:simpleType2">' +
                     '<minInclusive value="-1"/>' +
                    '</restriction>' +
                   '</simpleType>' +
                  '</element>' +
                 '</all>' +
                '</complexType>');
              var element = doc.documentElement;
              var xpath = $xpath.create(doc);
              var resolver = $typeResolver.create(typeResolvers, xpath);
              expect(bind(typeResolver, 'resolveElement', element, resolver))
                .to.throw("incompatible complex type");
            });

          });

          context("with elements of incompatible type", function () {

            it("should ignore when optional", function () {
              var doc = parse(
                '<complexType' +
                  ' xmlns="http://www.w3.org/2001/XMLSchema"' +
                  ' xmlns:y="urn:y">' +
                 '<all>' +
                  '<element name="foo" type="y:simpleType"/>' +
                  '<element name="xxx" type="y:incompatibleType" minOccurs="0"/>' +
                 '</all>' +
                '</complexType>');
              var element = doc.documentElement;
              var xpath = $xpath.create(doc);
              var resolver = $typeResolver.create(typeResolvers, xpath);
              var type = typeResolver.resolveElement(element, resolver);
              expect(type).to.eql(
                $complexRestrictedType.create(complexType,
                  $elements.create(
                    [ $element.create('foo', simpleType) ])));
            });

            it("should reject when mandatory", function () {
              var doc = parse(
                '<complexType' +
                  ' xmlns="http://www.w3.org/2001/XMLSchema"' +
                  ' xmlns:ns="urn:void">' +
                 '<all>' +
                  '<element name="foo" type="ns:incompatibleType"/>' +
                 '</all>' +
                '</complexType>');
              var element = doc.documentElement;
              var xpath = $xpath.create(doc);
              var resolver = $typeResolver.create([ typeResolver ], xpath);
              expect(bind(typeResolver, 'resolveElement', element, resolver))
                .to.throw("incompatible complex type due to mandatory element with incompatible type " +
                  "(cannot resolve type {urn:void}incompatibleType)");
            });

          });

          context("with sibling xs:attribute", function () {

            it("should reject mandatory attributes", function () {
              var doc = parse(
                '<complexType xmlns="http://www.w3.org/2001/XMLSchema">' +
                 '<all/>' +
                 '<attribute use="required"/>' +
                '</complexType>');
              var element = doc.documentElement;
              var xpath = $xpath.create(doc);
              var resolver = $typeResolver.create(undefined, xpath);
              expect(bind(typeResolver, 'resolveElement', element, resolver))
                .to.throw("incompatible complex type due to mandatory attributes");
            });

            it("should ignore optional attributes", function () {
              var doc = parse(
                '<complexType' +
                  ' xmlns="http://www.w3.org/2001/XMLSchema"' +
                  ' xmlns:y="urn:y">' +
                 '<all>' +
                  '<element name="foo" type="y:simpleType"/>' +
                 '</all>' +
                 '<attribute/>' +
                '</complexType>');
              var element = doc.documentElement;
              var xpath = $xpath.create(doc);
              var resolver = $typeResolver.create(typeResolvers, xpath);
              var type = typeResolver.resolveElement(element, resolver);
              expect(type).to.eql(
                $complexRestrictedType.create(complexType,
                  $elements.create(
                    [ $element.create('foo', simpleType) ])));
            });

          });

          context("with sibling xs:attributeGroup", function () {

            it("should reject mandatory attributes", function () {
              var doc = parse(
                '<complexType xmlns="http://www.w3.org/2001/XMLSchema">' +
                 '<all/>' +
                 '<attributeGroup/>' +
                 '<attributeGroup>' +
                  '<attribute use="required"/>' +
                 '</attributeGroup>' +
                '</complexType>');
              var element = doc.documentElement;
              var xpath = $xpath.create(doc);
              var resolver = $typeResolver.create(undefined, xpath);
              expect(bind(typeResolver, 'resolveElement', element, resolver))
                .to.throw("incompatible complex type due to mandatory attributes");
            });

            it("should ignore optional attributes", function () {
              var doc = parse(
                '<complexType' +
                  ' xmlns="http://www.w3.org/2001/XMLSchema"' +
                  ' xmlns:y="urn:y">' +
                 '<all>' +
                  '<element name="foo" type="y:simpleType"/>' +
                 '</all>' +
                 '<attributeGroup>' +
                  '<attribute/>' +
                 '</attributeGroup>' +
                '</complexType>');
              var element = doc.documentElement;
              var xpath = $xpath.create(doc);
              var resolver = $typeResolver.create(typeResolvers, xpath);
              var type = typeResolver.resolveElement(element, resolver);
              expect(type).to.eql(
                $complexRestrictedType.create(complexType,
                  $elements.create(
                    [ $element.create('foo', simpleType) ])));
            });

          });

        });

        context("with child xs:sequence", function () {

          it("should use the value of attribute @minOccurs as required minimum number of entries when defined", function () {
            var doc = parse(
              '<complexType' +
                ' xmlns="http://www.w3.org/2001/XMLSchema"' +
                ' xmlns:y="urn:y">' +
               '<sequence minOccurs="0">' +
                '<element name="bar" type="y:simpleType"/>' +
               '</sequence>' +
              '</complexType>');
            var element = doc.documentElement;
            var xpath = $xpath.create(doc);
            var resolver = $typeResolver.create(typeResolvers, xpath);
            var type = typeResolver.resolveElement(element, resolver);
            expect(type).to.eql(
              $complexListType.create(
                $element.create('bar', simpleType),
                { maxLength: 1, minLength: 0 }));
          });

          it("should use value 1 as required minimum number of entries when attribute @minOccurs is not defined", function () {
            var doc = parse(
              '<complexType' +
                ' xmlns="http://www.w3.org/2001/XMLSchema"' +
                ' xmlns:y="urn:y">' +
               '<sequence>' +
                '<element name="bar" type="y:simpleType"/>' +
               '</sequence>' +
              '</complexType>');
            var element = doc.documentElement;
            var xpath = $xpath.create(doc);
            var resolver = $typeResolver.create(typeResolvers, xpath);
            var type = typeResolver.resolveElement(element, resolver);
            expect(type).to.eql(
              $complexListType.create(
                $element.create('bar', simpleType),
                { maxLength: 1, minLength: 1 }));
          });

          it("should use value 1 as allowed maximum number of entries when attribute @maxOccurs is not defined", function () {
            var doc = parse(
              '<complexType' +
                ' xmlns="http://www.w3.org/2001/XMLSchema"' +
                ' xmlns:y="urn:y">' +
               '<sequence>' +
                '<element name="bar" type="y:simpleType"/>' +
               '</sequence>' +
              '</complexType>');
            var element = doc.documentElement;
            var xpath = $xpath.create(doc);
            var resolver = $typeResolver.create(typeResolvers, xpath);
            var type = typeResolver.resolveElement(element, resolver);
            expect(type).to.eql(
              $complexListType.create(
                $element.create('bar', simpleType),
                { maxLength: 1, minLength: 1 }));
          });

          context("with attribute @maxOccurs", function () {

            it("should use the value as allowed maximum number of items when its a number", function () {
              var doc = parse(
                '<complexType' +
                  ' xmlns="http://www.w3.org/2001/XMLSchema"' +
                  ' xmlns:y="urn:y">' +
                 '<sequence maxOccurs="3">' +
                  '<element name="bar" type="y:simpleType"/>' +
                 '</sequence>' +
                '</complexType>');
              var element = doc.documentElement;
              var xpath = $xpath.create(doc);
              var resolver = $typeResolver.create(typeResolvers, xpath);
              var type = typeResolver.resolveElement(element, resolver);
              expect(type).to.eql(
                $complexListType.create(
                  $element.create('bar', simpleType),
                  { maxLength: 3, minLength: 1 }));
            });

            it("should use no allowed maximum number of items when 'unbounded'", function () {
              var doc = parse(
                '<complexType' +
                  ' xmlns="http://www.w3.org/2001/XMLSchema"' +
                  ' xmlns:y="urn:y">' +
                 '<sequence maxOccurs="unbounded">' +
                  '<element name="bar" type="y:simpleType"/>' +
                 '</sequence>' +
                '</complexType>');
              var element = doc.documentElement;
              var xpath = $xpath.create(doc);
              var resolver = $typeResolver.create(typeResolvers, xpath);
              var type = typeResolver.resolveElement(element, resolver);
              expect(type).to.eql(
                $complexListType.create(
                  $element.create('bar', simpleType),
                  { minLength: 1 }));
            });

          });

          context("with a mandatory element", function () {

            it("should use that element as item", function () {
              var doc = parse(
                '<complexType' +
                  ' xmlns="http://www.w3.org/2001/XMLSchema"' +
                  ' xmlns:y="urn:y">' +
                 '<sequence>' +
                  '<element name="bar" type="y:simpleType"/>' +
                 '</sequence>' +
                '</complexType>');
              var element = doc.documentElement;
              var xpath = $xpath.create(doc);
              var resolver = $typeResolver.create(typeResolvers, xpath);
              var type = typeResolver.resolveElement(element, resolver);
              expect(type).to.eql(
                $complexListType.create(
                  $element.create('bar', simpleType),
                  { maxLength: 1, minLength: 1 }));
            });

            it("should reject multiple mandatory elements", function () {
              var doc = parse(
                '<complexType' +
                  ' xmlns="http://www.w3.org/2001/XMLSchema"' +
                  ' xmlns:y="urn:y">' +
                 '<sequence>' +
                  '<element name="bar" type="y:simpleType"/>' +
                  '<element name="foo" type="y:simpleType"/>' +
                 '</sequence>' +
                '</complexType>');
              var element = doc.documentElement;
              var xpath = $xpath.create(doc);
              var resolver = $typeResolver.create(typeResolvers, xpath);
              expect(bind(typeResolver, 'resolveElement', element, resolver))
                .to.throw("incompatible complex list type due to multiple mandatory elements");
            });

            it("should ignore optional elements", function () {
              var doc = parse(
                '<complexType' +
                  ' xmlns="http://www.w3.org/2001/XMLSchema"' +
                  ' xmlns:y="urn:y">' +
                 '<sequence>' +
                  '<element name="foo" type="y:simpleType" minOccurs="0"/>' +
                  '<element name="baz" type="y:simpleType" minOccurs="0"/>' +
                  '<element name="bar" type="y:simpleType"/>' +
                 '</sequence>' +
                '</complexType>');
              var element = doc.documentElement;
              var xpath = $xpath.create(doc);
              var resolver = $typeResolver.create(typeResolvers, xpath);
              var type = typeResolver.resolveElement(element, resolver);
              expect(type).to.eql(
                $complexListType.create(
                  $element.create('bar', simpleType),
                  { maxLength: 1, minLength: 1 }));
            });

          });

          context("with only optional elements", function () {

            it("should reject multiple optional elements", function () {
              var doc = parse(
                '<complexType' +
                  ' xmlns="http://www.w3.org/2001/XMLSchema"' +
                  ' xmlns:y="urn:y">' +
                 '<sequence>' +
                  '<element name="bar" type="y:simpleType" minOccurs="0"/>' +
                  '<element name="foo" type="y:simpleType" minOccurs="0"/>' +
                 '</sequence>' +
                '</complexType>');
              var element = doc.documentElement;
              var xpath = $xpath.create(doc);
              var resolver = $typeResolver.create(typeResolvers, xpath);
              expect(bind(typeResolver, 'resolveElement', element, resolver))
                .to.throw("incompatible complex list type due to multiple optional elements");
            });

            it("should accept a single optional element as item", function () {
              var doc = parse(
                '<complexType' +
                  ' xmlns="http://www.w3.org/2001/XMLSchema"' +
                  ' xmlns:y="urn:y">' +
                 '<sequence>' +
                  '<element name="foo" type="y:simpleType" minOccurs="0"/>' +
                 '</sequence>' +
                '</complexType>');
              var element = doc.documentElement;
              var xpath = $xpath.create(doc);
              var resolver = $typeResolver.create(typeResolvers, xpath);
              var type = typeResolver.resolveElement(element, resolver);
              expect(type).to.eql(
                $complexListType.create(
                  $element.create('foo', simpleType, { optional: true }),
                  { maxLength: 1, minLength: 1 }));
            });

          });

        });

      });

    });

  });

});
