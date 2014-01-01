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
  'sulfur/schema/facet/minInclusive',
  'sulfur/schema/facets',
  'sulfur/schema/qname',
  'sulfur/schema/type/simple/derived',
  'sulfur/schema/type/simple/derived/int',
  'sulfur/schema/type/simple/derived/short',
  'sulfur/schema/value/simple/integer'
], function (
    shared,
    MaxInclusiveFacet,
    MinInclusiveFacet,
    Facets,
    QName,
    DerivedType,
    IntType,
    ShortType,
    IntegerValue
) {

  'use strict';

  var expect = shared.expect;

  describe('sulfur/schema/type/simple/derived/short', function () {

    it("should be a sulfur/schema/type/simple/derived", function () {
      expect(ShortType).to.eql(
        DerivedType.create({
          base: IntType,
          qname: QName.create('short', 'http://www.w3.org/2001/XMLSchema'),
          valueType: IntegerValue,
          facets: Facets.create([
            MaxInclusiveFacet.create(IntegerValue.parse('32767')),
            MinInclusiveFacet.create(IntegerValue.parse('-32768'))
          ])
        })
      );
    });

  });

});
