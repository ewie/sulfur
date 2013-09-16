/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global afterEach, beforeEach, context, describe, it */

define([
  'shared',
  'sulfur/schema/integer',
  'sulfur/schema/type/decimal',
  'sulfur/schema/type/integer',
  'sulfur/schema/pattern',
  'sulfur/schema/validators'
], function (
    $shared,
    $integer,
    $decimalType,
    $integerType,
    $pattern,
    $validators
) {

  'use strict';

  var expect = $shared.expect;
  var sinon = $shared.sinon;

  describe('sulfur/schema/type/integer', function () {

    it("should be derived from sulfur/schema/type/decimal", function () {
      expect($decimalType).to.be.prototypeOf($integerType);
    });

    describe('.validateFacets()', function () {

      var sandbox;

      beforeEach(function () {
        sandbox = sinon.sandbox.create();
      });

      afterEach(function () {
        sandbox.restore();
      });

      it("should call sulfur/schema/decimal.validateFacets()", function () {
        var decimalValidateFacetsSpy = sandbox.stub($decimalType, 'validateFacets').returns(false);
        var facets = {};
        var errors = [];
        var result = $integerType.validateFacets(facets, errors);
        expect(decimalValidateFacetsSpy)
          .to.be.calledOn($decimalType)
          .to.be.calledWith(
            sinon.match.same(facets),
            sinon.match.same(errors))
          .to.have.returned(result);
      });

      context("with facet `enumeration`", function () {

        it("should accept an array of sulfur/schema/integer values", function () {
          expect($integerType.validateFacets({
            enumeration: [ $integer.parse('1') ]
          })).to.be.true;
        });

        context("with no values", function () {

          it("should reject", function () {
            expect($integerType.validateFacets({ enumeration: [] })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $integerType.validateFacets({ enumeration: [] }, errors);
            expect(errors).to.include.something.eql([
              'enumeration',
              "must specify at least one sulfur/schema/integer value"
            ]);
          });

        });

        context("with a non-integer value", function () {

          it("should reject", function () {
            expect($integerType.validateFacets({ enumeration: [1] })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $integerType.validateFacets({ enumeration: [1] }, errors);
            expect(errors).to.include.something.eql([
              'enumeration',
              "must specify only sulfur/schema/integer values"
            ]);
          });

        });

      });

      context("with facet `fractionDigits`", function () {

        it("should accept zero", function () {
          expect($integerType.validateFacets({ fractionDigits: 0 })).to.be.true;
        });

        context("with a value other than zero", function () {

          it("should reject", function () {
            expect($integerType.validateFacets({ fractionDigits: 1 })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $integerType.validateFacets({ fractionDigits: 1 }, errors);
            expect(errors).to.include.something.eql([ 'fractionDigits', "must be zero" ]);
          });

        });

      });

      context("with facet `maxExclusive`", function () {

        it("should accept a sulfur/schema/integer value", function () {
          expect($integerType.validateFacets({
            maxExclusive: $integer.parse('3')
          })).to.be.true;
        });

        context("with a non-integer value", function () {

          it("should reject", function () {
            expect($integerType.validateFacets({ maxExclusive: 3 })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $integerType.validateFacets({ maxExclusive: 3 }, errors);
            expect(errors).to.include.something.eql([
              'maxExclusive',
              "must be a sulfur/schema/integer value"
            ]);
          });

        });

      });

      context("with facet `maxInclusive`", function () {

        it("should accept a sulfur/schema/integer value", function () {
          expect($integerType.validateFacets({
            maxExclusive: $integer.parse('3')
          })).to.be.true;
        });

        context("with a non-integer value", function () {

          it("should reject", function () {
            expect($integerType.validateFacets({ minInclusive: 3 })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $integerType.validateFacets({ maxInclusive: 3 }, errors);
            expect(errors).to.include.something.eql([
              'maxInclusive',
              "must be a sulfur/schema/integer value"
            ]);
          });

        });

      });

      context("with facet `minExclusive`", function () {

        it("should accept an integer value", function () {
          expect($integerType.validateFacets({
            minExclusive: $integer.parse('1')
          })).to.be.true;
        });

        context("with a non-integer value", function () {

          it("should reject", function () {
            expect($integerType.validateFacets({ minExclusive: 1 })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $integerType.validateFacets({ minExclusive: 1 }, errors);
            expect(errors).to.include.something.eql([
              'minExclusive',
              "must be a sulfur/schema/integer value"
            ]);
          });

        });

      });

      context("with facet `minInclusive`", function () {

        it("should accept an integer value", function () {
          expect($integerType.validateFacets({
            minInclusive: $integer.parse('1')
          })).to.be.true;
        });

        context("with a non-integer value", function () {

          it("should reject", function () {
            expect($integerType.validateFacets({ minInclusive: 1 })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $integerType.validateFacets({ minInclusive: 1 }, errors);
            expect(errors).to.include.something.eql([
              'minInclusive',
              "must be a sulfur/schema/integer value"
            ]);
          });

        });

      });

    });

    describe('#validator()', function () {

      it("should return a validator/all", function () {
        var type = $integerType.create();
        var v = type.validator();
        expect($validators.all.prototype).to.be.prototypeOf(v);
      });

      it("should include a validator/prototype matching sulfur/schema/integer", function () {
        var type = $integerType.create();
        var v = type.validator();
        expect(v).to.eql($validators.all.create([
          $validators.prototype.create($integer.prototype)
        ]));
      });

      it("should include a validator/enumeration when facet `enumeration` is defined", function () {
        var type = $integerType.create({ enumeration: [ $integer.create() ] });
        var v = type.validator();
        expect(v).to.eql($validators.all.create([
          $validators.prototype.create($integer.prototype),
          $validators.enumeration.create([ $integer.create() ], { testMethod: 'eq' })
        ]));
      });

      it("should include a validator/property with validator/maximum when facet `fractionDigits` is defined", function () {
        var type = $integerType.create({ fractionDigits: 0 });
        var v = type.validator();
        expect(v).to.eql($validators.all.create([
          $validators.prototype.create($integer.prototype),
          $validators.property.create(
            'countFractionDigits',
            $validators.maximum.create(0)
          )
        ]));
      });

      it("should include a validator/maximum (exclusive) when facet `maxExclusive` is defined", function () {
        var type = $integerType.create({ maxExclusive: $integer.create() });
        var v = type.validator();
        expect(v).to.eql($validators.all.create([
          $validators.prototype.create($integer.prototype),
          $validators.maximum.create($integer.create(), { exclusive: true })
        ]));
      });

      it("should include a validator/maximum (inclusive) when facet `maxInclusive` is defined", function () {
        var type = $integerType.create({ maxInclusive: $integer.create() });
        var v = type.validator();
        expect(v).to.eql($validators.all.create([
          $validators.prototype.create($integer.prototype),
          $validators.maximum.create($integer.create())
        ]));
      });

      it("should include a validator/minimum (exclusive) when facet `minExclusive` is defined", function () {
        var type = $integerType.create({ minExclusive: $integer.create() });
        var v = type.validator();
        expect(v).to.eql($validators.all.create([
          $validators.prototype.create($integer.prototype),
          $validators.minimum.create($integer.create(), { exclusive: true })
        ]));
      });

      it("should include a validator/minimum (inclusive) when facet `minInclusive` is defined", function () {
        var type = $integerType.create({ minInclusive: $integer.create() });
        var v = type.validator();
        expect(v).to.eql($validators.all.create([
          $validators.prototype.create($integer.prototype),
          $validators.minimum.create($integer.create())
        ]));
      });

      it("should include a validator/some with validator/pattern when facet `pattern` is defined", function () {
        var type = $integerType.create({ patterns: [ $pattern.create('(0|1[0-9]*)(\\.[0-9]{2})?') ] });
        var v = type.validator();
        expect(v).to.eql($validators.all.create([
          $validators.prototype.create($integer.prototype),
          $validators.some.create([ $validators.pattern.create($pattern.create('(0|1[0-9]*)(\\.[0-9]{2})?')) ])
        ]));
      });

      it("should include a validator/property with validator/maximum when facet `totalDigits` is defined", function () {
        var type = $integerType.create({ totalDigits: 3 });
        var v = type.validator();
        expect(v).to.eql($validators.all.create([
          $validators.prototype.create($integer.prototype),
          $validators.property.create(
            'countDigits',
            $validators.maximum.create(3)
          )
        ]));
      });

    });

  });

});
