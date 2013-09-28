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
  'sulfur/schema/pattern',
  'sulfur/schema/type/_faceted',
  'sulfur/schema/type/simpleList',
  'sulfur/schema/type/string',
  'sulfur/schema/validator/all',
  'sulfur/schema/validator/each',
  'sulfur/schema/validator/equal',
  'sulfur/schema/validator/property',
  'sulfur/schema/validator/prototype',
  'sulfur/schema/value/simpleList',
  'sulfur/schema/value/string'
], function (
    $shared,
    $enumerationFacet,
    $lengthFacet,
    $maxLengthFacet,
    $minLengthFacet,
    $patternFacet,
    $pattern,
    $_facetedType,
    $simpleListType,
    $stringType,
    $allValidator,
    $eachValidator,
    $equalValidator,
    $propertyValidator,
    $prototypeValidator,
    $simpleListValue,
    $stringValue
) {

  'use strict';

  var expect = $shared.expect;
  var bind = $shared.bind;
  var sinon = $shared.sinon;

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

      it("should reject a type which is not a sulfur/schema/type/_simple or sulfur/schema/type/simpleList", function () {
        expect(bind($simpleListType, 'create', {}))
          .to.throw("expecting a sulfur/schema/type/_simple as item type " +
            "or a sulfur/schema/type/simpleList as base type");
      });

      it("should initialize the item type when the type is a sulfur/schema/type/_simple", function () {
        var itemType = $stringType.create();
        var type = $simpleListType.create(itemType);
        expect(type.getItemType()).to.equal(itemType);
      });

      context("when the type is a sulfur/schema/type/simpleList", function () {

        var sandbox;

        beforeEach(function () {
          sandbox = sinon.sandbox.create();
        });

        afterEach(function () {
          sandbox.restore();
        });

        it("should initialize the base type", function () {
          var itemType = $stringType.create();
          var base = $simpleListType.create(itemType);
          var type = $simpleListType.create(base);
          expect(type.getBase()).to.equal(base);
        });

        it("should call sulfur/schema/type/_faceted#initialize() with the given facets", function () {
          var spy = sandbox.spy($_facetedType.prototype, 'initialize');
          var itemType = $stringType.create();
          var base = $simpleListType.create(itemType);
          var facets = [];
          var type = $simpleListType.create(base, facets);
          expect(spy)
            .to.be.calledOn(type)
            .to.be.calledWith(sinon.match.same(facets));
        });

      });

    });

    describe('#getBase()', function () {

      it("should return the base type when derived", function () {
        var itemType = $stringType.create();
        var type = $simpleListType.create(itemType);
        expect(type.getBase()).to.be.undefined;
      });

      it("should return undefined when not derived", function () {
        var itemType = $stringType.create();
        var base = $simpleListType.create(itemType);
        var type = $simpleListType.create(base);
        expect(type.getBase()).to.equal(base);
      });

    });

    describe('#getItemType()', function () {

      it("should return the item type", function () {
        var itemType = $stringType.create();
        var type = $simpleListType.create(itemType);
        expect(type.getItemType()).to.equal(itemType);
      });

      it("should return undefined when derived", function () {
        var itemType = $stringType.create();
        var base = $simpleListType.create(itemType);
        var type = $simpleListType.create(base);
        expect(type.getItemType()).to.be.undefined;
      });

    });

    describe('#getValueType()', function () {

      it("should return the item type when not derived", function () {
        var itemType = $stringType.create();
        var type = $simpleListType.create(itemType);
        expect(type.getValueType()).to.equal(itemType);
      });

      it("should return the base's #getValueType() when derived", function () {
        var itemType = $stringType.create();
        var base = $simpleListType.create(itemType);
        var type = $simpleListType.create(base);
        expect(type.getValueType()).to.equal(base.getValueType());
      });

    });

    describe('#createValidator()', function () {

      it("should return a validator/all using a validator/prototype matching sulfur/schema/value/simpleList, and a validator/property with 'getItemValueType' using a validator/equal matching #getItemType()#getValueType() when not derived", function () {
        var itemType = $stringType.create();
        var type = $simpleListType.create(itemType);
        var v = type.createValidator();
        expect(v).to.eql(
          $allValidator.create([
            $prototypeValidator.create($simpleListValue.prototype),
            $propertyValidator.create(
              'getItemValueType',
              $equalValidator.create(type.getItemType().getValueType())
            )
          ])
        );
      });

      context("when derived", function () {

        it("should return a validator/all using the base type's validator, and the facet validators", function () {
          var itemType = $stringType.create();
          var base = $simpleListType.create(itemType);
          var type = $simpleListType.create(base);
          var v = type.createValidator();
          expect(v).to.eql(
            $allValidator.create([
              base.createValidator(),
              $_facetedType.prototype.createValidator.call(type)
            ])
          );
        });

        it("should use a validator/property with 'toString' wrapping the validator of facet 'pattern' when defined", function () {
          var itemType = $stringType.create();
          var base = $simpleListType.create(itemType);
          var facets = [
            $patternFacet.create([ $pattern.create('') ])
          ];
          var type = $simpleListType.create(base, facets);
          var v = type.createValidator();
          expect(v).to.eql(
            $allValidator.create([
              base.createValidator(),
              $allValidator.create([
                $propertyValidator.create(
                  'toString',
                  facets[0].createValidator()
                )
              ])
            ])
          );
        });

        it("should use a validator/property with 'toArray' using a validator/each wrapping the validator of facet 'enumeration' when defined", function () {
          var itemType = $stringType.create();
          var base = $simpleListType.create(itemType);
          var facets = [
            $enumerationFacet.create([ $stringValue.create() ])
          ];
          var type = $simpleListType.create(base, facets);
          var v = type.createValidator();
          expect(v).to.eql(
            $allValidator.create([
              base.createValidator(),
              $allValidator.create([
                $propertyValidator.create(
                  'toArray',
                  $eachValidator.create(facets[0].createValidator())
                )
              ])
            ])
          );
        });

      });

    });

  });

});
