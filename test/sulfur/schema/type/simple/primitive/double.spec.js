/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global describe, it */

define([
  'shared',
  'sulfur/schema/facet/enumeration',
  'sulfur/schema/facet/maxExclusive',
  'sulfur/schema/facet/maxInclusive',
  'sulfur/schema/facet/minExclusive',
  'sulfur/schema/facet/minInclusive',
  'sulfur/schema/facet/pattern',
  'sulfur/schema/facets',
  'sulfur/schema/qname',
  'sulfur/schema/type/simple/primitive',
  'sulfur/schema/type/simple/primitive/double',
  'sulfur/schema/value/simple/double'
], function (
    shared,
    EnumerationFacet,
    MaxExclusiveFacet,
    MaxInclusiveFacet,
    MinExclusiveFacet,
    MinInclusiveFacet,
    PatternFacet,
    Facets,
    QName,
    PrimitiveType,
    DoubleType,
    DoubleValue
) {

  'use strict';

  var expect = shared.expect;

  describe('sulfur/schema/type/simple/primitive/double', function () {

    it("should be a sulfur/schema/type/simple/primitive", function () {
      expect(DoubleType).to.eql(
        PrimitiveType.create({
          qname: QName.create('double', 'http://www.w3.org/2001/XMLSchema'),
          valueType: DoubleValue,
          facets: Facets.create([
            EnumerationFacet,
            MaxExclusiveFacet,
            MaxInclusiveFacet,
            MinExclusiveFacet,
            MinInclusiveFacet,
            PatternFacet
          ])
        })
      );
    });

  });

});
