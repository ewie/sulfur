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
  'sulfur/schema/element',
  'sulfur/schema/elements',
  'sulfur/schema/facet/minInclusive',
  'sulfur/schema/facets',
  'sulfur/schema/deserializer/resolver',
  'sulfur/schema/deserializer/type/complex',
  'sulfur/schema/deserializer/type/simple',
  'sulfur/schema/qname',
  'sulfur/schema/type/complex/primitive',
  'sulfur/schema/type/complex/list',
  'sulfur/schema/type/complex/restricted',
  'sulfur/schema/type/simple/primitive',
  'sulfur/schema/type/simple/restricted',
  'sulfur/schema/value/simple/double',
  'sulfur/schema/value/simple/integer'
], function (
    shared,
    Element,
    Elements,
    MinInclusiveFacet,
    Facets,
    Resolver,
    ComplexResolver,
    SimpleResolver,
    QName,
    ComplexPrimitiveType,
    ComplexListType,
    ComplexRestrictedType,
    SimplePrimitiveType,
    SimpleRestrictedType,
    DoubleValue,
    IntegerValue
) {

  'use strict';

  var expect = shared.expect;
  var bind = shared.bind;

  describe('sulfur/schema/deserializer/type/complex', function () {

    function parse(s) {
      var p = new DOMParser();
      return p.parseFromString(s, 'text/xml');
    }

    describe('#initialize()', function () {

      it("should reject an empty array", function () {
        expect(bind(ComplexResolver, 'create', []))
          .to.throw("expecting an array of one or more types");
      });

      it("should reject types which are not a sulfur/schema/type/complex", function () {
        expect(bind(ComplexResolver, 'create', [{}]))
          .to.throw("expecting only sulfur/schema/type/complex types");
      });

      it("should reject types with duplicate qualified name", function () {
        var types = [
          ComplexPrimitiveType.create({ qname: QName.create('foo', 'urn:example:bar') }),
          ComplexPrimitiveType.create({ qname: QName.create('foo', 'urn:example:bar') })
        ];
        expect(bind(ComplexResolver, 'create', types))
          .to.throw("type with duplicate qualified name {urn:example:bar}foo");
      });

    });

    describe('#resolveQualifiedName()', function () {

      var type;
      var complexResolver;

      beforeEach(function () {
        var valueType = {
          allowedElements: Elements.create([ Element.create('foo') ])
        };
        type = ComplexPrimitiveType.create(
          { qname: QName.create('x', 'urn:example:y'),
            valueType: valueType
          });
        complexResolver = ComplexResolver.create([ type ]);
      });

      it("should return an instance of the type matching the name and namespace", function () {
        var t = complexResolver.resolveQualifiedName(QName.create('x', 'urn:example:y'));
        expect(t).to.equal(type);
      });

      it("should return undefined when no type with the given name is defined", function () {
        expect(complexResolver.resolveQualifiedName(QName.create('z', 'urn:example:y'))).to.be.undefined;
      });

      it("should return undefined when no type with the given namespace is defined", function () {
        expect(complexResolver.resolveQualifiedName(QName.create('x', 'urn:example:z'))).to.be.undefined;
      });

    });

    describe('#resolveTypeElement()', function () {

      var complexResolver;
      var resolvers;
      var complexType;
      var complexType3;
      var simpleType;

      beforeEach(function () {
        simpleType = SimplePrimitiveType.create(
          { qname: QName.create('simpleType', 'urn:example:y'),
            facets: Facets.create([ MinInclusiveFacet ])
          });
        var simpleType2 = SimplePrimitiveType.create(
          { qname: QName.create('simpleType2', 'urn:example:y'),
            valueType: DoubleValue,
            facets: Facets.create([ MinInclusiveFacet ])
          });
        var otherType = SimplePrimitiveType.create(
          { qname: QName.create('otherType', 'urn:example:y'),
            facets: Facets.create([ MinInclusiveFacet ])
          });
        complexType = ComplexPrimitiveType.create(
          { qname: QName.create('complexType', 'urn:example:y'),
            valueType: { allowedElements: Elements.create(
              [ Element.create('foo', simpleType) ])
            }
          });
        var complexType2 = ComplexPrimitiveType.create(
          { qname: QName.create('complexType2', 'urn:example:y'),
            valueType: { allowedElements: Elements.create(
              [ Element.create('foo',
                  SimpleRestrictedType.create(simpleType2,
                    Facets.create(
                      [ MinInclusiveFacet.create(DoubleValue.create(1)) ])))
              ])
            }
          });
        complexType3 = ComplexPrimitiveType.create(
          { qname: QName.create('complexType3', 'urn:example:y'),
            valueType: { allowedElements: Elements.create(
              [ Element.create('foo', simpleType),
                Element.create('bar', simpleType),
                Element.create('baz', simpleType)
              ])
            }
          });
        var complexType4 = ComplexPrimitiveType.create(
          { qname: QName.create('complexType4', 'urn:example:y'),
            valueType: { allowedElements: Elements.create(
              [ Element.create('foo', simpleType),
                Element.create('bar', simpleType)
              ])
            }
          });
        complexResolver = ComplexResolver.create(
          [ complexType, complexType2, complexType3, complexType4 ]);
        var facetResolver = {
          facet: MinInclusiveFacet,
          parseValue: function (s) { return parseInt(s, 10); },
          createFacet: function (values) {
            return MinInclusiveFacet.create(DoubleValue.create(values[0]));
          }
        };
        var simpleResolver = SimpleResolver.create(
          [ simpleType, otherType, simpleType2 ], [ facetResolver ]);
        resolvers = [ complexResolver, simpleResolver ];
      });

      it("should return undefined when the element's local name is not 'complexType", function () {
        var element = { localName: 'notAComplexType' };
        expect(complexResolver.resolveTypeElement(element)).to.be.undefined;
      });

      it("should return undefined when the element's namespace is not 'http://www.w3.org/2001/XMLSchema'", function () {
        var element = { localName: 'complexType', namespaceURI: 'urn:example:void' };
        expect(complexResolver.resolveTypeElement(element)).to.be.undefined;
      });

      context("with element xs:complexType", function () {

        it("should return undefined when it does not have child xs:all", function () {
          var doc = parse('<complexType xmlns="http://www.w3.org/2001/XMLSchema"/>');
          var element = doc.documentElement;
          var resolver = Resolver.create(doc);
          expect(complexResolver.resolveTypeElement(element, resolver)).to.be.undefined;
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
            var resolver = Resolver.create(doc);
            expect(complexResolver.resolveTypeElement(element, resolver)).to.be.undefined;
          });

          context("when a compatible type exists", function () {

            it("should return that type", function () {
              var doc = parse(
                '<complexType' +
                  ' xmlns="http://www.w3.org/2001/XMLSchema"' +
                  ' xmlns:y="urn:example:y">' +
                 '<all>' +
                  '<element name="foo" type="y:simpleType"/>' +
                 '</all>' +
                '</complexType>');
              var element = doc.documentElement;
              var resolver = Resolver.create(doc, resolvers);
              var type = complexResolver.resolveTypeElement(element, resolver);
              expect(type).to.eql(
                ComplexRestrictedType.create(complexType,
                  Elements.create(
                    [ Element.create('foo', simpleType) ])));
            });

            it("should return the type that could be satisfied with the most optional elements", function () {
              var doc = parse(
                '<complexType' +
                  ' xmlns="http://www.w3.org/2001/XMLSchema"' +
                  ' xmlns:y="urn:example:y">' +
                 '<all>' +
                  '<element name="foo" type="y:simpleType"/>' +
                  '<element name="bar" type="y:simpleType" minOccurs="0"/>' +
                  '<element name="baz" type="y:simpleType" minOccurs="0"/>' +
                 '</all>' +
                '</complexType>');
              var element = doc.documentElement;
              var resolver = Resolver.create(doc, resolvers);
              var type = complexResolver.resolveTypeElement(element, resolver);
              expect(type).to.eql(
                ComplexRestrictedType.create(complexType3,
                  Elements.create(
                    [ Element.create('foo', simpleType),
                      Element.create('bar', simpleType, { optional: true }),
                      Element.create('baz', simpleType, { optional: true })
                    ])));
            });

            it("should ignore prohibited elements", function () {
              var doc = parse(
                '<complexType' +
                  ' xmlns="http://www.w3.org/2001/XMLSchema"' +
                  ' xmlns:y="urn:example:y">' +
                 '<all>' +
                  '<element name="foo" type="y:simpleType"/>' +
                  '<element name="xxx" type="y:simpleType" minOccurs="0" maxOccurs="0"/>' +
                 '</all>' +
                '</complexType>');
              var element = doc.documentElement;
              var resolver = Resolver.create(doc, resolvers);
              var type = complexResolver.resolveTypeElement(element, resolver);
              expect(type).to.eql(
                ComplexRestrictedType.create(complexType,
                  Elements.create(
                    [ Element.create('foo', simpleType) ])));
            });

          });

          context("when no compatible complex type exists", function () {

            it("should return undefined", function () {
              var doc = parse(
                '<complexType' +
                  ' xmlns="http://www.w3.org/2001/XMLSchema"' +
                  ' xmlns:y="urn:example:y">' +
                 '<all>' +
                  '<element name="xxx" type="y:simpleType"/>' +
                 '</all>' +
                '</complexType>');
              var element = doc.documentElement;
              var resolver = Resolver.create(doc, resolvers);
              expect(complexResolver.resolveTypeElement(element, resolver)).to.be.undefined;
            });

            it("should detect missing elements", function () {
              var doc = parse(
                '<complexType' +
                  ' xmlns="http://www.w3.org/2001/XMLSchema"' +
                  ' xmlns:y="urn:example:y">' +
                 '<all>' +
                  '<element name="bar" type="y:simpleType"/>' +
                 '</all>' +
                '</complexType>');
              var element = doc.documentElement;
              var resolver = Resolver.create(doc, resolvers);
              expect(complexResolver.resolveTypeElement(element, resolver)).to.be.undefined;
            });

            it("should detect additional elements", function () {
              var doc = parse(
                '<complexType' +
                  ' xmlns="http://www.w3.org/2001/XMLSchema"' +
                  ' xmlns:y="urn:example:y">' +
                 '<all>' +
                  '<element name="foo" type="y:simpleType"/>' +
                  '<element name="additional" type="y:simpleType"/>' +
                 '</all>' +
                '</complexType>');
              var element = doc.documentElement;
              var resolver = Resolver.create(doc, resolvers);
              expect(complexResolver.resolveTypeElement(element, resolver)).to.be.undefined;
            });

            it("should detect mismatching element types based on their prototypes", function () {
              var doc = parse(
                '<complexType' +
                  ' xmlns="http://www.w3.org/2001/XMLSchema"' +
                  ' xmlns:y="urn:example:y">' +
                 '<all>' +
                  '<element name="foo" type="y:otherType"/>' +
                 '</all>' +
                '</complexType>');
              var element = doc.documentElement;
              var resolver = Resolver.create(doc, resolvers);
              expect(complexResolver.resolveTypeElement(element, resolver)).to.be.undefined;
            });

            it("should detect element types with insufficient restriction", function () {
              var doc = parse(
                '<complexType' +
                  ' xmlns="http://www.w3.org/2001/XMLSchema"' +
                  ' xmlns:y="urn:example:y">' +
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
              var resolver = Resolver.create(doc, resolvers);
              expect(complexResolver.resolveTypeElement(element, resolver)).to.be.undefined;
            });

            it("should detect recursive element types", function () {
              var doc = parse(
                '<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">' +
                 '<xs:element name="foo">' +
                  '<xs:complexType>' +
                   '<xs:all>' +
                    '<xs:element ref="foo"/>' +
                   '</xs:all>' +
                  '</xs:complexType>' +
                 '</xs:element>' +
                '</xs:schema>');
              var element = doc.documentElement;
              var resolver = Resolver.create(doc, resolvers);
              expect(complexResolver.resolveTypeElement(element, resolver)).to.be.undefined;
            });

          });

          context("with elements of incompatible type", function () {

            it("should ignore when optional", function () {
              var doc = parse(
                '<complexType' +
                  ' xmlns="http://www.w3.org/2001/XMLSchema"' +
                  ' xmlns:y="urn:example:y">' +
                 '<all>' +
                  '<element name="foo" type="y:simpleType"/>' +
                  '<element name="xxx" type="y:incompatibleType" minOccurs="0"/>' +
                 '</all>' +
                '</complexType>');
              var element = doc.documentElement;
              var resolver = Resolver.create(doc, resolvers);
              var type = complexResolver.resolveTypeElement(element, resolver);
              expect(type).to.eql(
                ComplexRestrictedType.create(complexType,
                  Elements.create(
                    [ Element.create('foo', simpleType) ])));
            });

            it("should make the enclosing type incompatible when mandatory", function () {
              var doc = parse(
                '<complexType' +
                  ' xmlns="http://www.w3.org/2001/XMLSchema"' +
                  ' xmlns:ns="urn:example:void">' +
                 '<all>' +
                  '<element name="foo" type="ns:incompatibleType"/>' +
                 '</all>' +
                '</complexType>');
              var element = doc.documentElement;
              var resolver = Resolver.create(doc, resolvers);
              expect(complexResolver.resolveTypeElement(element, resolver)).to.be.undefined;
            });

          });

          context("with sibling xs:attribute", function () {

            it("should make the enclosing type incompatible when attributes are mandatory", function () {
              var doc = parse(
                '<complexType xmlns="http://www.w3.org/2001/XMLSchema">' +
                 '<all/>' +
                 '<attribute use="required"/>' +
                '</complexType>');
              var element = doc.documentElement;
              var resolver = Resolver.create(doc);
              expect(complexResolver.resolveTypeElement(element, resolver)).to.be.undefined;
            });

            it("should ignore optional attributes", function () {
              var doc = parse(
                '<complexType' +
                  ' xmlns="http://www.w3.org/2001/XMLSchema"' +
                  ' xmlns:y="urn:example:y">' +
                 '<all>' +
                  '<element name="foo" type="y:simpleType"/>' +
                 '</all>' +
                 '<attribute/>' +
                '</complexType>');
              var element = doc.documentElement;
              var resolver = Resolver.create(doc, resolvers);
              var type = complexResolver.resolveTypeElement(element, resolver);
              expect(type).to.eql(
                ComplexRestrictedType.create(complexType,
                  Elements.create(
                    [ Element.create('foo', simpleType) ])));
            });

          });

          context("with sibling xs:attributeGroup", function () {

            it("should make the enclosing type incompatible when attributes are mandatory", function () {
              var doc = parse(
                '<complexType xmlns="http://www.w3.org/2001/XMLSchema">' +
                 '<all/>' +
                 '<attributeGroup/>' +
                 '<attributeGroup>' +
                  '<attribute use="required"/>' +
                 '</attributeGroup>' +
                '</complexType>');
              var element = doc.documentElement;
              var resolver = Resolver.create(doc);
              expect(complexResolver.resolveTypeElement(element, resolver)).to.be.undefined;
            });

            it("should ignore optional attributes", function () {
              var doc = parse(
                '<complexType' +
                  ' xmlns="http://www.w3.org/2001/XMLSchema"' +
                  ' xmlns:y="urn:example:y">' +
                 '<all>' +
                  '<element name="foo" type="y:simpleType"/>' +
                 '</all>' +
                 '<attributeGroup>' +
                  '<attribute/>' +
                 '</attributeGroup>' +
                '</complexType>');
              var element = doc.documentElement;
              var resolver = Resolver.create(doc, resolvers);
              var type = complexResolver.resolveTypeElement(element, resolver);
              expect(type).to.eql(
                ComplexRestrictedType.create(complexType,
                  Elements.create(
                    [ Element.create('foo', simpleType) ])));
            });

          });

        });

        context("with child xs:sequence", function () {

          it("should use the value of attribute @minOccurs as required minimum number of entries when defined", function () {
            var doc = parse(
              '<complexType' +
                ' xmlns="http://www.w3.org/2001/XMLSchema"' +
                ' xmlns:y="urn:example:y">' +
               '<sequence minOccurs="0">' +
                '<element name="bar" type="y:simpleType"/>' +
               '</sequence>' +
              '</complexType>');
            var element = doc.documentElement;
            var resolver = Resolver.create(doc, resolvers);
            var type = complexResolver.resolveTypeElement(element, resolver);

            expect(ComplexListType.prototype).to.be.prototypeOf(type);
            expect(type.element).to.eql(Element.create('bar', simpleType));
            expect(type.maxLength).to.eql(IntegerValue.parse('1'));
            expect(type.minLength).to.eql(IntegerValue.create());
          });

          it("should use value 1 as required minimum number of entries when attribute @minOccurs is not defined", function () {
            var doc = parse(
              '<complexType' +
                ' xmlns="http://www.w3.org/2001/XMLSchema"' +
                ' xmlns:y="urn:example:y">' +
               '<sequence>' +
                '<element name="bar" type="y:simpleType"/>' +
               '</sequence>' +
              '</complexType>');
            var element = doc.documentElement;
            var resolver = Resolver.create(doc, resolvers);
            var type = complexResolver.resolveTypeElement(element, resolver);

            expect(ComplexListType.prototype).to.be.prototypeOf(type);
            expect(type.element).to.eql(Element.create('bar', simpleType));
            expect(type.maxLength).to.eql(IntegerValue.parse('1'));
            expect(type.minLength).to.eql(IntegerValue.parse('1'));
          });

          it("should use value 1 as allowed maximum number of entries when attribute @maxOccurs is not defined", function () {
            var doc = parse(
              '<complexType' +
                ' xmlns="http://www.w3.org/2001/XMLSchema"' +
                ' xmlns:y="urn:example:y">' +
               '<sequence>' +
                '<element name="bar" type="y:simpleType"/>' +
               '</sequence>' +
              '</complexType>');
            var element = doc.documentElement;
            var resolver = Resolver.create(doc, resolvers);
            var type = complexResolver.resolveTypeElement(element, resolver);

            expect(ComplexListType.prototype).to.be.prototypeOf(type);
            expect(type.element).to.eql(Element.create('bar', simpleType));
            expect(type.maxLength).to.eql(IntegerValue.parse('1'));
            expect(type.minLength).to.eql(IntegerValue.parse('1'));
          });

          context("with attribute @maxOccurs", function () {

            it("should use the value as allowed maximum number of items when its a number", function () {
              var doc = parse(
                '<complexType' +
                  ' xmlns="http://www.w3.org/2001/XMLSchema"' +
                  ' xmlns:y="urn:example:y">' +
                 '<sequence maxOccurs="3">' +
                  '<element name="bar" type="y:simpleType"/>' +
                 '</sequence>' +
                '</complexType>');
              var element = doc.documentElement;
              var resolver = Resolver.create(doc, resolvers);
              var type = complexResolver.resolveTypeElement(element, resolver);

              expect(ComplexListType.prototype).to.be.prototypeOf(type);
              expect(type.element).to.eql(Element.create('bar', simpleType));
              expect(type.maxLength).to.eql(IntegerValue.parse('3'));
              expect(type.minLength).to.eql(IntegerValue.parse('1'));
            });

            it("should use no allowed maximum number of items when 'unbounded'", function () {
              var doc = parse(
                '<complexType' +
                  ' xmlns="http://www.w3.org/2001/XMLSchema"' +
                  ' xmlns:y="urn:example:y">' +
                 '<sequence maxOccurs="unbounded">' +
                  '<element name="bar" type="y:simpleType"/>' +
                 '</sequence>' +
                '</complexType>');
              var element = doc.documentElement;
              var resolver = Resolver.create(doc, resolvers);
              var type = complexResolver.resolveTypeElement(element, resolver);

              expect(ComplexListType.prototype).to.be.prototypeOf(type);
              expect(type.element).to.eql(Element.create('bar', simpleType));
              expect(type.maxLength).to.be.undefined;
              expect(type.minLength).to.eql(IntegerValue.parse('1'));
            });

          });

          context("with a mandatory element", function () {

            it("should return undefined when the element type is incompatible", function () {
              var doc = parse(
                '<complexType' +
                  ' xmlns="http://www.w3.org/2001/XMLSchema"' +
                  ' xmlns:y="urn:example:y">' +
                 '<sequence>' +
                  '<element name="xxx" type="y:incompatibleType"/>' +
                 '</sequence>' +
                '</complexType>');
              var element = doc.documentElement;
              var resolver = Resolver.create(doc, resolvers);
              expect(complexResolver.resolveTypeElement(element, resolver)).to.be.undefined;
            });

            it("should use that element as item", function () {
              var doc = parse(
                '<complexType' +
                  ' xmlns="http://www.w3.org/2001/XMLSchema"' +
                  ' xmlns:y="urn:example:y">' +
                 '<sequence>' +
                  '<element name="bar" type="y:simpleType"/>' +
                 '</sequence>' +
                '</complexType>');
              var element = doc.documentElement;
              var resolver = Resolver.create(doc, resolvers);
              var type = complexResolver.resolveTypeElement(element, resolver);

              expect(ComplexListType.prototype).to.be.prototypeOf(type);
              expect(type.element).to.eql(Element.create('bar', simpleType));
              expect(type.maxLength).to.eql(IntegerValue.parse('1'));
              expect(type.minLength).to.eql(IntegerValue.parse('1'));
            });

            it("should return undefined when there are multiple mandatory elements", function () {
              var doc = parse(
                '<complexType' +
                  ' xmlns="http://www.w3.org/2001/XMLSchema"' +
                  ' xmlns:y="urn:example:y">' +
                 '<sequence>' +
                  '<element name="bar" type="y:simpleType"/>' +
                  '<element name="foo" type="y:simpleType"/>' +
                 '</sequence>' +
                '</complexType>');
              var element = doc.documentElement;
              var resolver = Resolver.create(doc, resolvers);
              expect(complexResolver.resolveTypeElement(element, resolver)).to.be.undefined;
            });

            it("should ignore optional elements", function () {
              var doc = parse(
                '<complexType' +
                  ' xmlns="http://www.w3.org/2001/XMLSchema"' +
                  ' xmlns:y="urn:example:y">' +
                 '<sequence>' +
                  '<element name="foo" type="y:simpleType" minOccurs="0"/>' +
                  '<element name="baz" type="y:simpleType" minOccurs="0"/>' +
                  '<element name="bar" type="y:simpleType"/>' +
                 '</sequence>' +
                '</complexType>');
              var element = doc.documentElement;
              var resolver = Resolver.create(doc, resolvers);
              var type = complexResolver.resolveTypeElement(element, resolver);

              expect(ComplexListType.prototype).to.be.prototypeOf(type);
              expect(type.element).to.eql(Element.create('bar', simpleType));
              expect(type.maxLength).to.eql(IntegerValue.parse('1'));
              expect(type.minLength).to.eql(IntegerValue.parse('1'));
            });

          });

          context("with only optional elements", function () {

            it("should return undefined when there are multiple optional elements", function () {
              var doc = parse(
                '<complexType' +
                  ' xmlns="http://www.w3.org/2001/XMLSchema"' +
                  ' xmlns:y="urn:example:y">' +
                 '<sequence>' +
                  '<element name="bar" type="y:simpleType" minOccurs="0"/>' +
                  '<element name="foo" type="y:simpleType" minOccurs="0"/>' +
                 '</sequence>' +
                '</complexType>');
              var element = doc.documentElement;
              var resolver = Resolver.create(doc, resolvers);
              expect(complexResolver.resolveTypeElement(element, resolver)).to.be.undefined;
            });

            it("should use the first element with compatible type", function () {
              var doc = parse(
                '<complexType' +
                  ' xmlns="http://www.w3.org/2001/XMLSchema"' +
                  ' xmlns:y="urn:example:y">' +
                 '<sequence>' +
                  '<element name="xxx" type="y:incompatibleType" minOccurs="0"/>' +
                  '<element name="foo" type="y:simpleType" minOccurs="0"/>' +
                 '</sequence>' +
                '</complexType>');
              var element = doc.documentElement;
              var resolver = Resolver.create(doc, resolvers);
              var type = complexResolver.resolveTypeElement(element, resolver);

              expect(ComplexListType.prototype).to.be.prototypeOf(type);
              expect(type.element).to.eql(Element.create('foo', simpleType, { optional: true }));
              expect(type.maxLength).to.eql(IntegerValue.parse('1'));
              expect(type.minLength).to.eql(IntegerValue.parse('1'));
            });

          });

        });

      });

    });

  });

});
