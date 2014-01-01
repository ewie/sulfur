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
  'sulfur/schema/type/simple/derived/negativeInteger',
  'sulfur/schema/type/simple/derived/nonPositiveInteger',
  'sulfur/schema/value/simple/integer'
], function (
    shared,
    MaxInclusiveFacet,
    Facets,
    QName,
    DerivedType,
    NegativeIntegerType,
    NonPositiveIntegerType,
    IntegerValue
) {

  'use strict';

  var expect = shared.expect;

  describe('sulfur/schema/type/simple/derived/nonPositiveInteger', function () {

    it("should be a sulfur/schema/type/simple/derived", function () {
      expect(NegativeIntegerType).to.eql(
        DerivedType.create({
          base: NonPositiveIntegerType,
          qname: QName.create('negativeInteger', 'http://www.w3.org/2001/XMLSchema'),
          valueType: IntegerValue,
          facets: Facets.create([
            MaxInclusiveFacet.create(IntegerValue.parse('-1'))
          ])
        })
      );
    });

  });

});
