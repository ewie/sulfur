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
  'sulfur/schema/element',
  'sulfur/schema/elements',
  'sulfur/schema/facet/maxExclusive',
  'sulfur/schema/facet/maxInclusive',
  'sulfur/schema/facet/minExclusive',
  'sulfur/schema/facet/minInclusive',
  'sulfur/schema/facets',
  'sulfur/schema/qname',
  'sulfur/schema/type/complex/primitive',
  'sulfur/schema/type/complex/primitive/geolocation',
  'sulfur/schema/type/simple/primitive/double',
  'sulfur/schema/type/simple/restricted',
  'sulfur/schema/value/complex/geolocation',
  'sulfur/schema/value/simple/double'
], function (
    $shared,
    $sulfur,
    $element,
    $elements,
    $maxExclusiveFacet,
    $maxInclusiveFacet,
    $minExclusiveFacet,
    $minInclusiveFacet,
    $facets,
    $qname,
    $primitiveType,
    $geolocationType,
    $doubleType,
    $restrictedType,
    $geolocationValue,
    $doubleValue
) {

  'use strict';

  var expect = $shared.expect;

  describe('sulfur/schema/type/complex/primitive/geolocation', function () {

    it("should be a sulfur/schema/type/complex/primitive", function () {
      expect($geolocationType).to.eql(
        $primitiveType.create(
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
          }));
    });

  });

});
