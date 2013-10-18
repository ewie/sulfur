/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global describe, it */

define([
  'shared',
  'sulfur/schema/facet/fractionDigits',
  'sulfur/schema/facets',
  'sulfur/schema/qname',
  'sulfur/schema/type/simple/derived',
  'sulfur/schema/type/simple/derived/integer',
  'sulfur/schema/type/simple/primitive/decimal',
  'sulfur/schema/value/simple/integer'
], function (
    shared,
    FractionDigitsFacet,
    Facets,
    QName,
    DerivedType,
    IntegerType,
    DecimalType,
    IntegerValue
) {

  'use strict';

  var expect = shared.expect;

  describe('sulfur/schema/type/simple/derived/integer', function () {

    it("should be a sulfur/schema/type/simple/derived", function () {
      expect(IntegerType).to.eql(
        DerivedType.create({
          base: DecimalType,
          qname: QName.create('integer', 'http://www.w3.org/2001/XMLSchema'),
          valueType: IntegerValue,
          facets: Facets.create([ FractionDigitsFacet.create(0) ])
        })
      );
    });

  });

});
