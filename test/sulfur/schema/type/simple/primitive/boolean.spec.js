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
  'sulfur/schema/facet/pattern',
  'sulfur/schema/facets',
  'sulfur/schema/qname',
  'sulfur/schema/type/simple/primitive',
  'sulfur/schema/type/simple/primitive/boolean',
  'sulfur/schema/value/simple/boolean'
], function (
    shared,
    PatternFacet,
    Facets,
    QName,
    PrimitiveType,
    BooleanType,
    BooleanValue
) {

  'use strict';

  var expect = shared.expect;

  describe('sulfur/schema/type/simple/primitive/boolean', function () {

    it("should be a sulfur/schema/type/simple/primitive", function () {
      expect(BooleanType).to.eql(
        PrimitiveType.create({
          qname: QName.create('boolean', 'http://www.w3.org/2001/XMLSchema'),
          valueType: BooleanValue,
          facets: Facets.create([ PatternFacet ])
        })
      );
    });

  });

});
