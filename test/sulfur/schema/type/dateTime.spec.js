/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global context, describe, it */

define([
  'shared',
  'sulfur/schema/type/dateTime',
  'sulfur/schema/dateTime',
  'sulfur/schema/pattern',
  'sulfur/schema/validators'
], function ($shared, $dateTimeType, $dateTime, $pattern, $validators) {

  'use strict';

  var expect = $shared.expect;
  var bind = $shared.bind;

  describe('sulfur/schema/type/dateTime', function () {

    describe('.validateFacets()', function () {

      context("with facet `enumeration`", function () {

        it("should accept an array of datetime values", function () {
          expect($dateTimeType.validateFacets({ enumeration: [$dateTime.create()] })).to.be.true;
        });

        context("with no values", function () {

          it("should reject", function () {
            expect($dateTimeType.validateFacets({ enumeration: [] })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $dateTimeType.validateFacets({ enumeration: [] }, errors);
            expect(errors).to.include.something.eql([
              'enumeration',
              "must specify at least one XSD datetime value"
            ]);
          });

        });

        context("with invalid values", function () {

          it("should reject", function () {
            expect($dateTimeType.validateFacets({ enumeration: [1] })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $dateTimeType.validateFacets({ enumeration: [1] }, errors);
            expect(errors).to.include.something.eql([
              'enumeration',
              "must specify only XSD datetime values"
            ]);
          });

        });

      });

      context("with facet `maxExclusive`", function () {

        it("should accept datetime values", function () {
          expect($dateTimeType.validateFacets({ maxExclusive: $dateTime.create() })).to.be.true;
        });

        context("with a non-datetime value", function () {

          it("should reject", function () {
            expect($dateTimeType.validateFacets({ maxExclusive: true })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $dateTimeType.validateFacets({ maxExclusive: true }, errors);
            expect(errors).to.include.something.eql([
              'maxExclusive',
              "must be an XSD datetime"
            ]);
          });

        });

        context("with facet `maxInclusive`", function () {

          it("should reject", function () {
            expect($dateTimeType.validateFacets({
              maxExclusive: $dateTime.create(),
              maxInclusive: $dateTime.create()
            })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $dateTimeType.validateFacets({
              maxExclusive: $dateTime.create(),
              maxInclusive: $dateTime.create()
            }, errors);
            expect(errors).to.include.something.eql([
              'maxExclusive',
              "cannot be used along with facet maxInclusive"
            ]);
          });

        });

        context("with a value less than `minExclusive`", function () {

          it("should reject", function () {
            expect($dateTimeType.validateFacets({
              maxExclusive: $dateTime.create({ year: 2000 }),
              minExclusive: $dateTime.create({ year: 2001 })
            })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $dateTimeType.validateFacets({
              maxExclusive: $dateTime.create({ year: 2000 }),
              minExclusive: $dateTime.create({ year: 2001 })
            }, errors);
            expect(errors).to.include.something.eql([
              'maxExclusive',
              "must be greater than or equal to facet minExclusive"
            ]);
          });

        });

        context("with a value less than `minInclusive`", function () {

          it("should reject", function () {
            expect($dateTimeType.validateFacets({
              maxExclusive: $dateTime.create({ year: 2000 }),
              minInclusive: $dateTime.create({ year: 2001 })
            })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $dateTimeType.validateFacets({
              maxExclusive: $dateTime.create({ year: 2000 }),
              minInclusive: $dateTime.create({ year: 2001 })
            }, errors);
            expect(errors).to.include.something.eql([
              'maxExclusive',
              "must be greater than facet minInclusive"
            ]);
          });

        });

        context("with a value equal to `minInclusive`", function () {

          it("should reject", function () {
            expect($dateTimeType.validateFacets({
              maxExclusive: $dateTime.create(),
              minInclusive: $dateTime.create()
            })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $dateTimeType.validateFacets({
              maxExclusive: $dateTime.create(),
              minInclusive: $dateTime.create()
            }, errors);
            expect(errors).to.include.something.eql([
              'maxExclusive',
              "must be greater than facet minInclusive"
            ]);
          });

        });

      });

      context("with facet `maxInclusive`", function () {

        it("should accept datetime values", function () {
          expect($dateTimeType.validateFacets({ maxInclusive: $dateTime.create() })).to.be.true;
        });

        context("with a non-datetime value", function () {

          it("should reject", function () {
            expect($dateTimeType.validateFacets({ maxInclusive: true })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $dateTimeType.validateFacets({ maxInclusive: true }, errors);
            expect(errors).to.include.something.eql([
              'maxInclusive',
              "must be an XSD datetime"
            ]);
          });

        });

        context("with a value less than `minInclusive`", function () {

          it("should reject", function () {
            expect($dateTimeType.validateFacets({
              maxInclusive: $dateTime.create({ year: 2000 }),
              minInclusive: $dateTime.create({ year: 2001 })
            })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $dateTimeType.validateFacets({
              maxInclusive: $dateTime.create({ year: 2000 }),
              minInclusive: $dateTime.create({ year: 2001 })
            }, errors);
            expect(errors).to.include.something.eql([
              'maxInclusive',
              "must be greater than or equal to facet minInclusive"
            ]);
          });

        });

        context("with a value less than `minExclusive`", function () {

          it("should reject", function () {
            expect($dateTimeType.validateFacets({
              maxInclusive: $dateTime.create({ year: 2000 }),
              minExclusive: $dateTime.create({ year: 2001 })
            })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $dateTimeType.validateFacets({
              maxInclusive: $dateTime.create({ year: 2000 }),
              minExclusive: $dateTime.create({ year: 2001 })
            }, errors);
            expect(errors).to.include.something.eql([
              'maxInclusive',
              "must be greater than facet minExclusive"
            ]);
          });

        });

        context("with a value equal to `minExclusive`", function () {

          it("should reject", function () {
            expect($dateTimeType.validateFacets({
              maxInclusive: $dateTime.create(),
              minExclusive: $dateTime.create()
            })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $dateTimeType.validateFacets({
              maxInclusive: $dateTime.create(),
              minExclusive: $dateTime.create()
            }, errors);
            expect(errors).to.include.something.eql([
              'maxInclusive',
              "must be greater than facet minExclusive"
            ]);
          });

        });

      });

      context("with facet `minExclusive`", function () {

        it("should accept datetime values", function () {
          expect($dateTimeType.validateFacets({ minExclusive: $dateTime.create() })).to.be.true;
        });

        context("with a non-datetime value", function () {

          it("should reject", function () {
            expect($dateTimeType.validateFacets({ minExclusive: true })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $dateTimeType.validateFacets({ minExclusive: true }, errors);
            expect(errors).to.include.something.eql([
              'minExclusive',
              "must be an XSD datetime"
            ]);
          });

        });

        context("with facet `minInclusive`", function () {

          it("should reject", function () {
            expect($dateTimeType.validateFacets({
              minExclusive: $dateTime.create(),
              minInclusive: $dateTime.create()
            })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $dateTimeType.validateFacets({
              minExclusive: $dateTime.create(),
              minInclusive: $dateTime.create()
            }, errors);
            expect(errors).to.include.something.eql([
              'minExclusive',
              "cannot be used along with facet minInclusive"
            ]);
          });

        });

      });

      context("with facet `minInclusive`", function () {

        it("should accept datetime values", function () {
          expect($dateTimeType.validateFacets({ minInclusive: $dateTime.create() })).to.be.true;
        });

        context("with a non-datetime value", function () {

          it("should reject", function () {
            expect($dateTimeType.validateFacets({ minInclusive: true })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $dateTimeType.validateFacets({ minInclusive: true }, errors);
            expect(errors).to.include.something.eql([
              'minInclusive',
              "must be an XSD datetime"
            ]);
          });

        });

      });

      context("with facet `patterns`", function () {

        it("should accept an array of patterns", function () {
          expect($dateTimeType.validateFacets({ patterns: [$pattern.create('.')] })).to.be.true;
        });

        context("with no patterns", function () {

          it("should reject", function () {
            expect($dateTimeType.validateFacets({ patterns: [] })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $dateTimeType.validateFacets({ patterns: [] }, errors);
            expect(errors).to.include.something.eql([
              'patterns',
              "must specify at least one XSD pattern"
            ]);
          });

        });

        context("with an invalid pattern", function () {

          it("should reject", function () {
            expect($dateTimeType.validateFacets({ patterns: ['.'] })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $dateTimeType.validateFacets({ patterns: ['.'] }, errors);
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
        expect(bind($dateTimeType, 'create')).to.not.throw();
      });

      it("should throw any of the validation errors when .validateFacets() returns false", function () {
        expect(bind($dateTimeType, 'create', { minInclusive: 1 }))
          .to.throw("facet minInclusive must be an XSD datetime");
      });

      context("when .validateFacets() returns true", function () {

        context("with facet `enumeration`", function () {

          it("should use the values", function () {
            var dt = $dateTime.create();
            var type = $dateTimeType.create({ enumeration: [ dt ] });
            expect(type.getEnumerationValues()).to.eql([ dt ]);
          });

          it("should ignore duplicate values based on their canonical representation", function () {
            var type = $dateTimeType.create({
              enumeration: [
                $dateTime.create({ hour: 2, tzhour: 1 }),
                $dateTime.create({ hour: 1, tzhour: 0 })
              ]
            });
            expect(type.getEnumerationValues()).to.eql([ $dateTime.create({ hour: 1, tzhour: 0 }) ]);
          });

        });

        it("should use facet `maxExclusive` when given", function () {
          var dt = $dateTime.create();
          var type = $dateTimeType.create({ maxExclusive: dt });
          expect(type.getMaxExclusiveValue()).to.equal(dt);
        });

        it("should use facet `maxInclusive` when given", function () {
          var dt = $dateTime.create();
          var type = $dateTimeType.create({ maxInclusive: dt });
          expect(type.getMaxInclusiveValue()).to.equal(dt);
        });

        it("should use facet `minExclusive` when given", function () {
          var dt = $dateTime.create();
          var type = $dateTimeType.create({ minExclusive: dt });
          expect(type.getMinExclusiveValue()).to.equal(dt);
        });

        it("should use facet `minInclusive` when given", function () {
          var dt = $dateTime.create();
          var type = $dateTimeType.create({ minInclusive: dt });
          expect(type.getMinInclusiveValue()).to.equal(dt);
        });

        context("with facet `patterns`", function () {

          it("should use the patterns", function () {
            var type = $dateTimeType.create({ patterns: [ $pattern.create('.') ] });
            expect(type.getPatternValues()).to.eql([ $pattern.create('.') ]);
          });

          it("should ignore duplicate patterns based on their source", function () {
            var type = $dateTimeType.create({
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
        var type = $dateTimeType.create();
        expect(type.getEnumerationValues()).to.be.undefined;
      });

      it("should return the values of facet `enumeration` when defined", function () {
        var values = [ $dateTime.create() ];
        var type = $dateTimeType.create({ enumeration: values });
        expect(type.getEnumerationValues()).to.eql(values);
      });

    });

    describe('#getMaxExclusiveValue()', function () {

      it("should return undefined if facet `maxExclusive` is not defined", function () {
        var type = $dateTimeType.create();
        expect(type.getMaxExclusiveValue()).to.be.undefined;
      });

      it("should return the values of facet `maxExclusive` when defined", function () {
        var value = $dateTime.create();
        var type = $dateTimeType.create({ maxExclusive: value });
        expect(type.getMaxExclusiveValue()).to.eql(value);
      });

    });

    describe('#getMaxInclusiveValue()', function () {

      it("should return undefined if facet `maxInclusive` is not defined", function () {
        var type = $dateTimeType.create();
        expect(type.getMaxInclusiveValue()).to.be.undefined;
      });

      it("should return the values of facet `maxInclusive` when defined", function () {
        var value = $dateTime.create();
        var type = $dateTimeType.create({ maxInclusive: value });
        expect(type.getMaxInclusiveValue()).to.eql(value);
      });

    });

    describe('#getMinExclusiveValue()', function () {

      it("should return undefined if facet `minExclusive` is not defined", function () {
        var type = $dateTimeType.create();
        expect(type.getMinExclusiveValue()).to.be.undefined;
      });

      it("should return the values of facet `minExclusive` when defined", function () {
        var value = $dateTime.create();
        var type = $dateTimeType.create({ minExclusive: value });
        expect(type.getMinExclusiveValue()).to.eql(value);
      });

    });

    describe('#getMinInclusiveValue()', function () {

      it("should return undefined if facet `minInclusive` is not defined", function () {
        var type = $dateTimeType.create();
        expect(type.getMinInclusiveValue()).to.be.undefined;
      });

      it("should return the values of facet `minInclusive` when defined", function () {
        var value = $dateTime.create();
        var type = $dateTimeType.create({ minInclusive: value });
        expect(type.getMinInclusiveValue()).to.eql(value);
      });

    });

    describe('#getPatternValues()', function () {

      it("should return undefined if facet `enumeration` is not defined", function () {
        var type = $dateTimeType.create();
        expect(type.getPatternValues()).to.be.undefined;
      });

      it("should return the values of facet `enumeration` when defined", function () {
        var patterns = [ $pattern.create('.') ];
        var type = $dateTimeType.create({ patterns: patterns });
        expect(type.getPatternValues()).to.eql(patterns);
      });

    });

    describe('#validator()', function () {

      it("should return a validator/all", function () {
        var type = $dateTimeType.create();
        var v = type.validator();
        expect($validators.all.prototype).to.be.prototypeOf(v);
      });

      it("should include a validator/prototype matching sulfur/schema/dateTime", function () {
        var type = $dateTimeType.create();
        var v = type.validator();
        expect(v).to.eql($validators.all.create([
          $validators.prototype.create($dateTime.prototype)
        ]));
      });

      it("should include a validator/enumeration when facet `enumeration` is defined", function () {
        var type = $dateTimeType.create({ enumeration: [ $dateTime.create(2000) ] });
        var v = type.validator();
        expect(v).to.eql($validators.all.create([
          $validators.prototype.create($dateTime.prototype),
          $validators.enumeration.create([ $dateTime.create(2000) ], { testMethod: 'eq' })
        ]));
      });

      it("should include a validator/maximum (exclusive) when facet `maxExclusive` is defined", function () {
        var type = $dateTimeType.create({ maxExclusive: $dateTime.create(2000) });
        var v = type.validator();
        expect(v).to.eql($validators.all.create([
          $validators.prototype.create($dateTime.prototype),
          $validators.maximum.create($dateTime.create(2000), { exclusive: true })
        ]));
      });

      it("should include a validator/maximum (inclusive) when facet `maxInclusive` is defined", function () {
        var type = $dateTimeType.create({ maxInclusive: $dateTime.create(2000) });
        var v = type.validator();
        expect(v).to.eql($validators.all.create([
          $validators.prototype.create($dateTime.prototype),
          $validators.maximum.create($dateTime.create(2000))
        ]));
      });

      it("should include a validator/minimum (exclusive) when facet `minExclusive` is defined", function () {
        var type = $dateTimeType.create({ minExclusive: $dateTime.create(2000) });
        var v = type.validator();
        expect(v).to.eql($validators.all.create([
          $validators.prototype.create($dateTime.prototype),
          $validators.minimum.create($dateTime.create(2000), { exclusive: true })
        ]));
      });

      it("should include a validator/minimum (inclusive) when facet `minInclusive` is defined", function () {
        var type = $dateTimeType.create({ minInclusive: $dateTime.create(2000) });
        var v = type.validator();
        expect(v).to.eql($validators.all.create([
          $validators.prototype.create($dateTime.prototype),
          $validators.minimum.create($dateTime.create(2000))
        ]));
      });

      it("should include a validator/some with validator/pattern when facet `pattern` is defined", function () {
        var type = $dateTimeType.create({ patterns: [ $pattern.create('19.*') ] });
        var v = type.validator();
        expect(v).to.eql($validators.all.create([
          $validators.prototype.create($dateTime.prototype),
          $validators.some.create([ $validators.pattern.create($pattern.create('19.*')) ])
        ]));
      });

    });

  });

});
