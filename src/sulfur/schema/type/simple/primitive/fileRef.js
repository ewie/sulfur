/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur',
  'sulfur/schema/facet/mediaType',
  'sulfur/schema/facets',
  'sulfur/schema/qname',
  'sulfur/schema/type/simple/primitive',
  'sulfur/schema/value/simple/fileRef'
], function (
    sulfur,
    MediaTypeFacet,
    Facets,
    QName,
    PrimitiveType,
    FileRefValue
) {

  'use strict';

  return PrimitiveType.create({
    qname: QName.create('fileRef', sulfur.getNamespaceURI()),
    valueType: FileRefValue,
    facets: Facets.create([ MediaTypeFacet ])
  });

});
