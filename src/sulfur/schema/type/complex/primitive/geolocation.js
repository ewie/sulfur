/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur',
  'sulfur/schema/qname',
  'sulfur/schema/type/complex/primitive',
  'sulfur/schema/value/complex/geolocation'
], function (sulfur, QName, PrimitiveType, GeolocationValue) {

  'use strict';

  return PrimitiveType.create({
    qname: QName.create('geolocation', sulfur.namespaceURI),
    valueType: GeolocationValue
  });

});
