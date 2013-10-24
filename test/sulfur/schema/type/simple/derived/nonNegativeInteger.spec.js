/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global describe, it */

define([
  'shared',
  'sulfur/schema/facet/minInclusive',
  'sulfur/schema/facets',
  'sulfur/schema/qname',
  'sulfur/schema/type/simple/derived',
  'sulfur/schema/type/simple/derived/integer',
  'sulfur/schema/type/simple/derived/nonNegativeInteger',
  'sulfur/schema/value/simple/integer'
], function (
    shared,
    MinInclusiveFacet,
    Facets,
    QName,
    DerivedType,
    IntegerType,
    NonNegativeIntegerType,
    IntegerValue
) {

  'use strict';

  var expect = shared.expect;

  describe('sulfur/schema/type/simple/derived/nonNegativeInteger', function () {

    it("should be a sulfur/schema/type/simple/derived", function () {
      expect(NonNegativeIntegerType).to.eql(
        DerivedType.create({
          base: IntegerType,
          qname: QName.create('nonNegativeInteger', 'http://www.w3.org/2001/XMLSchema'),
          valueType: IntegerValue,
          facets: Facets.create([
            MinInclusiveFacet.create(IntegerValue.parse('0'))
          ])
        })
      );
    });

  });

});
