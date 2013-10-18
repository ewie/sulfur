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
    $enumerationFacet,
    $lengthFacet,
    $maxLengthFacet,
    $minLengthFacet,
    $patternFacet,
    $whiteSpaceFacet,
    $facets,
    $qname,
    $primitiveType,
    $stringValue,
    $allValidator,
    $propertyValidator
) {

  'use strict';

  var validatableFacets = [
    $enumerationFacet,
    $lengthFacet,
    $maxLengthFacet,
    $minLengthFacet,
    $patternFacet,
  ];

  var $stringType = $primitiveType.derive({

    createRestrictionValidator: (function () {

      function createFacetsValidator(restriction) {
        var facetValidators = validatableFacets.reduce(function (validators, allowedFacet) {
          var facets = allowedFacet.getEffectiveFacets(restriction);
          if (facets) {
            validators.push(allowedFacet.createConjunctionValidator(facets));
          }
          return validators;
        }, []);

        return $allValidator.create(facetValidators);
      }

      return function (restriction) {
        var subvalidator = createFacetsValidator(restriction);

        var whiteSpaceFacet = $whiteSpaceFacet.getEffectiveFacet(restriction);
        var value = whiteSpaceFacet ? whiteSpaceFacet.getValue() : 'preserve';
        if (value !== 'preserve') {
          subvalidator = $propertyValidator.create(value + 'WhiteSpace', subvalidator);
        }

        return $allValidator.create([
          this.createValidator(),
          subvalidator
        ]);
      };

    }())

  });

  return $stringType.create({
    qname: $qname.create('string', 'http://www.w3.org/2001/XMLSchema'),
    valueType: $stringValue,
    facets: $facets.create(validatableFacets.concat([ $whiteSpaceFacet ]))
  });

});
