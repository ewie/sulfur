/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global describe, it */

define([
  'shared',
  'sulfur',
  'sulfur/schema/facet/mediaType',
  'sulfur/schema/facets',
  'sulfur/schema/qname',
  'sulfur/schema/type/simple/primitive',
  'sulfur/schema/type/simple/primitive/fileRef',
  'sulfur/schema/value/simple/fileRef'
], function (
    $shared,
    $sulfur,
    $mediaTypeFacet,
    $facets,
    $qname,
    $primitiveType,
    $fileRefType,
    $fileRefValue
) {

  'use strict';

  var expect = $shared.expect;

  describe('sulfur/schema/type/simple/primitive/fileRef', function () {

    it("should be a sulfur/schema/type/simple/primitive", function () {
      expect($fileRefType).to.eql(
        $primitiveType.create({
          qname: $qname.create('fileRef', $sulfur.getNamespaceURI()),
          valueType: $fileRefValue,
          facets: $facets.create([ $mediaTypeFacet ])
        })
      );
    });

  });

});
