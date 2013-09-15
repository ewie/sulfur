/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global context, describe, it */

define([
  'shared',
  'sulfur/schema/type/decimal',
  'sulfur/schema/decimal',
  'sulfur/schema/pattern',
  'sulfur/schema/validators'
], function ($shared, $decimalType, $decimal, $pattern, $validators) {

  'use strict';

  var expect = $shared.expect;
  var bind = $shared.bind;

  describe('sulfur/schema/type/decimal', function () {

    describe('.validateFacets()', function () {

      context("with facet `enumeration`", function () {

        it("should accept decimal values", function () {
          expect($decimalType.validateFacets({ enumeration: [ $decimal.parse('1.2') ] })).to.be.true;
        });

        context("with no values", function () {

          it("should reject", function () {
            expect($decimalType.validateFacets({ enumeration: [] })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $decimalType.validateFacets({ enumeration: [] }, errors);
            expect(errors).to.include.something.eql([
              'enumeration',
              "must specify at least one decimal value"
            ]);
          });

        });

        context("with a non-decimal value", function () {

          it("should reject", function () {
            expect($decimalType.validateFacets({ enumeration: ['123abc'] })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $decimalType.validateFacets({ enumeration: ['123abc'] }, errors);
            expect(errors).to.include.something.eql([
              'enumeration',
              "must specify only decimal values"
            ]);
          });

        });

      });

      context("with facet `fractionDigits`", function () {

        it("should accept non-negative integers", function () {
          expect($decimalType.validateFacets({ fractionDigits: 0 })).to.be.true;
        });

        context("with a negative value", function () {

          it("should reject", function () {
            expect($decimalType.validateFacets({ fractionDigits: -1 })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $decimalType.validateFacets({ fractionDigits: -1 }, errors);
            expect(errors).to.include.something.eql([
              'fractionDigits',
              "must be an integer within range [0, 2^53)"
            ]);
          });

        });

        context("with a value equal to 2^53", function () {

          it("should reject", function () {
            expect($decimalType.validateFacets({ fractionDigits: Math.pow(2, 53) })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $decimalType.validateFacets({ fractionDigits: Math.pow(2, 53) }, errors);
            expect(errors).to.include.something.eql([
              'fractionDigits',
              "must be an integer within range [0, 2^53)"
            ]);
          });

        });

        context("with a value greater than 2^53", function () {

          it("should reject", function () {
            expect($decimalType.validateFacets({ fractionDigits: Math.pow(2, 54) })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $decimalType.validateFacets({ fractionDigits: Math.pow(2, 54) }, errors);
            expect(errors).to.include.something.eql([
              'fractionDigits',
              "must be an integer within range [0, 2^53)"
            ]);
          });

        });

        context("with a non-integer value", function () {

          it("should reject", function () {
            expect($decimalType.validateFacets({ fractionDigits: 1.2 })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $decimalType.validateFacets({ fractionDigits: 1.2 }, errors);
            expect(errors).to.include.something.eql([
              'fractionDigits',
              "must be an integer within range [0, 2^53)"
            ]);
          });

        });

      });

      context("with facet `maxExclusive`", function () {

        it("should accept decimal values", function () {
          expect($decimalType.validateFacets({ maxExclusive: $decimal.parse('3.2') })).to.be.true;
        });

        context("with a non-decimal value", function () {

          it("should reject", function () {
            expect($decimalType.validateFacets({ maxExclusive: '123abc' })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $decimalType.validateFacets({ maxExclusive: '123abc' }, errors);
            expect(errors).to.include.something.eql([
              'maxExclusive',
              "must be a decimal value"
            ]);
          });

        });

        context("with facet `maxInclusive`", function () {

          it("should reject", function () {
            expect($decimalType.validateFacets({
              maxExclusive: $decimal.parse('1'),
              maxInclusive: $decimal.parse('1')
            })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $decimalType.validateFacets({
              maxExclusive: $decimal.parse('1'),
              maxInclusive: $decimal.parse('1')
            }, errors);
            expect(errors).to.include.something.eql([
              'maxExclusive',
              "cannot be used along with facet maxInclusive"
            ]);
          });

        });

        context("with a value less than `minInclusive`", function () {

          it("should reject", function () {
            expect($decimalType.validateFacets({
              maxExclusive: $decimal.parse('1'),
              minInclusive: $decimal.parse('3')
            })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $decimalType.validateFacets({
              maxExclusive: $decimal.parse('1'),
              minInclusive: $decimal.parse('3')
            }, errors);
            expect(errors).to.include.something.eql([
              'maxExclusive',
              "must be greater than facet minInclusive"
            ]);
          });

        });

        context("with a value equal to `minInclusive`", function () {

          it("should reject", function () {
            expect($decimalType.validateFacets({
              maxExclusive: $decimal.parse('1'),
              minInclusive: $decimal.parse('1')
            })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $decimalType.validateFacets({
              maxExclusive: $decimal.parse('1'),
              minInclusive: $decimal.parse('1')
            }, errors);
            expect(errors).to.include.something.eql([
              'maxExclusive',
              "must be greater than facet minInclusive"
            ]);
          });

        });

        context("with a value less than `minExclusive`", function () {

          it("should reject", function () {
            expect($decimalType.validateFacets({
              maxExclusive: $decimal.parse('1'),
              minExclusive: $decimal.parse('3')
            })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $decimalType.validateFacets({
              maxExclusive: $decimal.parse('1'),
              minExclusive: $decimal.parse('3')
            }, errors);
            expect(errors).to.include.something.eql([
              'maxExclusive',
              "must be greater than or equal to facet minExclusive"
            ]);
          });

        });

      });

      context("with facet `maxInclusive`", function () {

        it("should accept decimal values", function () {
          expect($decimalType.validateFacets({ maxInclusive: $decimal.parse('3.2') })).to.be.true;
        });

        context("with a non-decimal value", function () {

          it("should reject", function () {
            expect($decimalType.validateFacets({ minInclusive: '123abc' })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $decimalType.validateFacets({ maxInclusive: '123abc' }, errors);
            expect(errors).to.include.something.eql([
              'maxInclusive',
              "must be a decimal value"
            ]);
          });

        });

        context("with a value less than `minInclusive`", function () {

          it("should reject", function () {
            expect($decimalType.validateFacets({
              maxInclusive: $decimal.parse('1'),
              minInclusive: $decimal.parse('3')
            })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $decimalType.validateFacets({
              maxInclusive: $decimal.parse('1'),
              minInclusive: $decimal.parse('3')
            }, errors);
            expect(errors).to.include.something.eql([
              'maxInclusive',
              "must be greater than or equal to facet minInclusive"
            ]);
          });

        });

        context("with a value less than `minExclusive`", function () {

          it("should reject", function () {
            expect($decimalType.validateFacets({
              maxInclusive: $decimal.parse('1'),
              minExclusive: $decimal.parse('3')
            })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $decimalType.validateFacets({
              maxInclusive: $decimal.parse('1'),
              minExclusive: $decimal.parse('3')
            }, errors);
            expect(errors).to.include.something.eql([
              'maxInclusive',
              "must be greater than facet minExclusive"
            ]);
          });

        });

        context("with a value equal to `minExclusive`", function () {

          it("should reject", function () {
            expect($decimalType.validateFacets({
              maxInclusive: $decimal.parse('1'),
              minExclusive: $decimal.parse('1')
            })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $decimalType.validateFacets({
              maxInclusive: $decimal.parse('1'),
              minExclusive: $decimal.parse('1')
            }, errors);
            expect(errors).to.include.something.eql([
              'maxInclusive',
              "must be greater than facet minExclusive"
            ]);
          });

        });

      });

      context("with facet `minExclusive`", function () {

        it("should accept decimal values", function () {
          expect($decimalType.validateFacets({ minExclusive: $decimal.parse('1.2') })).to.be.true;
        });

        context("with non-decimal values", function () {

          it("should reject", function () {
            expect($decimalType.validateFacets({ minExclusive: '123abc' })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $decimalType.validateFacets({ minExclusive: '123abc' }, errors);
            expect(errors).to.include.something.eql([
              'minExclusive',
              "must be a decimal value"
            ]);
          });

        });

        context("with facet `minInclusive`", function () {

          it("should reject", function () {
            expect($decimalType.validateFacets({
              minExclusive: $decimal.parse('1'),
              minInclusive: $decimal.parse('1')
            })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $decimalType.validateFacets({
              minExclusive: $decimal.parse('1'),
              minInclusive: $decimal.parse('1')
            }, errors);
            expect(errors).to.include.something.eql([
              'minExclusive',
              "cannot be used along with facet minInclusive"
            ]);
          });

        });

      });

      context("with facet `minInclusive`", function () {

        it("should accept decimal values", function () {
          expect($decimalType.validateFacets({ minInclusive: $decimal.parse('1.2') })).to.be.true;
        });

        context("with a non-decimal value", function () {

          it("should reject", function () {
            expect($decimalType.validateFacets({ minInclusive: '123abc' })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $decimalType.validateFacets({ minInclusive: '123abc' }, errors);
            expect(errors).to.include.something.eql([
              'minInclusive',
              "must be a decimal value"
            ]);
          });

        });

      });

      context("with facet `patterns`", function () {

        it("should accept an array of XSD patterns", function () {
          expect($decimalType.validateFacets({ patterns: [ $pattern.create('.') ] })).to.be.true;
        });

        context("with no patterns", function () {

          it("should reject", function () {
            expect($decimalType.validateFacets({ patterns: [] })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $decimalType.validateFacets({ patterns: [] }, errors);
            expect(errors).to.include.something.eql([
              'patterns',
              "must specify at least one XSD pattern"
            ]);
          });

        });

        context("with invalid patterns", function () {

          it("should reject", function () {
            expect($decimalType.validateFacets({ patterns: ['.'] })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $decimalType.validateFacets({ patterns: ['.'] }, errors);
            expect(errors).to.include.something.eql([
              'patterns',
              "must specify only XSD patterns"
            ]);
          });

        });

      });

      context("with facet `totalDigits`", function () {

        it("should accept integers greater than zero", function () {
          expect($decimalType.validateFacets({ totalDigits: 1 })).to.be.true;
        });

        context("with a value less than 1", function () {

          it("should reject", function () {
            expect($decimalType.validateFacets({ totalDigits: 0 })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $decimalType.validateFacets({ totalDigits: 0 }, errors);
            expect(errors).to.include.something.eql([
              'totalDigits',
              "must be an integer within range (0, 2^53)"
            ]);
          });

        });

        context("with a value equal to 2^53", function () {

          it("should reject", function () {
            expect($decimalType.validateFacets({ totalDigits: Math.pow(2, 53) })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $decimalType.validateFacets({ totalDigits: Math.pow(2, 53) }, errors);
            expect(errors).to.include.something.eql([
              'totalDigits',
              "must be an integer within range (0, 2^53)"
            ]);
          });

        });

        context("with a value greater than 2^53", function () {

          it("should reject", function () {
            expect($decimalType.validateFacets({ totalDigits: Math.pow(2, 54) })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $decimalType.validateFacets({ totalDigits: Math.pow(2, 54) }, errors);
            expect(errors).to.include.something.eql([
              'totalDigits',
              "must be an integer within range (0, 2^53)"
            ]);
          });

        });

        context("with a non-integer value", function () {

          it("should reject", function () {
            expect($decimalType.validateFacets({ totalDigits: 1.2 })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $decimalType.validateFacets({ totalDigits: 1.2 }, errors);
            expect(errors).to.include.something.eql([
              'totalDigits',
              "must be an integer within range (0, 2^53)"
            ]);
          });

        });

      });

    });

    describe('#initialize()', function () {

      it("should be callable without any facets", function () {
        expect(bind($decimalType, 'create')).to.not.throw();
      });

      it("should throw any of the validation errors when .validateFacets() returns false", function () {
        expect(bind($decimalType, 'create', { patterns: [] }))
          .to.throw("facet patterns must specify at least one XSD pattern");
      });

      context("when .validateFacets() returns true", function () {

        context("with facet `enumeration`", function () {

          it("should use the values", function () {
            var type = $decimalType.create({
              enumeration: [ $decimal.parse('1') ]
            });
            expect(type.getEnumerationValues()).to.eql([ $decimal.parse('1') ]);
          });

          it("should ignore duplicate values", function () {
            var type = $decimalType.create({
              enumeration: [
                $decimal.parse('1'),
                $decimal.parse('1')
              ]
            });
            expect(type.getEnumerationValues()).to.eql([ $decimal.parse('1') ]);
          });

        });

        it("should use facet `fractionDigits` when given", function () {
          var type = $decimalType.create({ fractionDigits: 0 });
          expect(type.getFractionDigitsValue()).to.eql(0);
        });

        it("should use facet `maxExclusive` when given", function () {
          var type = $decimalType.create({
            maxExclusive: $decimal.parse('1')
          });
          expect(type.getMaxExclusiveValue()).to.eql($decimal.parse('1'));
        });

        it("should use facet `maxInclusive` when given", function () {
          var type = $decimalType.create({
            maxInclusive: $decimal.parse('1')
          });
          expect(type.getMaxInclusiveValue()).to.eql($decimal.parse('1'));
        });

        it("should use facet `minExclusive` when given", function () {
          var type = $decimalType.create({
            minExclusive: $decimal.parse('1')
          });
          expect(type.getMinExclusiveValue()).to.eql($decimal.parse('1'));
        });

        it("should use facet `minInclusive` when given", function () {
          var type = $decimalType.create({
            minInclusive: $decimal.parse('1')
          });
          expect(type.getMinInclusiveValue()).to.eql($decimal.parse('1'));
        });

        context("with facet `patterns`", function () {

          it("should use the patterns", function () {
            var type = $decimalType.create({
              patterns: [ $pattern.create('.') ]
            });
            expect(type.getPatternValues()).to.eql([ $pattern.create('.') ]);
          });

          it("should ignore duplicate patterns based on their source", function () {
            var type = $decimalType.create({
              patterns: [
                $pattern.create('.'),
                $pattern.create('.')
              ]
            });
            expect(type.getPatternValues()).to.eql([ $pattern.create('.') ]);
          });

        });

        it("should use facet `totalDigits` when given", function () {
          var type = $decimalType.create({ totalDigits: 1 });
          expect(type.getTotalDigitsValue()).to.eql(1);
        });

      });

    });

    describe('#getEnumerationValues()', function () {

      it("should return undefined if facet `enumeration` is not defined", function () {
        var type = $decimalType.create();
        expect(type.getEnumerationValues()).to.be.undefined;
      });

      it("should return the values of facet `enumeration` when defined", function () {
        var values = [ $decimal.create() ];
        var type = $decimalType.create({ enumeration: values });
        expect(type.getEnumerationValues()).to.eql(values);
      });

    });

    describe('#getFractionDigitsValue()', function () {

      it("should return undefined if facet `fractionDigits` is not defined", function () {
        var type = $decimalType.create();
        expect(type.getFractionDigitsValue()).to.be.undefined;
      });

      it("should return the values of facet `fractionDigits` when defined", function () {
        var type = $decimalType.create({ fractionDigits: 0 });
        expect(type.getFractionDigitsValue()).to.eql(0);
      });

    });

    describe('#getMaxExclusiveValue()', function () {

      it("should return undefined if facet `maxExclusive` is not defined", function () {
        var type = $decimalType.create();
        expect(type.getMaxExclusiveValue()).to.be.undefined;
      });

      it("should return the values of facet `maxExclusive` when defined", function () {
        var value = $decimal.create();
        var type = $decimalType.create({ maxExclusive: value });
        expect(type.getMaxExclusiveValue()).to.eql(value);
      });

    });

    describe('#getMaxInclusiveValue()', function () {

      it("should return undefined if facet `maxInclusive` is not defined", function () {
        var type = $decimalType.create();
        expect(type.getMaxInclusiveValue()).to.be.undefined;
      });

      it("should return the values of facet `maxInclusive` when defined", function () {
        var value = $decimal.create();
        var type = $decimalType.create({ maxInclusive: value });
        expect(type.getMaxInclusiveValue()).to.eql(value);
      });

    });

    describe('#getMinExclusiveValue()', function () {

      it("should return undefined if facet `minExclusive` is not defined", function () {
        var type = $decimalType.create();
        expect(type.getMinExclusiveValue()).to.be.undefined;
      });

      it("should return the values of facet `minExclusive` when defined", function () {
        var value = $decimal.create();
        var type = $decimalType.create({ minExclusive: value });
        expect(type.getMinExclusiveValue()).to.eql(value);
      });

    });

    describe('#getMinInclusiveValue()', function () {

      it("should return undefined if facet `minInclusive` is not defined", function () {
        var type = $decimalType.create();
        expect(type.getMinInclusiveValue()).to.be.undefined;
      });

      it("should return the values of facet `minInclusive` when defined", function () {
        var value = $decimal.create();
        var type = $decimalType.create({ minInclusive: value });
        expect(type.getMinInclusiveValue()).to.eql(value);
      });

    });

    describe('#getPatternValues()', function () {

      it("should return undefined if facet `enumeration` is not defined", function () {
        var type = $decimalType.create();
        expect(type.getPatternValues()).to.be.undefined;
      });

      it("should return the values of facet `enumeration` when defined", function () {
        var patterns = [ $pattern.create('.') ];
        var type = $decimalType.create({ patterns: patterns });
        expect(type.getPatternValues()).to.eql(patterns);
      });

    });

    describe('#getTotalDigitsValue()', function () {

      it("should return undefined if facet `totalDigits` is not defined", function () {
        var type = $decimalType.create();
        expect(type.getTotalDigitsValue()).to.be.undefined;
      });

      it("should return the values of facet `totalDigits` when defined", function () {
        var type = $decimalType.create({ totalDigits: 1 });
        expect(type.getTotalDigitsValue()).to.eql(1);
      });

    });

    describe('#validator()', function () {

      it("should return a validator/all", function () {
        var type = $decimalType.create();
        var v = type.validator();
        expect($validators.all.prototype).to.be.prototypeOf(v);
      });

      it("should include a validator/prototype matching sulfur/schema/decimal", function () {
        var type = $decimalType.create();
        var v = type.validator();
        expect(v).to.eql($validators.all.create([
          $validators.prototype.create($decimal.prototype)
        ]));
      });

      it("should include a validator/enumeration when facet `enumeration` is defined", function () {
        var type = $decimalType.create({ enumeration: [ $decimal.create() ] });
        var v = type.validator();
        expect(v).to.eql($validators.all.create([
          $validators.prototype.create($decimal.prototype),
          $validators.enumeration.create([ $decimal.create() ])
        ]));
      });

      it("should include a validator/property with validator/maximum when facet `fractionDigits` is defined", function () {
        var type = $decimalType.create({ fractionDigits: 2 });
        var v = type.validator();
        expect(v).to.eql($validators.all.create([
          $validators.prototype.create($decimal.prototype),
          $validators.property.create(
            'countFractionDigits',
            $validators.maximum.create(2)
          )
        ]));
      });

      it("should include a validator/maximum (exclusive) when facet `maxExclusive` is defined", function () {
        var type = $decimalType.create({ maxExclusive: $decimal.create() });
        var v = type.validator();
        expect(v).to.eql($validators.all.create([
          $validators.prototype.create($decimal.prototype),
          $validators.maximum.create($decimal.create(), { exclusive: true })
        ]));
      });

      it("should include a validator/maximum (inclusive) when facet `maxInclusive` is defined", function () {
        var type = $decimalType.create({ maxInclusive: $decimal.create() });
        var v = type.validator();
        expect(v).to.eql($validators.all.create([
          $validators.prototype.create($decimal.prototype),
          $validators.maximum.create($decimal.create())
        ]));
      });

      it("should include a validator/minimum (exclusive) when facet `minExclusive` is defined", function () {
        var type = $decimalType.create({ minExclusive: $decimal.create() });
        var v = type.validator();
        expect(v).to.eql($validators.all.create([
          $validators.prototype.create($decimal.prototype),
          $validators.minimum.create($decimal.create(), { exclusive: true })
        ]));
      });

      it("should include a validator/minimum (inclusive) when facet `minInclusive` is defined", function () {
        var type = $decimalType.create({ minInclusive: $decimal.create() });
        var v = type.validator();
        expect(v).to.eql($validators.all.create([
          $validators.prototype.create($decimal.prototype),
          $validators.minimum.create($decimal.create())
        ]));
      });

      it("should include a validator/some with validator/pattern when facet `pattern` is defined", function () {
        var type = $decimalType.create({ patterns: [ $pattern.create('(0|1[0-9]*)(\\.[0-9]{2})?') ] });
        var v = type.validator();
        expect(v).to.eql($validators.all.create([
          $validators.prototype.create($decimal.prototype),
          $validators.some.create([ $validators.pattern.create($pattern.create('(0|1[0-9]*)(\\.[0-9]{2})?')) ])
        ]));
      });

      it("should include a validator/property with validator/maximum when facet `totalDigits` is defined", function () {
        var type = $decimalType.create({ totalDigits: 3 });
        var v = type.validator();
        expect(v).to.eql($validators.all.create([
          $validators.prototype.create($decimal.prototype),
          $validators.property.create(
            'countDigits',
            $validators.maximum.create(3)
          )
        ]));
      });

    });

  });

});
