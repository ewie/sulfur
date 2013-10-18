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
  'sulfur/schema/type/simple/primitive/date',
  'sulfur/schema/value/simple/date'
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
    DateType,
    DateValue
) {

  'use strict';

  var expect = shared.expect;

  describe('sulfur/schema/type/simple/primitive/date', function () {

    it("should be a sulfur/schema/type/simple/primitive", function () {
      expect(DateType).to.eql(
        PrimitiveType.create({
          qname: QName.create('date', 'http://www.w3.org/2001/XMLSchema'),
          valueType: DateValue,
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
