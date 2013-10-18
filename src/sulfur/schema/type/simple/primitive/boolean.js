/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/facet/pattern',
  'sulfur/schema/facets',
  'sulfur/schema/qname',
  'sulfur/schema/type/simple/primitive',
  'sulfur/schema/value/simple/boolean'
], function (
    $patternFacet,
    $facets,
    $qname,
    $primitiveType,
    $booleanValue
) {

  'use strict';

  return $primitiveType.create({
    qname: $qname.create('boolean', 'http://www.w3.org/2001/XMLSchema'),
    valueType: $booleanValue,
    facets: $facets.create([ $patternFacet ])
  });

});
