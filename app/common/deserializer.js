/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/deserializer',
  'sulfur/schema/deserializer/facet/enumeration',
  'sulfur/schema/deserializer/facet/fractionDigits',
  'sulfur/schema/deserializer/facet/length',
  'sulfur/schema/deserializer/facet/maxExclusive',
  'sulfur/schema/deserializer/facet/maxInclusive',
  'sulfur/schema/deserializer/facet/maxLength',
  'sulfur/schema/deserializer/facet/mediaType',
  'sulfur/schema/deserializer/facet/minExclusive',
  'sulfur/schema/deserializer/facet/minInclusive',
  'sulfur/schema/deserializer/facet/minLength',
  'sulfur/schema/deserializer/facet/pattern',
  'sulfur/schema/deserializer/facet/totalDigits',
  'sulfur/schema/deserializer/facet/whiteSpace',
  'sulfur/schema/deserializer/type/complex',
  'sulfur/schema/deserializer/type/simple',
  'sulfur/schema/types'
], function (
    Deserializer,
    EnumerationFacetResolver,
    FractionDigitsFacetResolver,
    LengthFacetResolver,
    MaxExclusiveFacetResolver,
    MaxInclusiveFacetResolver,
    MaxLengthFacetResolver,
    MediaTypeFacetResolver,
    MinExclusiveFacetResolver,
    MinInclusiveFacetResolver,
    MinLengthFacetResolver,
    PatternFacetResolver,
    TotalDigitsFacetResolver,
    WhiteSpaceFacetResolver,
    ComplexTypeResolver,
    SimpleTypeResolver,
    types
) {

  'use strict';

  return Deserializer.create(
    [ SimpleTypeResolver.create(
        types.simpleTypes,
        [ EnumerationFacetResolver,
          FractionDigitsFacetResolver,
          LengthFacetResolver,
          MaxExclusiveFacetResolver,
          MaxInclusiveFacetResolver,
          MaxLengthFacetResolver,
          MediaTypeFacetResolver,
          MinExclusiveFacetResolver,
          MinInclusiveFacetResolver,
          MinLengthFacetResolver,
          PatternFacetResolver,
          TotalDigitsFacetResolver,
          WhiteSpaceFacetResolver
        ]),
      ComplexTypeResolver.create(types.complexTypes)
    ]);

});
