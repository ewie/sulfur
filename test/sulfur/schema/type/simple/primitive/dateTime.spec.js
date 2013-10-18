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
  'sulfur/schema/type/simple/primitive/dateTime',
  'sulfur/schema/value/simple/dateTime'
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
    DateTimeType,
    DateTimeValue
) {

  'use strict';

  var expect = shared.expect;

  describe('sulfur/schema/type/simple/primitive/dateTime', function () {

    it("should be a sulfur/schema/type/simple/primitive", function () {
      expect(DateTimeType).to.eql(
        PrimitiveType.create({
          qname: QName.create('dateTime', 'http://www.w3.org/2001/XMLSchema'),
          valueType: DateTimeValue,
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
