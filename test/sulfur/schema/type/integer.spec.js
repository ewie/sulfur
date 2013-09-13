/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global context, describe, it */

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
  var bind = $shared.bind;

  describe('sulfur/schema/type/integer', function () {

    it("should be derived from sulfur/schema/type/decimal", function () {
      expect($decimalType).to.be.prototypeOf($integerType);
    });

    describe('.validateFacets()', function () {

      context("with facet `enumeration`", function () {

        it("should accept an array of decimal integer values", function () {
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
              "must specify at least one integer value"
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
              "must specify only integer values"
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

        it("should accept a decimal integer value", function () {
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
              "must be an integer value"
            ]);
          });

        });

        context("with facet `maxInclusive`", function () {

          it("should reject", function () {
            expect($integerType.validateFacets({
              maxExclusive: $integer.parse('1'),
              maxInclusive: $integer.parse('1')
            })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $integerType.validateFacets({
              maxExclusive: $integer.parse('1'),
              maxInclusive: $integer.parse('1')
            }, errors);
            expect(errors).to.include.something.eql([
              'maxExclusive',
              "cannot be used along with facet maxInclusive"
            ]);
          });

        });

        context("with a value less than `minInclusive`", function () {

          it("should reject", function () {
            expect($integerType.validateFacets({
              maxExclusive: $integer.parse('1'),
              minInclusive: $integer.parse('3')
            })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $integerType.validateFacets({
              maxExclusive: $integer.parse('1'),
              minInclusive: $integer.parse('3')
            }, errors);
            expect(errors).to.include.something.eql([
              'maxExclusive',
              "must be greater than facet minInclusive"
            ]);
          });

        });

        context("with a value equal to `minInclusive`", function () {

          it("should reject", function () {
            expect($integerType.validateFacets({
              maxExclusive: $integer.parse('1'),
              minInclusive: $integer.parse('1')
            })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $integerType.validateFacets({
              maxExclusive: $integer.parse('1'),
              minInclusive: $integer.parse('1')
            }, errors);
            expect(errors).to.include.something.eql([
              'maxExclusive',
              "must be greater than facet minInclusive"
            ]);
          });

        });

        context("with a value less than `minExclusive`", function () {

          it("should reject", function () {
            expect($integerType.validateFacets({
              maxExclusive: $integer.parse('1'),
              minExclusive: $integer.parse('3')
            })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $integerType.validateFacets({
              maxExclusive: $integer.parse('1'),
              minExclusive: $integer.parse('3')
            }, errors);
            expect(errors).to.include.something.eql([
              'maxExclusive',
              "must be greater than or equal to facet minExclusive"
            ]);
          });

        });

      });

      context("with facet `maxInclusive`", function () {

        it("should accept a decimal integer value", function () {
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
              "must be an integer value"
            ]);
          });

        });

        context("with a value less than `minInclusive`", function () {

          it("should reject", function () {
            expect($integerType.validateFacets({
              maxInclusive: $integer.parse('1'),
              minInclusive: $integer.parse('3')
            })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $integerType.validateFacets({
              maxInclusive: $integer.parse('1'),
              minInclusive: $integer.parse('3')
            }, errors);
            expect(errors).to.include.something.eql([
              'maxInclusive',
              "must be greater than or equal to facet minInclusive"
            ]);
          });

        });

        context("with a value less than `minExclusive`", function () {

          it("should reject", function () {
            expect($integerType.validateFacets({
              maxInclusive: $integer.parse('1'),
              minExclusive: $integer.parse('3')
            })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $integerType.validateFacets({
              maxInclusive: $integer.parse('1'),
              minExclusive: $integer.parse('3')
            }, errors);
            expect(errors).to.include.something.eql([
              'maxInclusive',
              "must be greater than facet minExclusive"
            ]);
          });

        });

        context("with a value equal to `minExclusive`", function () {

          it("should reject", function () {
            expect($integerType.validateFacets({
              maxInclusive: $integer.parse('1'),
              minExclusive: $integer.parse('1')
            })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $integerType.validateFacets({
              maxInclusive: $integer.parse('1'),
              minExclusive: $integer.parse('1')
            }, errors);
            expect(errors).to.include.something.eql([
              'maxInclusive',
              "must be greater than facet minExclusive"
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
              "must be an integer value"
            ]);
          });

        });

        context("with facet `minInclusive`", function () {

          it("should reject", function () {
            expect($integerType.validateFacets({
              minExclusive: $integer.parse('1'),
              minInclusive: $integer.parse('1')
            })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $integerType.validateFacets({
              minExclusive: $integer.parse('1'),
              minInclusive: $integer.parse('1')
            }, errors);
            expect(errors).to.include.something.eql([
              'minExclusive',
              "cannot be used along with facet minInclusive"
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
              "must be an integer value"
            ]);
          });

        });

      });

      context("with facet `patterns`", function () {

        it("should accept an array of XSD patterns", function () {
          expect($integerType.validateFacets({ patterns: [ $pattern.create('.') ] })).to.be.true;
        });

        context("with no patterns", function () {

          it("should reject", function () {
            expect($integerType.validateFacets({ patterns: [] })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $integerType.validateFacets({ patterns: [] }, errors);
            expect(errors).to.include.something.eql([
              'patterns',
              "must specify at least one XSD pattern"
            ]);
          });

        });

        context("with an invalid pattern", function () {

          it("should reject", function () {
            expect($integerType.validateFacets({ patterns: ['.'] })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $integerType.validateFacets({ patterns: ['.'] }, errors);
            expect(errors).to.include.something.eql([
              'patterns',
              "must specify only XSD patterns"
            ]);
          });

        });

      });

      context("with facet `totalDigits`", function () {

        it("should accept integers greater than zero", function () {
          expect($integerType.validateFacets({ totalDigits: 1 })).to.be.true;
        });

        context("with a value less than 1", function () {

          it("should reject", function () {
            expect($integerType.validateFacets({ totalDigits: 0 })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $integerType.validateFacets({ totalDigits: 0 }, errors);
            expect(errors).to.include.something.eql([
              'totalDigits',
              "must be an integer within range (0, 2^53)"
            ]);
          });

        });

        context("with a value equal to 2^53", function () {

          it("should reject", function () {
            expect($integerType.validateFacets({ totalDigits: Math.pow(2, 53) })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $integerType.validateFacets({ totalDigits: Math.pow(2, 53) }, errors);
            expect(errors).to.include.something.eql([
              'totalDigits',
              "must be an integer within range (0, 2^53)"
            ]);
          });

        });

        context("with a value greater than 2^53", function () {

          it("should reject", function () {
            expect($integerType.validateFacets({ totalDigits: Math.pow(2, 54) })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $integerType.validateFacets({ totalDigits: Math.pow(2, 54) }, errors);
            expect(errors).to.include.something.eql([
              'totalDigits',
              "must be an integer within range (0, 2^53)"
            ]);
          });

        });

        context("with a non-integer value", function () {

          it("should reject", function () {
            expect($integerType.validateFacets({ totalDigits: 1.2 })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $integerType.validateFacets({ totalDigits: 1.2 }, errors);
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
        expect(bind($integerType, 'create')).to.not.throw();
      });

      it("should throw any of the validation errors when .validateFacets() returns false", function () {
        expect(bind($integerType, 'create', { patterns: [] }))
          .to.throw("facet patterns must specify at least one XSD pattern");
      });

      context("when .validateFacets() returns true", function () {

        it("should use facet `enumeration` when given", function () {
          var type = $integerType.create({
            enumeration: [ $integer.parse('1') ]
          });
          expect(type.enumeration).to.eql([ $integer.parse('1') ]);
        });

        it("should ignore duplicate values in facet `enumeration`", function () {
          var type = $integerType.create({
            enumeration: [
              $integer.parse('1'),
              $integer.parse('1')
            ]
          });
          expect(type.enumeration).to.eql([ $integer.parse('1') ]);
        });

        it("should use facet `fractionDigits` when given", function () {
          var type = $integerType.create({ fractionDigits: 0 });
          expect(type.fractionDigits).to.eql(0);
        });

        it("should use facet `maxExclusive` when given", function () {
          var type = $integerType.create({
            maxExclusive: $integer.parse('1')
          });
          expect(type.maxExclusive).to.eql($integer.parse('1'));
        });

        it("should use facet `maxInclusive` when given", function () {
          var type = $integerType.create({
            maxInclusive: $integer.parse('1')
          });
          expect(type.maxInclusive).to.eql($integer.parse('1'));
        });

        it("should use facet `minExclusive` when given", function () {
          var type = $integerType.create({
            minExclusive: $integer.parse('1')
          });
          expect(type.minExclusive).to.eql($integer.parse('1'));
        });

        it("should use facet `minInclusive` when given", function () {
          var type = $integerType.create({
            minInclusive: $integer.parse('1')
          });
          expect(type.minInclusive).to.eql($integer.parse('1'));
        });

        it("should use facet `patterns` when given", function () {
          var type = $integerType.create({
            patterns: [ $pattern.create('.') ]
          });
          expect(type.patterns).to.eql([ $pattern.create('.') ]);
        });

        it("should ignore duplicate patterns in facet `patterns` based on their source", function () {
          var type = $integerType.create({
            patterns: [
              $pattern.create('.'),
              $pattern.create('.')
            ]
          });
          expect(type.patterns).to.eql([ $pattern.create('.') ]);
        });

        it("should use facet `totalDigits` when given", function () {
          var type = $integerType.create({ totalDigits: 1 });
          expect(type.totalDigits).to.eql(1);
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
          $validators.enumeration.create([ $integer.create() ])
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
