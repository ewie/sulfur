/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global describe, it */

define([
  'shared',
  'sulfur/schema/element',
  'sulfur/schema/facet/maxInclusive',
  'sulfur/schema/facet/minInclusive',
  'sulfur/schema/facets',
  'sulfur/schema/type/simple/primitive/double',
  'sulfur/schema/type/simple/restricted',
  'sulfur/schema/value/complex',
  'sulfur/schema/value/complex/geolocation',
  'sulfur/schema/value/simple/double'
], function (
    shared,
    Element,
    MaxInclusiveFacet,
    MinInclusiveFacet,
    Facets,
    DoubleType,
    RestrictedType,
    ComplexValue,
    GeolocationValue,
    DoubleValue
) {

  'use strict';

  var expect = shared.expect;

  describe('sulfur/schema/value/complex/geolocation', function () {

    it("should be derived from sulfur/schema/value/complex", function () {
      expect(ComplexValue).to.be.prototypeOf(GeolocationValue);
    });

    describe('.allowedElement', function () {

      it("should contain element 'latitude'", function () {
        var e = GeolocationValue.allowedElements.toArray()[0];
        var x = Element.create('latitude',
          RestrictedType.create(DoubleType,
            Facets.create(
              [ MaxInclusiveFacet.create(DoubleValue.create(90)),
                MinInclusiveFacet.create(DoubleValue.create(-90))
              ])));
        expect(e).to.eql(x);
      });

      it("should contain element 'longitude'", function () {
        var e = GeolocationValue.allowedElements.toArray()[1];
        var x = Element.create('longitude',
          RestrictedType.create(DoubleType,
            Facets.create(
              [ MaxInclusiveFacet.create(DoubleValue.create(180)),
                MinInclusiveFacet.create(DoubleValue.create(-180))
              ])));
        expect(e).to.eql(x);
      });

    });

  });

});
