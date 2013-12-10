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
  'sulfur/schema/qname',
  'sulfur/schema/type/simple/primitive',
  'sulfur/schema/type/simple/primitive/string',
  'sulfur/schema/type/simple/restricted',
  'sulfur/schema/validator/all',
  'sulfur/schema/validator/property',
  'sulfur/schema/value/simple/integer',
  'sulfur/schema/value/simple/pattern',
  'sulfur/schema/value/simple/string',
  'sulfur/schema/value/simple/whiteSpace'
], function (
    shared,
    EnumerationFacet,
    LengthFacet,
    MaxLengthFacet,
    MinLengthFacet,
    PatternFacet,
    WhiteSpaceFacet,
    Facets,
    QName,
    PrimitiveType,
    StringType,
    RestrictedType,
    AllValidator,
    PropertyValidator,
    IntegerValue,
    PatternValue,
    StringValue,
    WhiteSpaceValue
) {

  'use strict';

  var expect = shared.expect;

  describe('sulfur/schema/type/simple/primitive/string', function () {

    it("should be a sulfur/schema/type/simple/primitive", function () {
      expect(PrimitiveType.prototype).to.be.prototypeOf(StringType);
    });

    describe('.qname', function () {

      it("should return {http://www.w3.org/2001/XMLSchema}string", function () {
        expect(StringType.qname)
          .to.eql(QName.create('string', 'http://www.w3.org/2001/XMLSchema'));
      });


    });

    describe('.valueType', function () {

      it("should return sulfur/schema/value/simple/string", function () {
        expect(StringType.valueType).to.equal(StringValue);
      });

    });

    describe('.allowedFacets', function () {

      [
        EnumerationFacet,
        LengthFacet,
        MaxLengthFacet,
        MinLengthFacet,
        PatternFacet,
        WhiteSpaceFacet
      ].forEach(function (facet) {

        var qname = facet.qname;
        var name = qname.localName;

        it("should include sulfur/schema/facet/" + name, function () {
          expect(StringType.allowedFacets.getByQName(qname)).to.equal(facet);
        });

      });

    });

    describe('.createRestrictionValidator()', function () {

      it("should return a sulfur/schema/validator/all", function () {
        var restriction = RestrictedType.create(StringType,
          Facets.create([ LengthFacet.create(IntegerValue.create()) ]));
        var v = StringType.createRestrictionValidator(restriction);
        expect(AllValidator.prototype).to.be.prototypeOf(v);
      });

      it("should include this type's validator", function () {
        var restriction = RestrictedType.create(StringType,
          Facets.create([ LengthFacet.create(IntegerValue.create()) ]));
        var v = StringType.createRestrictionValidator(restriction);
        expect(v.validators)
          .to.include.something.eql(StringType.createValidator());
      });

      context("when the restriction has effective facet 'whiteSpace'", function () {

        it("should include the nested sulfur/schema/validator/all that would have been created if facet 'whiteSpace' is not defined when the value is 'preserve'", function () {
          var facet = LengthFacet.create(IntegerValue.create());
          var restriction = RestrictedType.create(StringType,
            Facets.create([ facet, WhiteSpaceFacet.create(WhiteSpaceValue.create('preserve')) ]));
          var restriction2 = RestrictedType.create(StringType,
            Facets.create([ facet ]));
          var v = StringType.createRestrictionValidator(restriction);
          var v2 = v.validators[1];
          expect(v2).to.eql(StringType.createRestrictionValidator(restriction2).validators[1]);
        });

        context("with value 'collapse'", function () {

          var facet;
          var restriction;
          var restrictionWithoutWhiteSpace;

          beforeEach(function () {
            facet = LengthFacet.create(IntegerValue.create());
            restriction = RestrictedType.create(StringType,
              Facets.create([ facet, WhiteSpaceFacet.create(WhiteSpaceValue.create('collapse')) ]));
            restrictionWithoutWhiteSpace = RestrictedType.create(StringType,
              Facets.create([ facet ]));
          });

          it("should include a sulfur/schema/validator/property", function () {
            var v = StringType.createRestrictionValidator(restriction);
            var v2 = v.validators[1];
            expect(PropertyValidator.prototype).to.be.prototypeOf(v2);
          });

          it("should use method 'collapseWhiteSpace'", function () {
            var v = StringType.createRestrictionValidator(restriction);
            var v2 = v.validators[1];
            expect(v2.propertyName).to.equal('collapseWhiteSpace');
          });

          it("should use the nested sulfur/schema/validator/all that whould have been created if facet 'whiteSpace' is not defined", function () {
            var v = StringType.createRestrictionValidator(restriction);
            var v2 = v.validators[1].validator;
            expect(v2).to.eql(
              StringType.createRestrictionValidator(
                restrictionWithoutWhiteSpace).validators[1]);
          });

        });

        context("with value 'replace'", function () {

          var facet;
          var restriction;
          var restrictionWithoutWhiteSpace;

          beforeEach(function () {
            facet = LengthFacet.create(IntegerValue.create());
            restriction = RestrictedType.create(StringType,
              Facets.create([ facet, WhiteSpaceFacet.create(WhiteSpaceValue.create('replace')) ]));
            restrictionWithoutWhiteSpace = RestrictedType.create(StringType,
              Facets.create([ facet ]));
          });

          it("should include a sulfur/schema/validator/property", function () {
            var v = StringType.createRestrictionValidator(restriction);
            var v2 = v.validators[1];
            expect(PropertyValidator.prototype).to.be.prototypeOf(v2);
          });

          it("should use method 'replaceWhiteSpace'", function () {
            var v = StringType.createRestrictionValidator(restriction);
            var v2 = v.validators[1];
            expect(v2.propertyName).to.equal('replaceWhiteSpace');
          });

          it("should use the nested sulfur/schema/validator/all that whould have been created if facet 'whiteSpace' is not defined", function () {
            var v = StringType.createRestrictionValidator(restriction);
            var v2 = v.validators[1].validator;
            expect(v2).to.eql(
              StringType.createRestrictionValidator(
                restrictionWithoutWhiteSpace).validators[1]);
          });

        });

      });

      context("when the restriction does not have effective facet 'whiteSpace'", function () {

        it("should include a sulfur/schema/validator/all", function () {
          var facet = LengthFacet.create(IntegerValue.create());
          var restriction = RestrictedType.create(StringType,
            Facets.create([ facet ]));
          var v = StringType.createRestrictionValidator(restriction);
          var v2 = v.validators[1];
          expect(AllValidator.prototype).to.be.prototypeOf(v2);
        });

        describe("the nesteded sulfur/schema/validator/all", function () {

          it("should include the validator of facet 'enumeration' when effective", function () {
            var facet = EnumerationFacet.create([ StringValue.create() ]);
            var restriction = RestrictedType.create(StringType,
              Facets.create([ facet ]));
            var v = StringType.createRestrictionValidator(restriction);
            expect(v.validators[1].validators)
              .to.include.something.eql(facet.createValidator());
          });

          it("should include the validator of facet 'length' when effective", function () {
            var facet = LengthFacet.create(IntegerValue.create());
            var restriction = RestrictedType.create(StringType,
              Facets.create([ facet ]));
            var v = StringType.createRestrictionValidator(restriction);
            expect(v.validators[1].validators)
              .to.include.something.eql(facet.createValidator());
          });

          it("should include the validator of facet 'maxLength' when effective", function () {
            var facet = MaxLengthFacet.create(IntegerValue.create());
            var restriction = RestrictedType.create(StringType,
              Facets.create([ facet ]));
            var v = StringType.createRestrictionValidator(restriction);
            expect(v.validators[1].validators)
              .to.include.something.eql(facet.createValidator());
          });

          it("should include the validator of facet 'minLength' when effective", function () {
            var facet = MinLengthFacet.create(IntegerValue.create());
            var restriction = RestrictedType.create(StringType,
              Facets.create([ facet ]));
            var v = StringType.createRestrictionValidator(restriction);
            expect(v.validators[1].validators)
              .to.include.something.eql(facet.createValidator());
          });

          it("should include the validator of facet 'pattern' when effective", function () {
            var baseFacet = PatternFacet.create([ PatternValue.create('\\d*') ]);
            var base = RestrictedType.create(StringType,
              Facets.create([ baseFacet ]));
            var facet = PatternFacet.create([ PatternValue.create('\\d+') ]);
            var restriction = RestrictedType.create(base,
              Facets.create([ facet ]));
            var v = StringType.createRestrictionValidator(restriction);
            expect(v.validators[1].validators)
              .to.include.something.eql(
                PatternFacet.createConjunctionValidator([ facet, baseFacet ]));
          });

        });

      });

    });

  });

});
