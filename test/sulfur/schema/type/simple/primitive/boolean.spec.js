/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global describe, it */

define([
  'shared',
  'sulfur/schema/facet/pattern',
  'sulfur/schema/facets',
  'sulfur/schema/qname',
  'sulfur/schema/type/simple/primitive',
  'sulfur/schema/type/simple/primitive/boolean',
  'sulfur/schema/value/simple/boolean'
], function (
    $shared,
    $patternFacet,
    $facets,
    $qname,
    $primitiveType,
    $booleanType,
    $booleanValue
) {

  'use strict';

  var expect = $shared.expect;

  describe('sulfur/schema/type/simple/primitive/boolean', function () {

    it("should be a sulfur/schema/type/simple/primitive", function () {
      expect($booleanType).to.eql(
        $primitiveType.create({
          qname: $qname.create('boolean', 'http://www.w3.org/2001/XMLSchema'),
          valueType: $booleanValue,
          facets: $facets.create([ $patternFacet ])
        })
      );
    });

  });

});
