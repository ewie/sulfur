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
  'sulfur/schema/facet/maxExclusive',
  'sulfur/schema/facet/maxInclusive',
  'sulfur/schema/facet/minExclusive',
  'sulfur/schema/facet/minInclusive',
  'sulfur/schema/facet/pattern',
  'sulfur/schema/facets',
  'sulfur/schema/qname',
  'sulfur/schema/type/simple/primitive',
  'sulfur/schema/type/simple/primitive/float',
  'sulfur/schema/value/simple/float'
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
    FloatType,
    FloatValue
) {

  'use strict';

  var expect = shared.expect;

  describe('sulfur/schema/type/simple/primitive/float', function () {

    it("should be a sulfur/schema/type/simple/primitive", function () {
      expect(FloatType).to.eql(
        PrimitiveType.create({
          qname: QName.create('float', 'http://www.w3.org/2001/XMLSchema'),
          valueType: FloatValue,
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
