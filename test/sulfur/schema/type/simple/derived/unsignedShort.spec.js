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
  'sulfur/schema/facet/maxInclusive',
  'sulfur/schema/facets',
  'sulfur/schema/qname',
  'sulfur/schema/type/simple/derived',
  'sulfur/schema/type/simple/derived/unsignedInt',
  'sulfur/schema/type/simple/derived/unsignedShort',
  'sulfur/schema/value/simple/integer'
], function (
    shared,
    MaxInclusiveFacet,
    Facets,
    QName,
    DerivedType,
    UnsignedIntType,
    UnsignedShortType,
    IntegerValue
) {

  'use strict';

  var expect = shared.expect;

  describe('sulfur/schema/type/simple/derived/unsignedShort', function () {

    it("should be a sulfur/schema/type/simple/derived", function () {
      expect(UnsignedShortType).to.eql(
        DerivedType.create({
          base: UnsignedIntType,
          qname: QName.create('unsignedShort', 'http://www.w3.org/2001/XMLSchema'),
          valueType: IntegerValue,
          facets: Facets.create([
            MaxInclusiveFacet.create(IntegerValue.parse('65535'))
          ])
        })
      );
    });

  });

});
