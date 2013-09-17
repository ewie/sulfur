/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global context, describe, it */

define([
  'shared',
  'sulfur/schema/pattern',
  'sulfur/schema/type/double',
  'sulfur/schema/validators',
  'sulfur/schema/value/double'
], function ($shared, $pattern, $doubleType, $validators, $doubleValue) {

  'use strict';

  var expect = $shared.expect;
  var bind = $shared.bind;

  describe('sulfur/schema/type/double', function () {

    describe('.validateFacets()', function () {

      context("with facet `enumeration`", function () {

        it("should accept an array of double values", function () {
          expect($doubleType.validateFacets({
            enumeration: [ $doubleValue.create() ]
          })).to.be.true;
        });

        context("with no values", function () {

          it("should reject", function () {
            expect($doubleType.validateFacets({ enumeration: [] })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $doubleType.validateFacets({ enumeration: [] }, errors);
            expect(errors).to.include.something.eql([
              'enumeration',
              "must specify at least one double value"
            ]);
          });

        });

        context("with invalid values", function () {

          it("should reject", function () {
            expect($doubleType.validateFacets({ enumeration: [1] })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $doubleType.validateFacets({ enumeration: [1] }, errors);
            expect(errors).to.include.something.eql([
              'enumeration',
              "must specify only double values"
            ]);
          });

        });

      });

      context("with facet `maxExclusive`", function () {

        it("should accept a double value", function () {
          expect($doubleType.validateFacets({ maxExclusive: $doubleValue.create() })).to.be.true;
        });

        context("with a non-double value", function () {

          it("should reject", function () {
            expect($doubleType.validateFacets({ maxExclusive: true })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $doubleType.validateFacets({ maxExclusive: true }, errors);
            expect(errors).to.include.something.eql([
              'maxExclusive',
              "must be a double"
            ]);
          });

        });

        context("with facet `maxInclusive`", function () {

          it("should reject", function () {
            expect($doubleType.validateFacets({
              maxExclusive: $doubleValue.create(),
              maxInclusive: $doubleValue.create()
            })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $doubleType.validateFacets({
              maxExclusive: $doubleValue.create(),
              maxInclusive: $doubleValue.create()
            }, errors);
            expect(errors).to.include.something.eql([
              'maxExclusive',
              "cannot be used along with facet maxInclusive"
            ]);
          });

        });

        context("with a value less than `minExclusive`", function () {

          it("should reject", function () {
            expect($doubleType.validateFacets({
              maxExclusive: $doubleValue.create(1),
              minExclusive: $doubleValue.create(2)
            })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $doubleType.validateFacets({
              maxExclusive: $doubleValue.create(1),
              minExclusive: $doubleValue.create(2)
            }, errors);
            expect(errors).to.include.something.eql([
              'maxExclusive',
              "must be greater than or equal to facet minExclusive"
            ]);
          });

        });

        context("with a value less than `minInclusive`", function () {

          it("should reject", function () {
            expect($doubleType.validateFacets({
              maxExclusive: $doubleValue.create(1),
              minInclusive: $doubleValue.create(2)
            })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $doubleType.validateFacets({
              maxExclusive: $doubleValue.create(1),
              minInclusive: $doubleValue.create(2)
            }, errors);
            expect(errors).to.include.something.eql([
              'maxExclusive',
              "must be greater than facet minInclusive"
            ]);
          });

        });

        context("with a value equal to `minInclusive`", function () {

          it("should reject", function () {
            expect($doubleType.validateFacets({
              maxExclusive: $doubleValue.create(),
              minInclusive: $doubleValue.create()
            })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $doubleType.validateFacets({
              maxExclusive: $doubleValue.create(),
              minInclusive: $doubleValue.create()
            }, errors);
            expect(errors).to.include.something.eql([
              'maxExclusive',
              "must be greater than facet minInclusive"
            ]);
          });

        });

      });

      context("with facet `maxInclusive`", function () {

        it("should accept a double value", function () {
          expect($doubleType.validateFacets({ maxInclusive: $doubleValue.create() })).to.be.true;
        });

        context("with a non-double value", function () {

          it("should reject", function () {
            expect($doubleType.validateFacets({ maxInclusive: true })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $doubleType.validateFacets({ maxInclusive: true }, errors);
            expect(errors).to.include.something.eql([
              'maxInclusive',
              "must be a double"
            ]);
          });

        });

        context("with a value less than `minExclusive`", function () {

          it("should reject", function () {
            expect($doubleType.validateFacets({
              maxInclusive: $doubleValue.create(1),
              minExclusive: $doubleValue.create(2)
            })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $doubleType.validateFacets({
              maxInclusive: $doubleValue.create(1),
              minExclusive: $doubleValue.create(2)
            }, errors);
            expect(errors).to.include.something.eql([
              'maxInclusive',
              "must be greater than facet minExclusive"
            ]);
          });

        });

        context("with a value equal to `minExclusive`", function () {

          it("should reject", function () {
            expect($doubleType.validateFacets({
              maxInclusive: $doubleValue.create(),
              minExclusive: $doubleValue.create()
            })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $doubleType.validateFacets({
              maxInclusive: $doubleValue.create(),
              minExclusive: $doubleValue.create()
            }, errors);
            expect(errors).to.include.something.eql([
              'maxInclusive',
              "must be greater than facet minExclusive"
            ]);
          });

        });

        context("with a value less than `minInclusive`", function () {

          it("should reject", function () {
            expect($doubleType.validateFacets({
              maxInclusive: $doubleValue.create(1),
              minInclusive: $doubleValue.create(2)
            })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $doubleType.validateFacets({
              maxInclusive: $doubleValue.create(1),
              minInclusive: $doubleValue.create(2)
            }, errors);
            expect(errors).to.include.something.eql([
              'maxInclusive',
              "must be greater than or equal to facet minInclusive"
            ]);
          });

        });

      });

      context("with facet `minExclusive`", function () {

        it("should accept a double value", function () {
          expect($doubleType.validateFacets({ minExclusive: $doubleValue.create() })).to.be.true;
        });

        context("with a non-double value", function () {

          it("should reject", function () {
            expect($doubleType.validateFacets({ minExclusive: true })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $doubleType.validateFacets({ minExclusive: true }, errors);
            expect(errors).to.include.something.eql([
              'minExclusive',
              "must be a double"
            ]);
          });

        });

        context("with facet `minInclusive`", function () {

          it("should reject", function () {
            expect($doubleType.validateFacets({
              minExclusive: $doubleValue.create(),
              minInclusive: $doubleValue.create()
            })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $doubleType.validateFacets({
              minExclusive: $doubleValue.create(),
              minInclusive: $doubleValue.create()
            }, errors);
            expect(errors).to.include.something.eql([
              'minExclusive',
              "cannot be used along with facet minInclusive"
            ]);
          });

        });

      });

      context("with facet `minInclusive`", function () {

        it("should accept a double value", function () {
          expect($doubleType.validateFacets({ minInclusive: $doubleValue.create() })).to.be.true;
        });

        context("with a non-double value", function () {

          it("should reject", function () {
            expect($doubleType.validateFacets({ minInclusive: true })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $doubleType.validateFacets({ minInclusive: true }, errors);
            expect(errors).to.include.something.eql([
              'minInclusive',
              "must be a double"
            ]);
          });

        });

      });

      context("with facet `patterns`", function () {

        it("should accept an array of patterns", function () {
          expect($doubleType.validateFacets({
            patterns: [ $pattern.create('.') ]
          })).to.be.true;
        });

        context("with no patterns", function () {

          it("should reject", function () {
            expect($doubleType.validateFacets({ patterns: [] })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $doubleType.validateFacets({ patterns: [] }, errors);
            expect(errors).to.include.something.eql([
              'patterns',
              "must specify at least one pattern"
            ]);
          });

        });

        context("with an invalid pattern", function () {

          it("should reject", function () {
            expect($doubleType.validateFacets({ patterns: ['.'] })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $doubleType.validateFacets({ patterns: ['.'] }, errors);
            expect(errors).to.include.something.eql([
              'patterns',
              "must specify only patterns"
            ]);
          });

        });

      });

    });

    describe('#initialize()', function () {

      it("should be callable without any facets", function () {
        expect(bind($doubleType, 'create')).to.not.throw();
      });

      it("should throw any of the validation errors when .validateFacets() returns false", function () {
        expect(bind($doubleType, 'create', { minInclusive: 1 }))
          .to.throw("facet minInclusive must be a double");
      });

      context("when .validateFacets() returns true", function () {

        context("with facet `enumeration`", function () {

          it("should use the values", function () {
            var d = $doubleValue.create();
            var type = $doubleType.create({ enumeration: [ d ] });
            expect(type.getEnumerationValues()).to.eql([ d ]);
          });

          it("should ignore duplicate values", function () {
            var type = $doubleType.create({
              enumeration: [
                $doubleValue.create(1),
                $doubleValue.create(1)
              ]
            });
            expect(type.getEnumerationValues()).to.eql([ $doubleValue.create(1) ]);
          });

        });

        it("should use facet `maxExclusive` when given", function () {
          var d = $doubleValue.create();
          var type = $doubleType.create({ maxExclusive: d });
          expect(type.getMaxExclusiveValue()).to.equal(d);
        });

        it("should use facet `maxInclusive` when given", function () {
          var d = $doubleValue.create();
          var type = $doubleType.create({ maxInclusive: d });
          expect(type.getMaxInclusiveValue()).to.equal(d);
        });

        it("should use facet `minExclusive` when given", function () {
          var d = $doubleValue.create();
          var type = $doubleType.create({ minExclusive: d });
          expect(type.getMinExclusiveValue()).to.equal(d);
        });

        it("should use facet `minInclusive` when given", function () {
          var d = $doubleValue.create();
          var type = $doubleType.create({ minInclusive: d });
          expect(type.getMinInclusiveValue()).to.equal(d);
        });

        context("with facet `patterns`", function () {

          it("should use the patterns", function () {
            var type = $doubleType.create({ patterns: [ $pattern.create('.') ] });
            expect(type.getPatternValues()).to.eql([ $pattern.create('.') ]);
          });

          it("should ignore duplicate patterns based on their source", function () {
            var type = $doubleType.create({
              patterns: [
                $pattern.create('.'),
                $pattern.create('.')
              ]
            });
            expect(type.getPatternValues()).to.eql([ $pattern.create('.') ]);
          });

        });

      });

    });

    describe('#getEnumerationValues()', function () {

      it("should return undefined if facet `enumeration` is not defined", function () {
        var type = $doubleType.create();
        expect(type.getEnumerationValues()).to.be.undefined;
      });

      it("should return the values of facet `enumeration` when defined", function () {
        var values = [ $doubleValue.create() ];
        var type = $doubleType.create({ enumeration: values });
        expect(type.getEnumerationValues()).to.eql(values);
      });

    });

    describe('#getMaxExclusiveValue()', function () {

      it("should return undefined if facet `maxExclusive` is not defined", function () {
        var type = $doubleType.create();
        expect(type.getMaxExclusiveValue()).to.be.undefined;
      });

      it("should return the values of facet `maxExclusive` when defined", function () {
        var value = $doubleValue.create();
        var type = $doubleType.create({ maxExclusive: value });
        expect(type.getMaxExclusiveValue()).to.eql(value);
      });

    });

    describe('#getMaxInclusiveValue()', function () {

      it("should return undefined if facet `maxInclusive` is not defined", function () {
        var type = $doubleType.create();
        expect(type.getMaxInclusiveValue()).to.be.undefined;
      });

      it("should return the values of facet `maxInclusive` when defined", function () {
        var value = $doubleValue.create();
        var type = $doubleType.create({ maxInclusive: value });
        expect(type.getMaxInclusiveValue()).to.eql(value);
      });

    });

    describe('#getMinExclusiveValue()', function () {

      it("should return undefined if facet `minExclusive` is not defined", function () {
        var type = $doubleType.create();
        expect(type.getMinExclusiveValue()).to.be.undefined;
      });

      it("should return the values of facet `minExclusive` when defined", function () {
        var value = $doubleValue.create();
        var type = $doubleType.create({ minExclusive: value });
        expect(type.getMinExclusiveValue()).to.eql(value);
      });

    });

    describe('#getMinInclusiveValue()', function () {

      it("should return undefined if facet `minInclusive` is not defined", function () {
        var type = $doubleType.create();
        expect(type.getMinInclusiveValue()).to.be.undefined;
      });

      it("should return the values of facet `minInclusive` when defined", function () {
        var value = $doubleValue.create();
        var type = $doubleType.create({ minInclusive: value });
        expect(type.getMinInclusiveValue()).to.eql(value);
      });

    });

    describe('#getPatternValues()', function () {

      it("should return undefined if facet `enumeration` is not defined", function () {
        var type = $doubleType.create();
        expect(type.getPatternValues()).to.be.undefined;
      });

      it("should return the values of facet `enumeration` when defined", function () {
        var patterns = [ $pattern.create('.') ];
        var type = $doubleType.create({ patterns: patterns });
        expect(type.getPatternValues()).to.eql(patterns);
      });

    });

    describe('#validator()', function () {

      it("should return a validator/all", function () {
        var type = $doubleType.create();
        var v = type.validator();
        expect($validators.all.prototype).to.be.prototypeOf(v);
      });

      it("should include a validator/prototype matching sulfur/schema/dateTime", function () {
        var type = $doubleType.create();
        var v = type.validator();
        expect(v).to.eql($validators.all.create([
          $validators.prototype.create($doubleValue.prototype)
        ]));
      });

      it("should include a validator/enumeration when facet `enumeration` is defined", function () {
        var type = $doubleType.create({ enumeration: [ $doubleValue.create(1) ] });
        var v = type.validator();
        expect(v).to.eql($validators.all.create([
          $validators.prototype.create($doubleValue.prototype),
          $validators.enumeration.create([ $doubleValue.create(1) ], { testMethod: 'eq' })
        ]));
      });

      it("should include a validator/maximum (exclusive) when facet `maxExclusive` is defined", function () {
        var type = $doubleType.create({ maxExclusive: $doubleValue.create(1) });
        var v = type.validator();
        expect(v).to.eql($validators.all.create([
          $validators.prototype.create($doubleValue.prototype),
          $validators.maximum.create($doubleValue.create(1), { exclusive: true })
        ]));
      });

      it("should include a validator/maximum (inclusive) when facet `maxInclusive` is defined", function () {
        var type = $doubleType.create({ maxInclusive: $doubleValue.create(1) });
        var v = type.validator();
        expect(v).to.eql($validators.all.create([
          $validators.prototype.create($doubleValue.prototype),
          $validators.maximum.create($doubleValue.create(1))
        ]));
      });

      it("should include a validator/minimum (exclusive) when facet `minExclusive` is defined", function () {
        var type = $doubleType.create({ minExclusive: $doubleValue.create(1) });
        var v = type.validator();
        expect(v).to.eql($validators.all.create([
          $validators.prototype.create($doubleValue.prototype),
          $validators.minimum.create($doubleValue.create(1), { exclusive: true })
        ]));
      });

      it("should include a validator/minimum (inclusive) when facet `minInclusive` is defined", function () {
        var type = $doubleType.create({ minInclusive: $doubleValue.create(1) });
        var v = type.validator();
        expect(v).to.eql($validators.all.create([
          $validators.prototype.create($doubleValue.prototype),
          $validators.minimum.create($doubleValue.create(1))
        ]));
      });

      it("should include a validator/some with validator/pattern when facet `pattern` is defined", function () {
        var type = $doubleType.create({ patterns: [ $pattern.create('[0-9]\\.[0-9]{2}') ] });
        var v = type.validator();
        expect(v).to.eql($validators.all.create([
          $validators.prototype.create($doubleValue.prototype),
          $validators.some.create([ $validators.pattern.create($pattern.create('[0-9]\\.[0-9]{2}')) ])
        ]));
      });

    });

  });

});
