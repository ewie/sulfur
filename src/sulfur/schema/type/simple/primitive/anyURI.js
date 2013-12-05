/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/facet/enumeration',
  'sulfur/schema/facet/length',
  'sulfur/schema/facet/maxLength',
  'sulfur/schema/facet/minLength',
  'sulfur/schema/facet/pattern',
  'sulfur/schema/facets',
  'sulfur/schema/qname',
  'sulfur/schema/type/simple/primitive',
  'sulfur/schema/value/simple/uri'
], function (
    EnumerationFacet,
    LengthFacet,
    MaxLengthFacet,
    MinLengthFacet,
    PatternFacet,
    Facets,
    QName,
    PrimitiveType,
    UriValue
) {

  'use strict';

  return PrimitiveType.create({
    qname: QName.create('anyURI', 'http://www.w3.org/2001/XMLSchema'),
    valueType: UriValue,
    facets: Facets.create([
      EnumerationFacet,
      LengthFacet,
      MaxLengthFacet,
      MinLengthFacet,
      PatternFacet
    ])
  });

});
