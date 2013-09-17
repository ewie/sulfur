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
  'sulfur/schema/type/date',
  'sulfur/schema/validators',
  'sulfur/schema/value/date'
], function ($shared, $pattern, $dateType, $validators, $dateValue) {

  'use strict';

  var expect = $shared.expect;
  var bind = $shared.bind;

  describe('sulfur/schema/type/date', function () {

    describe('.validateFacets()', function () {

      context("with facet `enumeration`", function () {

        it("should accept an array of date values", function () {
          expect($dateType.validateFacets({ enumeration: [$dateValue.create()] })).to.be.true;
        });

        context("with no values", function () {

          it("should reject", function () {
            expect($dateType.validateFacets({ enumeration: [] })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $dateType.validateFacets({ enumeration: [] }, errors);
            expect(errors).to.include.something.eql([
              'enumeration',
              "must specify at least one XSD date value"
            ]);
          });

        });

        context("with invalid values", function () {

          it("should reject", function () {
            expect($dateType.validateFacets({ enumeration: [1] })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $dateType.validateFacets({ enumeration: [1] }, errors);
            expect(errors).to.include.something.eql([
              'enumeration',
              "must specify only XSD date values"
            ]);
          });

        });

      });

      context("with facet `maxExclusive`", function () {

        it("should accept date values", function () {
          expect($dateType.validateFacets({ maxExclusive: $dateValue.create() })).to.be.true;
        });

        context("with a non-date value", function () {

          it("should reject", function () {
            expect($dateType.validateFacets({ maxExclusive: true })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $dateType.validateFacets({ maxExclusive: true }, errors);
            expect(errors).to.include.something.eql([
              'maxExclusive',
              "must be an XSD date"
            ]);
          });

        });

        context("with facet `maxInclusive`", function () {

          it("should reject", function () {
            expect($dateType.validateFacets({
              maxExclusive: $dateValue.create(),
              maxInclusive: $dateValue.create()
            })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $dateType.validateFacets({
              maxExclusive: $dateValue.create(),
              maxInclusive: $dateValue.create()
            }, errors);
            expect(errors).to.include.something.eql([
              'maxExclusive',
              "cannot be used along with facet maxInclusive"
            ]);
          });

        });

        context("with a value less than `minExclusive`", function () {

          it("should reject", function () {
            expect($dateType.validateFacets({
              maxExclusive: $dateValue.create({ year: 2000 }),
              minExclusive: $dateValue.create({ year: 2001 })
            })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $dateType.validateFacets({
              maxExclusive: $dateValue.create({ year: 2000 }),
              minExclusive: $dateValue.create({ year: 2001 })
            }, errors);
            expect(errors).to.include.something.eql([
              'maxExclusive',
              "must be greater than or equal to facet minExclusive"
            ]);
          });

        });

        context("with a value less than `minInclusive`", function () {

          it("should reject", function () {
            expect($dateType.validateFacets({
              maxExclusive: $dateValue.create({ year: 2000 }),
              minInclusive: $dateValue.create({ year: 2001 })
            })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $dateType.validateFacets({
              maxExclusive: $dateValue.create({ year: 2000 }),
              minInclusive: $dateValue.create({ year: 2001 })
            }, errors);
            expect(errors).to.include.something.eql([
              'maxExclusive',
              "must be greater than facet minInclusive"
            ]);
          });

        });

        context("with a value equal to `minInclusive`", function () {

          it("should reject", function () {
            expect($dateType.validateFacets({
              maxExclusive: $dateValue.create(),
              minInclusive: $dateValue.create()
            })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $dateType.validateFacets({
              maxExclusive: $dateValue.create(),
              minInclusive: $dateValue.create()
            }, errors);
            expect(errors).to.include.something.eql([
              'maxExclusive',
              "must be greater than facet minInclusive"
            ]);
          });

        });

      });

      context("with facet `maxInclusive`", function () {

        it("should accept date values", function () {
          expect($dateType.validateFacets({ maxInclusive: $dateValue.create() })).to.be.true;
        });

        context("with a non-date value", function () {

          it("should reject", function () {
            expect($dateType.validateFacets({ maxInclusive: true })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $dateType.validateFacets({ maxInclusive: true }, errors);
            expect(errors).to.include.something.eql([
              'maxInclusive',
              "must be an XSD date"
            ]);
          });

        });

        context("with a value less than `minInclusive`", function () {

          it("should reject", function () {
            expect($dateType.validateFacets({
              maxInclusive: $dateValue.create({ year: 2000 }),
              minInclusive: $dateValue.create({ year: 2001 })
            })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $dateType.validateFacets({
              maxInclusive: $dateValue.create({ year: 2000 }),
              minInclusive: $dateValue.create({ year: 2001 })
            }, errors);
            expect(errors).to.include.something.eql([
              'maxInclusive',
              "must be greater than or equal to facet minInclusive"
            ]);
          });

        });

        context("with a value less than `minExclusive`", function () {

          it("should reject", function () {
            expect($dateType.validateFacets({
              maxInclusive: $dateValue.create({ year: 2000 }),
              minExclusive: $dateValue.create({ year: 2001 })
            })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $dateType.validateFacets({
              maxInclusive: $dateValue.create({ year: 2000 }),
              minExclusive: $dateValue.create({ year: 2001 })
            }, errors);
            expect(errors).to.include.something.eql([
              'maxInclusive',
              "must be greater than facet minExclusive"
            ]);
          });

        });

        context("with a value equal to `minExclusive`", function () {

          it("should reject", function () {
            expect($dateType.validateFacets({
              maxInclusive: $dateValue.create(),
              minExclusive: $dateValue.create()
            })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $dateType.validateFacets({
              maxInclusive: $dateValue.create(),
              minExclusive: $dateValue.create()
            }, errors);
            expect(errors).to.include.something.eql([
              'maxInclusive',
              "must be greater than facet minExclusive"
            ]);
          });

        });

      });

      context("with facet `minExclusive`", function () {

        it("should accept date values", function () {
          expect($dateType.validateFacets({ minExclusive: $dateValue.create() })).to.be.true;
        });

        context("with a non-date value", function () {

          it("should reject", function () {
            expect($dateType.validateFacets({ minExclusive: true })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $dateType.validateFacets({ minExclusive: true }, errors);
            expect(errors).to.include.something.eql([
              'minExclusive',
              "must be an XSD date"
            ]);
          });

        });

        context("with facet `minInclusive`", function () {

          it("should reject", function () {
            expect($dateType.validateFacets({
              minExclusive: $dateValue.create(),
              minInclusive: $dateValue.create()
            })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $dateType.validateFacets({
              minExclusive: $dateValue.create(),
              minInclusive: $dateValue.create()
            }, errors);
            expect(errors).to.include.something.eql([
              'minExclusive',
              "cannot be used along with facet minInclusive"
            ]);
          });

        });

      });

      context("with facet `minInclusive`", function () {

        it("should accept date values", function () {
          expect($dateType.validateFacets({ minInclusive: $dateValue.create() })).to.be.true;
        });

        context("with a non-date value", function () {

          it("should reject", function () {
            expect($dateType.validateFacets({ minInclusive: true })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $dateType.validateFacets({ minInclusive: true }, errors);
            expect(errors).to.include.something.eql([
              'minInclusive',
              "must be an XSD date"
            ]);
          });

        });

      });

      context("with facet `patterns`", function () {

        it("should accept an array of patterns", function () {
          expect($dateType.validateFacets({ patterns: [$pattern.create('.')] })).to.be.true;
        });

        context("with no patterns", function () {

          it("should reject", function () {
            expect($dateType.validateFacets({ patterns: [] })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $dateType.validateFacets({ patterns: [] }, errors);
            expect(errors).to.include.something.eql([
              'patterns',
              "must specify at least one XSD pattern"
            ]);
          });

        });

        context("with an invalid pattern", function () {

          it("should reject", function () {
            expect($dateType.validateFacets({ patterns: ['.'] })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $dateType.validateFacets({ patterns: ['.'] }, errors);
            expect(errors).to.include.something.eql([
              'patterns',
              "must specify only XSD patterns"
            ]);
          });

        });

      });

    });

    describe('#initialize()', function () {

      it("should be callable without any facets", function () {
        expect(bind($dateType, 'create')).to.not.throw();
      });

      it("should throw any of the validation errors when .validateFacets() returns false", function () {
        expect(bind($dateType, 'create', { minInclusive: 1 }))
          .to.throw("facet minInclusive must be an XSD date");
      });

      context("when .validateFacets() returns true", function () {

        context("with facet `enumeration`", function () {

          it("should use the values", function () {
            var dt = $dateValue.create();
            var type = $dateType.create({ enumeration: [ dt ] });
            expect(type.getEnumerationValues()).to.eql([ dt ]);
          });

          it("should ignore duplicate values their canonical representation", function () {
            var values = [
              $dateValue.create({ day: 2, tzhour: 24 }),
              $dateValue.create({ day: 1, tzhour: 0 })
            ];
            var type = $dateType.create({ enumeration: values });
            expect(type.getEnumerationValues()).to.eql([ $dateValue.create({ day: 1, tzhour: 0 }) ]);
          });

        });

        it("should use facet `maxExclusive` when given", function () {
          var dt = $dateValue.create();
          var type = $dateType.create({ maxExclusive: dt });
          expect(type.getMaxExclusiveValue()).to.equal(dt);
        });

        it("should use facet `maxInclusive` when given", function () {
          var dt = $dateValue.create();
          var type = $dateType.create({ maxInclusive: dt });
          expect(type.getMaxInclusiveValue()).to.equal(dt);
        });

        it("should use facet `minExclusive` when given", function () {
          var dt = $dateValue.create();
          var type = $dateType.create({ minExclusive: dt });
          expect(type.getMinExclusiveValue()).to.equal(dt);
        });

        it("should use facet `minInclusive` when given", function () {
          var dt = $dateValue.create();
          var type = $dateType.create({ minInclusive: dt });
          expect(type.getMinInclusiveValue()).to.equal(dt);
        });

        context("with facet `patterns`", function () {

          it("should use the patterns", function () {
            var type = $dateType.create({ patterns: [ $pattern.create('.') ] });
            expect(type.getPatternValues()).to.eql([ $pattern.create('.') ]);
          });

          it("should ignore duplicate patterns based on their source", function () {
            var patterns = [
              $pattern.create('.'),
              $pattern.create('.')
            ];
            var type = $dateType.create({ patterns: patterns });
            expect(type.getPatternValues()).to.eql([ $pattern.create('.') ]);
          });

        });

      });

    });

    describe('#getEnumerationValues()', function () {

      it("should return undefined if facet `enumeration` is not defined", function () {
        var type = $dateType.create();
        expect(type.getEnumerationValues()).to.be.undefined;
      });

      it("should return the values of facet `enumeration` when defined", function () {
        var values = [ $dateValue.create() ];
        var type = $dateType.create({ enumeration: values });
        expect(type.getEnumerationValues()).to.eql(values);
      });

    });

    describe('#getMaxExclusiveValue()', function () {

      it("should return undefined if facet `maxExclusive` is not defined", function () {
        var type = $dateType.create();
        expect(type.getMaxExclusiveValue()).to.be.undefined;
      });

      it("should return the values of facet `maxExclusive` when defined", function () {
        var value = $dateValue.create();
        var type = $dateType.create({ maxExclusive: value });
        expect(type.getMaxExclusiveValue()).to.eql(value);
      });

    });

    describe('#getMaxInclusiveValue()', function () {

      it("should return undefined if facet `maxInclusive` is not defined", function () {
        var type = $dateType.create();
        expect(type.getMaxInclusiveValue()).to.be.undefined;
      });

      it("should return the values of facet `maxInclusive` when defined", function () {
        var value = $dateValue.create();
        var type = $dateType.create({ maxInclusive: value });
        expect(type.getMaxInclusiveValue()).to.eql(value);
      });

    });

    describe('#getMinExclusiveValue()', function () {

      it("should return undefined if facet `minExclusive` is not defined", function () {
        var type = $dateType.create();
        expect(type.getMinExclusiveValue()).to.be.undefined;
      });

      it("should return the values of facet `minExclusive` when defined", function () {
        var value = $dateValue.create();
        var type = $dateType.create({ minExclusive: value });
        expect(type.getMinExclusiveValue()).to.eql(value);
      });

    });

    describe('#getMinInclusiveValue()', function () {

      it("should return undefined if facet `minInclusive` is not defined", function () {
        var type = $dateType.create();
        expect(type.getMinInclusiveValue()).to.be.undefined;
      });

      it("should return the values of facet `minInclusive` when defined", function () {
        var value = $dateValue.create();
        var type = $dateType.create({ minInclusive: value });
        expect(type.getMinInclusiveValue()).to.eql(value);
      });

    });

    describe('#getPatternValues()', function () {

      it("should return undefined if facet `enumeration` is not defined", function () {
        var type = $dateType.create();
        expect(type.getPatternValues()).to.be.undefined;
      });

      it("should return the values of facet `enumeration` when defined", function () {
        var patterns = [ $pattern.create('.') ];
        var type = $dateType.create({ patterns: patterns });
        expect(type.getPatternValues()).to.eql(patterns);
      });

    });

    describe('#validator()', function () {

      it("should return a validator/all", function () {
        var type = $dateType.create();
        var v = type.validator();
        expect($validators.all.prototype).to.be.prototypeOf(v);
      });

      it("should include a validator/prototype matching sulfur/schema/value/date", function () {
        var type = $dateType.create();
        var v = type.validator();
        expect(v).to.eql($validators.all.create([
          $validators.prototype.create($dateValue.prototype)
        ]));
      });

      it("should include a validator/enumeration when facet `enumeration` is defined", function () {
        var type = $dateType.create({ enumeration: [ $dateValue.create(2000) ] });
        var v = type.validator();
        expect(v).to.eql($validators.all.create([
          $validators.prototype.create($dateValue.prototype),
          $validators.enumeration.create([ $dateValue.create(2000) ], { testMethod: 'eq' })
        ]));
      });

      it("should include a validator/maximum (exclusive) when facet `maxExclusive` is defined", function () {
        var type = $dateType.create({ maxExclusive: $dateValue.create(2000) });
        var v = type.validator();
        expect(v).to.eql($validators.all.create([
          $validators.prototype.create($dateValue.prototype),
          $validators.maximum.create($dateValue.create(2000), { exclusive: true })
        ]));
      });

      it("should include a validator/maximum (inclusive) when facet `maxInclusive` is defined", function () {
        var type = $dateType.create({ maxInclusive: $dateValue.create(2000) });
        var v = type.validator();
        expect(v).to.eql($validators.all.create([
          $validators.prototype.create($dateValue.prototype),
          $validators.maximum.create($dateValue.create(2000))
        ]));
      });

      it("should include a validator/minimum (exclusive) when facet `minExclusive` is defined", function () {
        var type = $dateType.create({ minExclusive: $dateValue.create(2000) });
        var v = type.validator();
        expect(v).to.eql($validators.all.create([
          $validators.prototype.create($dateValue.prototype),
          $validators.minimum.create($dateValue.create(2000), { exclusive: true })
        ]));
      });

      it("should include a validator/minimum (inclusive) when facet `minInclusive` is defined", function () {
        var type = $dateType.create({ minInclusive: $dateValue.create(2000) });
        var v = type.validator();
        expect(v).to.eql($validators.all.create([
          $validators.prototype.create($dateValue.prototype),
          $validators.minimum.create($dateValue.create(2000))
        ]));
      });

      it("should include a validator/some with validator/pattern when facet `pattern` is defined", function () {
        var type = $dateType.create({ patterns: [ $pattern.create('19.*') ] });
        var v = type.validator();
        expect(v).to.eql($validators.all.create([
          $validators.prototype.create($dateValue.prototype),
          $validators.some.create([ $validators.pattern.create($pattern.create('19.*')) ])
        ]));
      });

    });

  });

});
