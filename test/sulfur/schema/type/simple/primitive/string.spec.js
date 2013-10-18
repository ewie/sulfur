/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global beforeEach, context, describe, it */

define([
  'shared',
  'sulfur/schema/facet/enumeration',
  'sulfur/schema/facet/length',
  'sulfur/schema/facet/maxLength',
  'sulfur/schema/facet/minLength',
  'sulfur/schema/facet/pattern',
  'sulfur/schema/facet/whiteSpace',
  'sulfur/schema/facets',
  'sulfur/schema/pattern',
  'sulfur/schema/qname',
  'sulfur/schema/type/simple/primitive',
  'sulfur/schema/type/simple/primitive/string',
  'sulfur/schema/type/simple/restricted',
  'sulfur/schema/value/simple/string',
  'sulfur/schema/validator/all',
  'sulfur/schema/validator/property'
], function (
    $shared,
    $enumerationFacet,
    $lengthFacet,
    $maxLengthFacet,
    $minLengthFacet,
    $patternFacet,
    $whiteSpaceFacet,
    $facets,
    $pattern,
    $qname,
    $primitiveType,
    $stringType,
    $restrictedType,
    $stringValue,
    $allValidator,
    $propertyValidator
) {

  'use strict';

  var expect = $shared.expect;

  describe('sulfur/schema/type/simple/primitive/string', function () {

    it("should be a sulfur/schema/type/simple/primitive", function () {
      expect($primitiveType.prototype).to.be.prototypeOf($stringType);
    });

    describe('.getQName()', function () {

      it("should return {http://www.w3.org/2001/XMLSchema}string", function () {
        expect($stringType.getQName())
          .to.eql($qname.create('string', 'http://www.w3.org/2001/XMLSchema'));
      });


    });

    describe('.getValueType()', function () {

      it("should return sulfur/schema/value/simple/string", function () {
        expect($stringType.getValueType()).to.equal($stringValue);
      });

    });

    describe('.getAllowedFacets()', function () {

      [
        $enumerationFacet,
        $lengthFacet,
        $maxLengthFacet,
        $minLengthFacet,
        $patternFacet,
        $whiteSpaceFacet
      ].forEach(function (facet) {

        var qname = facet.getQName();
        var name = qname.getLocalName();

        it("should include sulfur/schema/facet/" + name, function () {
          expect($stringType.getAllowedFacets().getFacet(qname)).to.equal(facet);
        });

      });

    });

    describe('.createRestrictionValidator()', function () {

      it("should return a sulfur/schema/validator/all", function () {
        var restriction = $restrictedType.create($stringType,
          $facets.create([ $lengthFacet.create(0) ]));
        var v = $stringType.createRestrictionValidator(restriction);
        expect($allValidator.prototype).to.be.prototypeOf(v);
      });

      it("should include this type's validator", function () {
        var restriction = $restrictedType.create($stringType,
          $facets.create([ $lengthFacet.create(0) ]));
        var v = $stringType.createRestrictionValidator(restriction);
        expect(v.getValidators())
          .to.include.something.eql($stringType.createValidator());
      });

      context("when the restriction has effective facet 'whiteSpace'", function () {

        it("should include the nested sulfur/schema/validator/all that would have been created if facet 'whiteSpace' is not defined when the value is 'preserve'", function () {
          var facet = $lengthFacet.create(0);
          var restriction = $restrictedType.create($stringType,
            $facets.create([ facet, $whiteSpaceFacet.create('preserve') ]));
          var restriction2 = $restrictedType.create($stringType,
            $facets.create([ facet ]));
          var v = $stringType.createRestrictionValidator(restriction);
          var v2 = v.getValidators()[1];
          expect(v2).to.eql($stringType.createRestrictionValidator(restriction2).getValidators()[1]);
        });

        context("with value 'collapse'", function () {

          var facet;
          var restriction;
          var restrictionWithoutWhiteSpace;

          beforeEach(function () {
            facet = $lengthFacet.create(0);
            restriction = $restrictedType.create($stringType,
              $facets.create([ facet, $whiteSpaceFacet.create('collapse') ]));
            restrictionWithoutWhiteSpace = $restrictedType.create($stringType,
              $facets.create([ facet ]));
          });

          it("should include a sulfur/schema/validator/property", function () {
            var v = $stringType.createRestrictionValidator(restriction);
            var v2 = v.getValidators()[1];
            expect($propertyValidator.prototype).to.be.prototypeOf(v2);
          });

          it("should use method 'collapseWhiteSpace'", function () {
            var v = $stringType.createRestrictionValidator(restriction);
            var v2 = v.getValidators()[1];
            expect(v2.getPropertyName()).to.equal('collapseWhiteSpace');
          });

          it("should use the nested sulfur/schema/validator/all that whould have been created if facet 'whiteSpace' is not defined", function () {
            var v = $stringType.createRestrictionValidator(restriction);
            var v2 = v.getValidators()[1].getValidator();
            expect(v2).to.eql(
              $stringType.createRestrictionValidator(
                restrictionWithoutWhiteSpace).getValidators()[1]);
          });

        });

        context("with value 'replace'", function () {

          var facet;
          var restriction;
          var restrictionWithoutWhiteSpace;

          beforeEach(function () {
            facet = $lengthFacet.create(0);
            restriction = $restrictedType.create($stringType,
              $facets.create([ facet, $whiteSpaceFacet.create('replace') ]));
            restrictionWithoutWhiteSpace = $restrictedType.create($stringType,
              $facets.create([ facet ]));
          });

          it("should include a sulfur/schema/validator/property", function () {
            var v = $stringType.createRestrictionValidator(restriction);
            var v2 = v.getValidators()[1];
            expect($propertyValidator.prototype).to.be.prototypeOf(v2);
          });

          it("should use method 'replaceWhiteSpace'", function () {
            var v = $stringType.createRestrictionValidator(restriction);
            var v2 = v.getValidators()[1];
            expect(v2.getPropertyName()).to.equal('replaceWhiteSpace');
          });

          it("should use the nested sulfur/schema/validator/all that whould have been created if facet 'whiteSpace' is not defined", function () {
            var v = $stringType.createRestrictionValidator(restriction);
            var v2 = v.getValidators()[1].getValidator();
            expect(v2).to.eql(
              $stringType.createRestrictionValidator(
                restrictionWithoutWhiteSpace).getValidators()[1]);
          });

        });

      });

      context("when the restriction does not have effective facet 'whiteSpace'", function () {

        it("should include a sulfur/schema/validator/all", function () {
          var facet = $lengthFacet.create(0);
          var restriction = $restrictedType.create($stringType,
            $facets.create([ facet ]));
          var v = $stringType.createRestrictionValidator(restriction);
          var v2 = v.getValidators()[1];
          expect($allValidator.prototype).to.be.prototypeOf(v2);
        });

        describe("the nesteded sulfur/schema/validator/all", function () {

          it("should include the validator of facet 'enumeration' when effective", function () {
            var facet = $enumerationFacet.create([ $stringValue.create() ]);
            var restriction = $restrictedType.create($stringType,
              $facets.create([ facet ]));
            var v = $stringType.createRestrictionValidator(restriction);
            expect(v.getValidators()[1].getValidators())
              .to.include.something.eql(facet.createValidator());
          });

          it("should include the validator of facet 'length' when effective", function () {
            var facet = $lengthFacet.create(0);
            var restriction = $restrictedType.create($stringType,
              $facets.create([ facet ]));
            var v = $stringType.createRestrictionValidator(restriction);
            expect(v.getValidators()[1].getValidators())
              .to.include.something.eql(facet.createValidator());
          });

          it("should include the validator of facet 'maxLength' when effective", function () {
            var facet = $maxLengthFacet.create(0);
            var restriction = $restrictedType.create($stringType,
              $facets.create([ facet ]));
            var v = $stringType.createRestrictionValidator(restriction);
            expect(v.getValidators()[1].getValidators())
              .to.include.something.eql(facet.createValidator());
          });

          it("should include the validator of facet 'minLength' when effective", function () {
            var facet = $minLengthFacet.create(0);
            var restriction = $restrictedType.create($stringType,
              $facets.create([ facet ]));
            var v = $stringType.createRestrictionValidator(restriction);
            expect(v.getValidators()[1].getValidators())
              .to.include.something.eql(facet.createValidator());
          });

          it("should include the validator of facet 'pattern' when effective", function () {
            var baseFacet = $patternFacet.create([ $pattern.create('\\d*') ]);
            var base = $restrictedType.create($stringType,
              $facets.create([ baseFacet ]));
            var facet = $patternFacet.create([ $pattern.create('\\d+') ]);
            var restriction = $restrictedType.create(base,
              $facets.create([ facet ]));
            var v = $stringType.createRestrictionValidator(restriction);
            expect(v.getValidators()[1].getValidators())
              .to.include.something.eql(
                $patternFacet.createConjunctionValidator([ facet, baseFacet ]));
          });

        });

      });

    });

  });

});
