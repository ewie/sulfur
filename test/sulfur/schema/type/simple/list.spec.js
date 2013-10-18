/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global afterEach, beforeEach, context, describe, it */

define([
  'shared',
  'sulfur/schema/facet/enumeration',
  'sulfur/schema/facet/length',
  'sulfur/schema/facet/maxLength',
  'sulfur/schema/facet/minLength',
  'sulfur/schema/facet/pattern',
  'sulfur/schema/facets',
  'sulfur/schema/pattern',
  'sulfur/schema/type/simple/list',
  'sulfur/schema/type/simple/restricted',
  'sulfur/schema/value/simpleList',
  'sulfur/schema/validator/all',
  'sulfur/schema/validator/each',
  'sulfur/schema/validator/property'
], function (
    shared,
    EnumerationFacet,
    LengthFacet,
    MaxLengthFacet,
    MinLengthFacet,
    PatternFacet,
    Facets,
    Pattern,
    ListType,
    RestrictedType,
    SimpleListValue,
    AllValidator,
    EachValidator,
    PropertyValidator
) {

  'use strict';

  var expect = shared.expect;
  var sinon = shared.sinon;
  var returns = shared.returns;

  describe('sulfur/schema/type/simple/list', function () {

    var sandbox;

    beforeEach(function () {
      sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
      sandbox.restore();
    });

    describe('#getItemType()', function () {

      it("should return the item type", function () {
        var itemType = { getValueType: returns({}) };
        var type = ListType.create(itemType);
        expect(type.getItemType()).to.equal(itemType);
      });

    });

    describe('#getValueType()', function () {

      it("should return a sulfur/schema/value/simpleList using the item type's value type", function () {
        var itemType = { getValueType: returns({}) };
        var listType = ListType.create(itemType);
        var listValue = listType.getValueType();
        expect(SimpleListValue).to.be.prototypeOf(listValue);
        expect(listValue.getItemValueType()).to.equal(itemType.getValueType());
      });

      it("should return the same object on future calls", function () {
        var itemType = { getValueType: returns({}) };
        var listType = ListType.create(itemType);
        expect(listType.getValueType()).to.equal(listType.getValueType());
      });

    });

    describe('#getAllowedFacets()', function () {

      [
        EnumerationFacet,
        LengthFacet,
        MaxLengthFacet,
        MinLengthFacet,
        PatternFacet
      ].forEach(function (facet) {

        var qname = facet.getQName();

        it("should include facet " + qname, function () {
          var itemType = { getValueType: returns({}) };
          var type = ListType.create(itemType);
          expect(type.getAllowedFacets().getFacet(qname)).to.equal(facet);
        });

      });

    });

    describe('#isRestrictionOf()', function () {

      it("should return true when the other type is the same sulfur/schema/type/simple/list", function () {
        var itemType = { getValueType: returns({}) };
        var type = ListType.create(itemType);
        expect(type.isRestrictionOf(type)).to.be.true;
      });

      context("when sulfur/schema/type/simple/primitive#isRestrictionOf() returns false", function () {

        var itemType;
        var otherItemType;
        var type;
        var other;

        beforeEach(function () {
          itemType = {
            isRestrictionOf: function () {},
            getValueType: returns({})
          };
          otherItemType = { getValueType: returns({}) };
          type = ListType.create(itemType);
          other = ListType.create(otherItemType);
        });

        it("should return true when the item type is a restriction of the other item type", function () {
          var spy = sinon.stub(itemType, 'isRestrictionOf').returns(true);
          var r = type.isRestrictionOf(other);
          expect(spy)
            .to.be.calledWith(sinon.match.same(otherItemType))
            .to.have.returned(r);
        });

        it("should return true when the item type is not a restriction of the other item type", function () {
          var spy = sinon.stub(itemType, 'isRestrictionOf').returns(false);
          var r = type.isRestrictionOf(other);
          expect(spy)
            .to.be.calledWith(sinon.match.same(otherItemType))
            .to.have.returned(r);
        });

      });

    });

    describe('#createValidator()', function () {

      var type;

      beforeEach(function () {
        var itemType = {
          createValidator: returns({ validate: returns() }),
          getValueType: returns({})
        };
        type = ListType.create(itemType);
      });

      it("should return a sulfur/schema/validator/property on 'toArray' using a sulfur/schema/validator/each using the item type's validator", function () {
        var v = type.createValidator();
        expect(v).to.eql(
          PropertyValidator.create('toArray',
            EachValidator.create(type.getItemType().createValidator())));
      });

    });

    describe('#createRestrictionValidator()', function () {

      var type;

      beforeEach(function () {
        var itemType = {
          createValidator: returns({ validate: returns() }),
          getValueType: returns({})
        };
        type = ListType.create(itemType);
      });

      it("should return a sulfur/schema/validator/all", function () {
        var restriction = RestrictedType.create(type,
          Facets.create([ LengthFacet.create(0) ]));
        var v = type.createRestrictionValidator(restriction);
        expect(AllValidator.prototype).to.be.prototypeOf(v);
      });

      it("should include this type's validator", function () {
        var restriction = RestrictedType.create(type,
          Facets.create([ LengthFacet.create(0) ]));
        var v = type.createRestrictionValidator(restriction);
        expect(v.getValidators())
          .to.include.something.eql(type.createValidator());
      });

      it("should include the validator of facet 'enumeration' when effective", function () {
        var facet = EnumerationFacet.create([ SimpleListValue.create() ]);
        var restriction = RestrictedType.create(type,
          Facets.create([ facet ]));
        var v = type.createRestrictionValidator(restriction);
        expect(v.getValidators())
          .to.include.something.eql(facet.createValidator());
      });

      it("should include the validator of facet 'length' when effective", function () {
        var facet = LengthFacet.create(0);
        var restriction = RestrictedType.create(type,
          Facets.create([ facet ]));
        var v = type.createRestrictionValidator(restriction);
        expect(v.getValidators())
          .to.include.something.eql(facet.createValidator());
      });

      it("should include the validator of facet 'maxLength' when effective", function () {
        var facet = MaxLengthFacet.create(0);
        var restriction = RestrictedType.create(type,
          Facets.create([ facet ]));
        var v = type.createRestrictionValidator(restriction);
        expect(v.getValidators())
          .to.include.something.eql(facet.createValidator());
      });

      it("should include the validator of facet 'minLength' when effective", function () {
        var facet = MinLengthFacet.create(0);
        var restriction = RestrictedType.create(type,
          Facets.create([ facet ]));
        var v = type.createRestrictionValidator(restriction);
        expect(v.getValidators())
          .to.include.something.eql(facet.createValidator());
      });

      it("should include the validator of facet 'pattern' when effective", function () {
        var baseFacet = PatternFacet.create([ Pattern.create('\\d*') ]);
        var base = RestrictedType.create(type,
          Facets.create([ baseFacet ]));
        var facet = PatternFacet.create([ Pattern.create('\\d+') ]);
        var restriction = RestrictedType.create(base,
          Facets.create([ facet ]));
        var v = type.createRestrictionValidator(restriction);
        expect(v.getValidators())
          .to.include.something.eql(
            PatternFacet.createConjunctionValidator([ facet, baseFacet ]));
      });

    });

  });

});
