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
  'sulfur/schema/facet/whiteSpace',
  'sulfur/schema/facets',
  'sulfur/schema/qname',
  'sulfur/schema/type/simple/primitive',
  'sulfur/schema/value/simple/string',
  'sulfur/schema/validator/all',
  'sulfur/schema/validator/property'
], function (
    EnumerationFacet,
    LengthFacet,
    MaxLengthFacet,
    MinLengthFacet,
    PatternFacet,
    WhiteSpaceFacet,
    Facets,
    QName,
    PrimitiveType,
    StringValue,
    AllValidator,
    PropertyValidator
) {

  'use strict';

  var validatableFacets = [
    EnumerationFacet,
    LengthFacet,
    MaxLengthFacet,
    MinLengthFacet,
    PatternFacet,
  ];

  var StringType = PrimitiveType.derive({

    createRestrictionValidator: (function () {

      function createFacetsValidator(restriction) {
        var facetValidators = validatableFacets.reduce(function (validators, allowedFacet) {
          var facets = allowedFacet.getEffectiveFacets(restriction);
          if (facets) {
            validators.push(allowedFacet.createConjunctionValidator(facets));
          }
          return validators;
        }, []);

        return AllValidator.create(facetValidators);
      }

      return function (restriction) {
        var subvalidator = createFacetsValidator(restriction);

        var whiteSpaceFacet = WhiteSpaceFacet.getEffectiveFacet(restriction);
        var value = whiteSpaceFacet ? whiteSpaceFacet.value.toString() : 'preserve';
        if (value !== 'preserve') {
          subvalidator = PropertyValidator.create(value + 'WhiteSpace', subvalidator);
        }

        return AllValidator.create([
          this.createValidator(),
          subvalidator
        ]);
      };

    }())

  });

  return StringType.create({
    qname: QName.create('string', 'http://www.w3.org/2001/XMLSchema'),
    valueType: StringValue,
    facets: Facets.create(validatableFacets.concat([ WhiteSpaceFacet ]))
  });

});
