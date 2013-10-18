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
    $shared,
    $enumerationFacet,
    $maxExclusiveFacet,
    $maxInclusiveFacet,
    $minExclusiveFacet,
    $minInclusiveFacet,
    $patternFacet,
    $facets,
    $qname,
    $primitiveType,
    $doubleType,
    $doubleValue
) {

  'use strict';

  var expect = $shared.expect;

  describe('sulfur/schema/type/simple/primitive/double', function () {

    it("should be a sulfur/schema/type/simple/primitive", function () {
      expect($doubleType).to.eql(
        $primitiveType.create({
          qname: $qname.create('double', 'http://www.w3.org/2001/XMLSchema'),
          valueType: $doubleValue,
          facets: $facets.create([
            $enumerationFacet,
            $maxExclusiveFacet,
            $maxInclusiveFacet,
            $minExclusiveFacet,
            $minInclusiveFacet,
            $patternFacet
          ])
        })
      );
    });

  });

});
