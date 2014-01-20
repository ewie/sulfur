/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/element',
  'sulfur/schema/elements',
  'sulfur/schema/facet/maxInclusive',
  'sulfur/schema/facet/minInclusive',
  'sulfur/schema/facets',
  'sulfur/schema/type/simple/primitive/double',
  'sulfur/schema/type/simple/restricted',
  'sulfur/schema/value/complex',
  'sulfur/schema/value/simple/double'
], function (
    Element,
    Elements,
    MaxInclusiveFacet,
    MinInclusiveFacet,
    Facets,
    DoubleType,
    RestrictedType,
    ComplexValue,
    DoubleValue
) {

  'use strict';

  var allowedElements = Elements.create([

    Element.create('latitude',
      RestrictedType.create(DoubleType,
        Facets.create(
          [ MaxInclusiveFacet.create(DoubleValue.create(90)),
            MinInclusiveFacet.create(DoubleValue.create(-90))
          ]))),

    Element.create('longitude',
      RestrictedType.create(DoubleType,
        Facets.create(
          [ MaxInclusiveFacet.create(DoubleValue.create(180)),
            MinInclusiveFacet.create(DoubleValue.create(-180))
          ])))

  ]);

  return ComplexValue.clone({

    get allowedElements() { return allowedElements }

  });

});
