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
  'sulfur/schema/facet/maxInclusive',
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
    shared,
    sulfur,
    Element,
    Elements,
    MaxInclusiveFacet,
    MinInclusiveFacet,
    Facets,
    QName,
    PrimitiveType,
    GeolocationType,
    DoubleType,
    RestrictedType,
    GeolocationValue,
    DoubleValue
) {

  'use strict';

  var expect = shared.expect;

  describe('sulfur/schema/type/complex/primitive/geolocation', function () {

    it("should be a sulfur/schema/type/complex/primitive", function () {
      expect(GeolocationType).to.eql(
        PrimitiveType.create(
          { qname: QName.create('geolocation', sulfur.namespaceURI),
            valueType: GeolocationValue,
            elements: Elements.create(
              [ Element.create('longitude',
                  RestrictedType.create(DoubleType,
                    Facets.create(
                      [ MinInclusiveFacet.create(DoubleValue.create(-180)),
                        MaxInclusiveFacet.create(DoubleValue.create(180))
                      ]))),
                Element.create('latitude',
                  RestrictedType.create(DoubleType,
                    Facets.create(
                      [ MinInclusiveFacet.create(DoubleValue.create(-90)),
                        MaxInclusiveFacet.create(DoubleValue.create(90))
                      ])))
              ])
          }));
    });

  });

});
