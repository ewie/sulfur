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
    shared,
    sulfur,
    MediaTypeFacet,
    Facets,
    QName,
    PrimitiveType,
    FileRefType,
    FileRefValue
) {

  'use strict';

  var expect = shared.expect;

  describe('sulfur/schema/type/simple/primitive/fileRef', function () {

    it("should be a sulfur/schema/type/simple/primitive", function () {
      expect(FileRefType).to.eql(
        PrimitiveType.create({
          qname: QName.create('fileRef', sulfur.namespaceURI),
          valueType: FileRefValue,
          facets: Facets.create([ MediaTypeFacet ])
        })
      );
    });

  });

});
