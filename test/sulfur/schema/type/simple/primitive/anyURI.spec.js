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
  'sulfur/schema/facet/enumeration',
  'sulfur/schema/facet/length',
  'sulfur/schema/facet/maxLength',
  'sulfur/schema/facet/minLength',
  'sulfur/schema/facet/pattern',
  'sulfur/schema/facets',
  'sulfur/schema/qname',
  'sulfur/schema/type/simple/primitive',
  'sulfur/schema/type/simple/primitive/anyURI',
  'sulfur/schema/value/simple/uri'
], function (
    shared,
    EnumerationFacet,
    LengthFacet,
    MaxLengthFacet,
    MinLengthFacet,
    PatternFacet,
    Facets,
    QName,
    PrimitiveType,
    AnyUriType,
    UriValue
) {

  'use strict';

  var expect = shared.expect;

  describe('sulfur/schema/type/simple/primitive/anyURI', function () {

    it("should be a sulfur/schema/type/simple/primitive", function () {
      expect(PrimitiveType.prototype).to.be.prototypeOf(AnyUriType);
    });

    describe('.qname', function () {

      it("should return {http://www.w3.org/2001/XMLSchema}anyURI", function () {
        expect(AnyUriType.qname)
          .to.eql(QName.create('anyURI', 'http://www.w3.org/2001/XMLSchema'));
      });


    });

    describe('.valueType', function () {

      it("should return sulfur/schema/value/simple/uri", function () {
        expect(AnyUriType.valueType).to.equal(UriValue);
      });

    });

    describe('.allowedFacets', function () {

      [
        EnumerationFacet,
        LengthFacet,
        MaxLengthFacet,
        MinLengthFacet,
        PatternFacet
      ].forEach(function (facet) {

        var qname = facet.qname;
        var name = qname.localName;

        it("should include sulfur/schema/facet/" + name, function () {
          expect(AnyUriType.allowedFacets.getByQName(qname)).to.equal(facet);
        });

      });

    });

  });

});
