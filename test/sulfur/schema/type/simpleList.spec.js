/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global beforeEach, describe, it */

define([
  'shared',
  'sulfur/schema/facet/enumeration',
  'sulfur/schema/facet/length',
  'sulfur/schema/facet/maxLength',
  'sulfur/schema/facet/minLength',
  'sulfur/schema/facet/pattern',
  'sulfur/schema/type/_faceted',
  'sulfur/schema/type/_simple',
  'sulfur/schema/type/simpleList',
  'sulfur/schema/validator/all',
  'sulfur/schema/validator/each'
], function (
    $shared,
    $enumerationFacet,
    $lengthFacet,
    $maxLengthFacet,
    $minLengthFacet,
    $patternFacet,
    $_facetedType,
    $_simpleType,
    $simpleListType,
    $allValidator,
    $eachValidator
) {

  'use strict';

  var expect = $shared.expect;

  describe('sulfur/schema/type/simpleList', function () {

    it("should be derived from sulfur/schema/type/_faceted", function () {
      expect($_facetedType).to.be.prototypeOf($simpleListType);
    });

    describe('.getLegalFacets()', function () {

      it("should include sulfur/schema/facet/enumeration", function () {
        expect($simpleListType.getLegalFacets()).to.include($enumerationFacet);
      });

      it("should include sulfur/schema/facet/length", function () {
        expect($simpleListType.getLegalFacets()).to.include($lengthFacet);
      });

      it("should include sulfur/schema/facet/maxLength", function () {
        expect($simpleListType.getLegalFacets()).to.include($maxLengthFacet);
      });

      it("should include sulfur/schema/facet/minLength", function () {
        expect($simpleListType.getLegalFacets()).to.include($minLengthFacet);
      });

      it("should include sulfur/schema/facet/pattern", function () {
        expect($simpleListType.getLegalFacets()).to.include($patternFacet);
      });

    });

    describe('#initialize()', function () {

      it("should initialize the value type", function () {
        var valueType = {};
        var type = $simpleListType.create(valueType);
        expect(type.getValueType()).to.equal(valueType);
      });

    });

    describe('#getValueType()', function () {

      it("should return the value type", function () {
        var valueType = {};
        var type = $simpleListType.create(valueType);
        expect(type.getValueType()).to.equal(valueType);
      });

    });

    describe('#validator()', function () {

      var valueType;

      beforeEach(function () {
        var itemValidator = {};
        valueType = {
          createValidator: function () {
            return itemValidator;
          }
        };
      });

      it("should return a validator/all with the facets validators and a validator/each using the value type validator", function () {
        var type = $simpleListType.create(valueType);
        var v = type.createValidator();
        expect(v).to.eql($allValidator.create([
          $_facetedType.prototype.createValidator.call(type),
          $eachValidator.create(valueType.createValidator())
        ]));
      });

    });

  });

});
