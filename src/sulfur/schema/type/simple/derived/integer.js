/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/facet/fractionDigits',
  'sulfur/schema/facets',
  'sulfur/schema/qname',
  'sulfur/schema/type/simple/derived',
  'sulfur/schema/type/simple/primitive/decimal',
  'sulfur/schema/value/simple/integer'
], function (
    $fractionDigitsFacet,
    $facets,
    $qname,
    $derivedType,
    $decimalType,
    $integerValue
) {

  'use strict';

  return $derivedType.create({
    base: $decimalType,
    qname: $qname.create('integer', 'http://www.w3.org/2001/XMLSchema'),
    valueType: $integerValue,
    facets: $facets.create([ $fractionDigitsFacet.create(0) ])
  });

});
