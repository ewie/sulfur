/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global beforeEach, context, describe, it */

define([
  'shared',
  'sulfur/schema/facet',
  'sulfur/schema/facets',
  'sulfur/schema/qname',
  'sulfur/schema/serializer/context',
  'sulfur/schema/serializer/facet',
  'sulfur/schema/serializer/type',
  'sulfur/schema/serializer/type/simple',
  'sulfur/schema/type/simple/list',
  'sulfur/schema/type/simple/restricted',
  'sulfur/util/document'
], function (
    shared,
    Facet,
    Facets,
    QName,
    Context,
    FacetSerializer,
    TypeSerializer,
    SimpleTypeSerializer,
    ListType,
    RestrictedType,
    Document
) {

  'use strict';

  var expect = shared.expect;
  var sinon = shared.sinon;
  var bind = shared.bind;
  var returns = shared.returns;

  describe('sulfur/schema/serializer/type/simple', function () {

    describe('#initialize()', function () {

      it("should reject types with duplicate qualified name", function () {
        var facet = { qname: QName.create('y', 'urn:z') };
        var facetSerializers = [ { facet: facet } ];
        var types = [
          {
            qname: QName.create('x', 'urn:y'),
            allowedFacets: Facets.create([ facet ])
          },
          { qname: QName.create('x', 'urn:y') }
        ];
        expect(bind(SimpleTypeSerializer, 'create', types, facetSerializers))
          .to.throw("type with duplicate qualified name {urn:y}x");
      });

      it("should reject facet serializers with duplicate facets", function () {
        var types = [ { qname: QName.create('x', 'urn:y') } ];
        var facet = { qname: QName.create('foo', 'urn:bar') };
        var facetSerializers = [
          { facet: facet },
          { facet: facet }
        ];
        expect(bind(SimpleTypeSerializer, 'create', types, facetSerializers))
          .to.throw("facet serializer with duplicate facet {urn:bar}foo");
      });

      it("should reject missing facet serializers", function () {
        var allowedFacet = { qname: QName.create('x', 'urn:y') };
        var types = [
          {
            qname: QName.create('foo', 'urn:bar'),
            allowedFacets: Facets.create([ allowedFacet ])
          }
        ];
        var someFacet = { qname: QName.create('x', 'urn:z') };
        var facetSerializers = [ { facet: someFacet } ];
        expect(bind(SimpleTypeSerializer, 'create', types, facetSerializers))
          .to.throw("expecting a facet serializer for facet {urn:y}x");
      });

    });

    describe('#hasTypeWithQualifiedName()', function () {

      var type;
      var typeSerializer;

      beforeEach(function () {
        var facet = { qname: QName.create('y', 'urn:z') };
        var facetSerializer = { facet: facet };
        type = {
          qname: QName.create('x', 'urn:y'),
          allowedFacets: Facets.create([ facet ])
        };
        typeSerializer = SimpleTypeSerializer.create([ type ], [ facetSerializer ]);
      });

      it("should return true when a type with matching qualified name is defined", function () {
        var qname = QName.create('x', 'urn:y');
        expect(typeSerializer.hasTypeWithQualifiedName(qname)).to.be.true;
      });

      it("should return false when no type with the given name is defined", function () {
        var qname = QName.create('z', 'urn:y');
        expect(typeSerializer.hasTypeWithQualifiedName(qname)).to.be.false;
      });

      it("should return false when no type with the given namespace is defined", function () {
        var qname = QName.create('x', 'urn:z');
        expect(typeSerializer.hasTypeWithQualifiedName(qname)).to.be.false;
      });

    });

    describe('#serializeType()', function () {

      function createFacet(qname) {
        return Facet.clone({
          qname: qname,
          mutualExclusiveFacets: []
        }).augment({
          isRestrictionOf: returns(true)
        });
      }

      var ctx;
      var simpleTypeSerializer;
      var typeSerializer;
      var stdFacetSerializer;
      var nonStdFacetSerializer;
      var stdFacet;
      var nonStdFacet;

      beforeEach(function () {
        stdFacet = createFacet(QName.create('y', 'http://www.w3.org/2001/XMLSchema'));
        nonStdFacet = createFacet(QName.create('z', 'urn:x'));
        stdFacetSerializer = FacetSerializer.create(stdFacet);
        nonStdFacetSerializer = FacetSerializer.create(nonStdFacet);
        var facetSerializers = [ stdFacetSerializer, nonStdFacetSerializer ];
        var types = [
          {
            qname: QName.create('x', 'urn:y'),
            allowedFacets: Facets.create([ stdFacet, nonStdFacet ])
          }
        ];
        simpleTypeSerializer = SimpleTypeSerializer.create(types, facetSerializers);
        typeSerializer = TypeSerializer.create([ simpleTypeSerializer ]);
        var doc = Document.make('http://www.w3.org/2001/XMLSchema', 'xs:schema');
        ctx = Context.create(doc);
      });

      it("should return undefined when the type is a sulfur/schema/type/simple/{list,restricted}", function () {
        expect(simpleTypeSerializer.serializeType({})).to.be.undefined;
      });

      context("when the type is a sulfur/schema/type/simple/list", function () {

        it("should return an xs:simpleType", function () {
          var itemType = {
            qname: QName.create('x', 'urn:y'),
            valueType: {}
          };
          var type = ListType.create(itemType);

          var e = simpleTypeSerializer.serializeType(type, undefined, ctx);

          expect(e.nodeName).to.equal('xs:simpleType');
          expect(e.namespaceURI).to.equal('http://www.w3.org/2001/XMLSchema');
        });

        it("should append child xs:list", function () {
          var itemType = {
            qname: QName.create('x', 'urn:y'),
            valueType: {}
          };
          var type = ListType.create(itemType);

          var e = simpleTypeSerializer.serializeType(type, typeSerializer, ctx);

          e = e.firstChild;
          expect(e.nodeName).to.equal('xs:list');
          expect(e.namespaceURI).to.equal('http://www.w3.org/2001/XMLSchema');
        });

        it("should add attribute @itemType when the list's item type has a qualified name", function () {
          var itemType = {
            qname: QName.create('foo', 'urn:bar'),
            valueType: {}
          };
          var type = ListType.create(itemType);
          var spy = sinon.spy(ctx, 'getNamespacePrefix');

          var e = simpleTypeSerializer.serializeType(type, undefined, ctx);

          var attr = e.firstChild.attributes.itemType;
          expect(attr.value).to.equal('ns1:foo');
          expect(spy).to.be.calledWith('urn:bar');
        });

        it("should recursively serialize the item type when it has no qualified name", function () {
          var baseType = {
            qname: QName.create('x', 'urn:y'),
            valueType: {},
            allowedFacets: Facets.create([ stdFacet ])
          };
          var itemType = RestrictedType.create(baseType,
            Facets.create([ stdFacet.create() ]));
          var type = ListType.create(itemType);
          var spy = sinon.spy(typeSerializer, 'serializeType');

          var e = simpleTypeSerializer.serializeType(type, typeSerializer, ctx);

          expect(spy)
            .to.be.calledWith(
              sinon.match.same(itemType),
              sinon.match.same(ctx))
            .to.have.returned(sinon.match.same(e.firstChild.firstChild));
        });

      });

      context("when the type is a sulfur/schema/type/simple/restricted", function () {

        it("should return an xs:simpleType", function () {
          var baseType = {
            qname: QName.create('x', 'urn:z'),
            valueType: {},
            allowedFacets: Facets.create([ stdFacet ])
          };
          var type = RestrictedType.create(baseType,
            Facets.create([ stdFacet.create() ]));

          var e = simpleTypeSerializer.serializeType(type, undefined, ctx);

          expect(e.nodeName).to.equal('xs:simpleType');
          expect(e.namespaceURI).to.equal('http://www.w3.org/2001/XMLSchema');
        });


        it("should append child xs:restriction", function () {
          var baseType = {
            qname: QName.create('x', 'urn:z'),
            valueType: {},
            allowedFacets: Facets.create([ stdFacet ])
          };
          var type = RestrictedType.create(baseType,
            Facets.create([ stdFacet.create() ]));

          var e = simpleTypeSerializer.serializeType(type, undefined, ctx);

          e = e.firstChild;
          expect(e.nodeName).to.equal('xs:restriction');
          expect(e.namespaceURI).to.equal('http://www.w3.org/2001/XMLSchema');
        });

        it("should add attribute @base when the restriction's base type has a qualified name", function () {
          var baseType = {
            qname: QName.create('x', 'urn:z'),
            valueType: {},
            allowedFacets: Facets.create([ stdFacet ])
          };
          var type = RestrictedType.create(baseType,
            Facets.create([ stdFacet.create() ]));
          var spy = sinon.spy(ctx, 'getNamespacePrefix');

          var e = simpleTypeSerializer.serializeType(type, undefined, ctx);

          var attr = e.firstChild.attributes.base;
          expect(attr.value).to.equal('ns1:x');
          expect(spy).to.be.calledWith('urn:z');
        });

        it("should recursively serialize the base type when it has no qualified name", function () {
          var primitiveType = {
            qname: QName.create('x', 'urn:z'),
            valuetype: {},
            allowedFacets: Facets.create([ stdFacet ])
          };
          var baseType = RestrictedType.create(primitiveType,
            Facets.create([ stdFacet.create() ]));
          var type = RestrictedType.create(baseType,
            Facets.create([ stdFacet.create() ]));
          var spy = sinon.spy(typeSerializer, 'serializeType');

          var e = simpleTypeSerializer.serializeType(type, typeSerializer, ctx);

          expect(spy)
            .to.be.calledWith(
              sinon.match.same(baseType),
              sinon.match.same(ctx))
            .to.have.returned(sinon.match.same(e.firstChild.firstChild));
        });

        it("should serialize standard facets as children of xs:restriction", function () {
          var baseType = {
            qname: QName.create('x', 'urn:z'),
            valuetype: {},
            allowedFacets: Facets.create([ stdFacet ])
          };
          var facet = stdFacet.create([ 'x', 'y' ]);
          var type = RestrictedType.create(baseType,
            Facets.create([ facet ]));
          var spy = sinon.spy(stdFacetSerializer, 'serializeFacet');

          var e = simpleTypeSerializer.serializeType(type, undefined, ctx);

          expect(spy)
            .to.be.calledWith(
              sinon.match.same(facet),
              sinon.match.same(ctx));

          expect(e.firstChild.childNodes[0]).to.equal(spy.getCall(0).returnValue[0]);
          expect(e.firstChild.childNodes[1]).to.equal(spy.getCall(0).returnValue[1]);
        });

        it("should serialize non-standard facets as children of xs:annotation/xs:appinfo", function () {
          var baseType = {
            qname: QName.create('x', 'urn:z'),
            valuetype: {},
            allowedFacets: Facets.create([ nonStdFacet ])
          };
          var facet = nonStdFacet.create([ 'a', 'b' ]);
          var type = RestrictedType.create(baseType,
            Facets.create([ facet ]));
          var spy = sinon.spy(nonStdFacetSerializer, 'serializeFacet');

          var e = simpleTypeSerializer.serializeType(type, undefined, ctx);

          expect(spy)
            .to.be.calledWith(
              sinon.match.same(facet),
              sinon.match.same(ctx));

          e = e.firstChild.firstChild;
          expect(e.nodeName).to.equal('xs:annotation');
          expect(e.namespaceURI).to.equal('http://www.w3.org/2001/XMLSchema');

          e = e.firstChild;
          expect(e.nodeName).to.equal('xs:appinfo');
          expect(e.namespaceURI).to.equal('http://www.w3.org/2001/XMLSchema');

          expect(e.childNodes[0]).to.equal(spy.getCall(0).returnValue[0]);
          expect(e.childNodes[1]).to.equal(spy.getCall(0).returnValue[1]);
        });

      });

    });

  });

});
