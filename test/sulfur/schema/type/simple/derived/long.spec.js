/* Copyright (c) 2013, Erik Wienhold
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
  'sulfur/schema/type/simple/derived/integer',
  'sulfur/schema/type/simple/derived/long',
  'sulfur/schema/value/simple/integer'
], function (
    shared,
    MaxInclusiveFacet,
    MinInclusiveFacet,
    Facets,
    QName,
    DerivedType,
    IntegerType,
    LongType,
    IntegerValue
) {

  'use strict';

  var expect = shared.expect;

  describe('sulfur/schema/type/simple/derived/long', function () {

    it("should be a sulfur/schema/type/simple/derived", function () {
      expect(LongType).to.eql(
        DerivedType.create({
          base: IntegerType,
          qname: QName.create('long', 'http://www.w3.org/2001/XMLSchema'),
          valueType: IntegerValue,
          facets: Facets.create([
            MaxInclusiveFacet.create(IntegerValue.parse('9223372036854775807')),
            MinInclusiveFacet.create(IntegerValue.parse('-9223372036854775808'))
          ])
        })
      );
    });

  });

});
