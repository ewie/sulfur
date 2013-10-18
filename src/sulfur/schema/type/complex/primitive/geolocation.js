/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur',
  'sulfur/schema/element',
  'sulfur/schema/elements',
  'sulfur/schema/facet/maxInclusive',
  'sulfur/schema/facet/minInclusive',
  'sulfur/schema/facets',
  'sulfur/schema/qname',
  'sulfur/schema/type/complex/primitive',
  'sulfur/schema/type/simple/primitive/double',
  'sulfur/schema/type/simple/restricted',
  'sulfur/schema/value/complex/geolocation',
  'sulfur/schema/value/simple/double'
], function (
    $sulfur,
    $element,
    $elements,
    $maxInclusiveFacet,
    $minInclusiveFacet,
    $facets,
    $qname,
    $primitiveType,
    $doubleType,
    $restrictedType,
    $geolocationValue,
    $doubleValue
) {

  'use strict';

  return $primitiveType.create(
    { qname: $qname.create('geolocation', $sulfur.getNamespaceURI()),
      valueType: $geolocationValue,
      elements: $elements.create(
        [ $element.create('longitude',
            $restrictedType.create($doubleType,
              $facets.create(
                [ $minInclusiveFacet.create($doubleValue.create(-180)),
                  $maxInclusiveFacet.create($doubleValue.create(180))
                ]))),
          $element.create('latitude',
            $restrictedType.create($doubleType,
              $facets.create(
                [ $minInclusiveFacet.create($doubleValue.create(-90)),
                  $maxInclusiveFacet.create($doubleValue.create(90))
                ])))
        ])
    });

});
