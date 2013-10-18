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
    shared,
    EnumerationFacet,
    LengthFacet,
    MaxLengthFacet,
    MinLengthFacet,
    PatternFacet,
    WhiteSpaceFacet,
    Facets,
    Pattern,
    QName,
    PrimitiveType,
    StringType,
    RestrictedType,
    StringValue,
    AllValidator,
    PropertyValidator
) {

  'use strict';

  var expect = shared.expect;

  describe('sulfur/schema/type/simple/primitive/string', function () {

    it("should be a sulfur/schema/type/simple/primitive", function () {
      expect(PrimitiveType.prototype).to.be.prototypeOf(StringType);
    });

    describe('.getQName()', function () {

      it("should return {http://www.w3.org/2001/XMLSchema}string", function () {
        expect(StringType.getQName())
          .to.eql(QName.create('string', 'http://www.w3.org/2001/XMLSchema'));
      });


    });

    describe('.getValueType()', function () {

      it("should return sulfur/schema/value/simple/string", function () {
        expect(StringType.getValueType()).to.equal(StringValue);
      });

    });

    describe('.getAllowedFacets()', function () {

      [
        EnumerationFacet,
        LengthFacet,
        MaxLengthFacet,
        MinLengthFacet,
        PatternFacet,
        WhiteSpaceFacet
      ].forEach(function (facet) {

        var qname = facet.getQName();
        var name = qname.getLocalName();

        it("should include sulfur/schema/facet/" + name, function () {
          expect(StringType.getAllowedFacets().getFacet(qname)).to.equal(facet);
        });

      });

    });

    describe('.createRestrictionValidator()', function () {

      it("should return a sulfur/schema/validator/all", function () {
        var restriction = RestrictedType.create(StringType,
          Facets.create([ LengthFacet.create(0) ]));
        var v = StringType.createRestrictionValidator(restriction);
        expect(AllValidator.prototype).to.be.prototypeOf(v);
      });

      it("should include this type's validator", function () {
        var restriction = RestrictedType.create(StringType,
          Facets.create([ LengthFacet.create(0) ]));
        var v = StringType.createRestrictionValidator(restriction);
        expect(v.getValidators())
          .to.include.something.eql(StringType.createValidator());
      });

      context("when the restriction has effective facet 'whiteSpace'", function () {

        it("should include the nested sulfur/schema/validator/all that would have been created if facet 'whiteSpace' is not defined when the value is 'preserve'", function () {
          var facet = LengthFacet.create(0);
          var restriction = RestrictedType.create(StringType,
            Facets.create([ facet, WhiteSpaceFacet.create('preserve') ]));
          var restriction2 = RestrictedType.create(StringType,
            Facets.create([ facet ]));
          var v = StringType.createRestrictionValidator(restriction);
          var v2 = v.getValidators()[1];
          expect(v2).to.eql(StringType.createRestrictionValidator(restriction2).getValidators()[1]);
        });

        context("with value 'collapse'", function () {

          var facet;
          var restriction;
          var restrictionWithoutWhiteSpace;

          beforeEach(function () {
            facet = LengthFacet.create(0);
            restriction = RestrictedType.create(StringType,
              Facets.create([ facet, WhiteSpaceFacet.create('collapse') ]));
            restrictionWithoutWhiteSpace = RestrictedType.create(StringType,
              Facets.create([ facet ]));
          });

          it("should include a sulfur/schema/validator/property", function () {
            var v = StringType.createRestrictionValidator(restriction);
            var v2 = v.getValidators()[1];
            expect(PropertyValidator.prototype).to.be.prototypeOf(v2);
          });

          it("should use method 'collapseWhiteSpace'", function () {
            var v = StringType.createRestrictionValidator(restriction);
            var v2 = v.getValidators()[1];
            expect(v2.getPropertyName()).to.equal('collapseWhiteSpace');
          });

          it("should use the nested sulfur/schema/validator/all that whould have been created if facet 'whiteSpace' is not defined", function () {
            var v = StringType.createRestrictionValidator(restriction);
            var v2 = v.getValidators()[1].getValidator();
            expect(v2).to.eql(
              StringType.createRestrictionValidator(
                restrictionWithoutWhiteSpace).getValidators()[1]);
          });

        });

        context("with value 'replace'", function () {

          var facet;
          var restriction;
          var restrictionWithoutWhiteSpace;

          beforeEach(function () {
            facet = LengthFacet.create(0);
            restriction = RestrictedType.create(StringType,
              Facets.create([ facet, WhiteSpaceFacet.create('replace') ]));
            restrictionWithoutWhiteSpace = RestrictedType.create(StringType,
              Facets.create([ facet ]));
          });

          it("should include a sulfur/schema/validator/property", function () {
            var v = StringType.createRestrictionValidator(restriction);
            var v2 = v.getValidators()[1];
            expect(PropertyValidator.prototype).to.be.prototypeOf(v2);
          });

          it("should use method 'replaceWhiteSpace'", function () {
            var v = StringType.createRestrictionValidator(restriction);
            var v2 = v.getValidators()[1];
            expect(v2.getPropertyName()).to.equal('replaceWhiteSpace');
          });

          it("should use the nested sulfur/schema/validator/all that whould have been created if facet 'whiteSpace' is not defined", function () {
            var v = StringType.createRestrictionValidator(restriction);
            var v2 = v.getValidators()[1].getValidator();
            expect(v2).to.eql(
              StringType.createRestrictionValidator(
                restrictionWithoutWhiteSpace).getValidators()[1]);
          });

        });

      });

      context("when the restriction does not have effective facet 'whiteSpace'", function () {

        it("should include a sulfur/schema/validator/all", function () {
          var facet = LengthFacet.create(0);
          var restriction = RestrictedType.create(StringType,
            Facets.create([ facet ]));
          var v = StringType.createRestrictionValidator(restriction);
          var v2 = v.getValidators()[1];
          expect(AllValidator.prototype).to.be.prototypeOf(v2);
        });

        describe("the nesteded sulfur/schema/validator/all", function () {

          it("should include the validator of facet 'enumeration' when effective", function () {
            var facet = EnumerationFacet.create([ StringValue.create() ]);
            var restriction = RestrictedType.create(StringType,
              Facets.create([ facet ]));
            var v = StringType.createRestrictionValidator(restriction);
            expect(v.getValidators()[1].getValidators())
              .to.include.something.eql(facet.createValidator());
          });

          it("should include the validator of facet 'length' when effective", function () {
            var facet = LengthFacet.create(0);
            var restriction = RestrictedType.create(StringType,
              Facets.create([ facet ]));
            var v = StringType.createRestrictionValidator(restriction);
            expect(v.getValidators()[1].getValidators())
              .to.include.something.eql(facet.createValidator());
          });

          it("should include the validator of facet 'maxLength' when effective", function () {
            var facet = MaxLengthFacet.create(0);
            var restriction = RestrictedType.create(StringType,
              Facets.create([ facet ]));
            var v = StringType.createRestrictionValidator(restriction);
            expect(v.getValidators()[1].getValidators())
              .to.include.something.eql(facet.createValidator());
          });

          it("should include the validator of facet 'minLength' when effective", function () {
            var facet = MinLengthFacet.create(0);
            var restriction = RestrictedType.create(StringType,
              Facets.create([ facet ]));
            var v = StringType.createRestrictionValidator(restriction);
            expect(v.getValidators()[1].getValidators())
              .to.include.something.eql(facet.createValidator());
          });

          it("should include the validator of facet 'pattern' when effective", function () {
            var baseFacet = PatternFacet.create([ Pattern.create('\\d*') ]);
            var base = RestrictedType.create(StringType,
              Facets.create([ baseFacet ]));
            var facet = PatternFacet.create([ Pattern.create('\\d+') ]);
            var restriction = RestrictedType.create(base,
              Facets.create([ facet ]));
            var v = StringType.createRestrictionValidator(restriction);
            expect(v.getValidators()[1].getValidators())
              .to.include.something.eql(
                PatternFacet.createConjunctionValidator([ facet, baseFacet ]));
          });

        });

      });

    });

  });

});
