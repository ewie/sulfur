/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global context, describe, it */

define([
  'shared',
  'sulfur/schema/type/date',
  'sulfur/schema/date',
  'sulfur/schema/pattern',
  'sulfur/schema/validators'
], function ($shared, $dateType, $date, $pattern, $validators) {

  'use strict';

  var expect = $shared.expect;
  var bind = $shared.bind;

  describe('sulfur/schema/type/date', function () {

    describe('.validateFacets()', function () {

      context("with facet `enumeration`", function () {

        it("should accept an array of date values", function () {
          expect($dateType.validateFacets({ enumeration: [$date.create()] })).to.be.true;
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
          expect($dateType.validateFacets({ maxExclusive: $date.create() })).to.be.true;
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
              maxExclusive: $date.create(),
              maxInclusive: $date.create()
            })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $dateType.validateFacets({
              maxExclusive: $date.create(),
              maxInclusive: $date.create()
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
              maxExclusive: $date.create({ year: 2000 }),
              minExclusive: $date.create({ year: 2001 })
            })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $dateType.validateFacets({
              maxExclusive: $date.create({ year: 2000 }),
              minExclusive: $date.create({ year: 2001 })
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
              maxExclusive: $date.create({ year: 2000 }),
              minInclusive: $date.create({ year: 2001 })
            })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $dateType.validateFacets({
              maxExclusive: $date.create({ year: 2000 }),
              minInclusive: $date.create({ year: 2001 })
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
              maxExclusive: $date.create(),
              minInclusive: $date.create()
            })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $dateType.validateFacets({
              maxExclusive: $date.create(),
              minInclusive: $date.create()
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
          expect($dateType.validateFacets({ maxInclusive: $date.create() })).to.be.true;
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
              maxInclusive: $date.create({ year: 2000 }),
              minInclusive: $date.create({ year: 2001 })
            })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $dateType.validateFacets({
              maxInclusive: $date.create({ year: 2000 }),
              minInclusive: $date.create({ year: 2001 })
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
              maxInclusive: $date.create({ year: 2000 }),
              minExclusive: $date.create({ year: 2001 })
            })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $dateType.validateFacets({
              maxInclusive: $date.create({ year: 2000 }),
              minExclusive: $date.create({ year: 2001 })
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
              maxInclusive: $date.create(),
              minExclusive: $date.create()
            })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $dateType.validateFacets({
              maxInclusive: $date.create(),
              minExclusive: $date.create()
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
          expect($dateType.validateFacets({ minExclusive: $date.create() })).to.be.true;
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
              minExclusive: $date.create(),
              minInclusive: $date.create()
            })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $dateType.validateFacets({
              minExclusive: $date.create(),
              minInclusive: $date.create()
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
          expect($dateType.validateFacets({ minInclusive: $date.create() })).to.be.true;
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

        it("should use facet `enumeration` when given", function () {
          var dt = $date.create();
          var type = $dateType.create({ enumeration: [ dt ] });
          expect(type.enumeration).to.eql([ dt ]);
        });

        it("should use facet `maxExclusive` when given", function () {
          var dt = $date.create();
          var type = $dateType.create({ maxExclusive: dt });
          expect(type.maxExclusive).to.equal(dt);
        });

        it("should use facet `maxInclusive` when given", function () {
          var dt = $date.create();
          var type = $dateType.create({ maxInclusive: dt });
          expect(type.maxInclusive).to.equal(dt);
        });

        it("should use facet `minExclusive` when given", function () {
          var dt = $date.create();
          var type = $dateType.create({ minExclusive: dt });
          expect(type.minExclusive).to.equal(dt);
        });

        it("should use facet `minInclusive` when given", function () {
          var dt = $date.create();
          var type = $dateType.create({ minInclusive: dt });
          expect(type.minInclusive).to.equal(dt);
        });

        it("should ignore duplicate values in facet `enumeration` based on their canonical representation", function () {
          var values = [
            $date.create({ day: 2, tzhour: 24 }),
            $date.create({ day: 1, tzhour: 0 })
          ];
          var type = $dateType.create({ enumeration: values });
          expect(type.enumeration).to.eql([ $date.create({ day: 1, tzhour: 0 }) ]);
        });

        it("should use facet `patterns` when given", function () {
          var type = $dateType.create({ patterns: [ $pattern.create('.') ] });
          expect(type.patterns).to.eql([ $pattern.create('.') ]);
        });

        it("should ignore duplicate values in facet `patterns`", function () {
          var patterns = [
            $pattern.create('.'),
            $pattern.create('.')
          ];
          var type = $dateType.create({ patterns: patterns });
          expect(type.patterns).to.eql([ $pattern.create('.') ]);
        });

      });

    });

    describe('#validator()', function () {

      it("should return a validator/all", function () {
        var type = $dateType.create();
        var v = type.validator();
        expect($validators.all.prototype).to.be.prototypeOf(v);
      });

      it("should include a validator/prototype matching sulfur/schema/date", function () {
        var type = $dateType.create();
        var v = type.validator();
        expect(v).to.eql($validators.all.create([
          $validators.prototype.create($date.prototype)
        ]));
      });

      it("should include a validator/enumeration when facet `enumeration` is defined", function () {
        var type = $dateType.create({ enumeration: [ $date.create(2000) ] });
        var v = type.validator();
        expect(v).to.eql($validators.all.create([
          $validators.prototype.create($date.prototype),
          $validators.enumeration.create([ $date.create(2000) ])
        ]));
      });

      it("should include a validator/maximum (exclusive) when facet `maxExclusive` is defined", function () {
        var type = $dateType.create({ maxExclusive: $date.create(2000) });
        var v = type.validator();
        expect(v).to.eql($validators.all.create([
          $validators.prototype.create($date.prototype),
          $validators.maximum.create($date.create(2000), { exclusive: true })
        ]));
      });

      it("should include a validator/maximum (inclusive) when facet `maxInclusive` is defined", function () {
        var type = $dateType.create({ maxInclusive: $date.create(2000) });
        var v = type.validator();
        expect(v).to.eql($validators.all.create([
          $validators.prototype.create($date.prototype),
          $validators.maximum.create($date.create(2000))
        ]));
      });

      it("should include a validator/minimum (exclusive) when facet `minExclusive` is defined", function () {
        var type = $dateType.create({ minExclusive: $date.create(2000) });
        var v = type.validator();
        expect(v).to.eql($validators.all.create([
          $validators.prototype.create($date.prototype),
          $validators.minimum.create($date.create(2000), { exclusive: true })
        ]));
      });

      it("should include a validator/minimum (inclusive) when facet `minInclusive` is defined", function () {
        var type = $dateType.create({ minInclusive: $date.create(2000) });
        var v = type.validator();
        expect(v).to.eql($validators.all.create([
          $validators.prototype.create($date.prototype),
          $validators.minimum.create($date.create(2000))
        ]));
      });

      it("should include a validator/some with validator/pattern when facet `pattern` is defined", function () {
        var type = $dateType.create({ patterns: [ $pattern.create('19.*') ] });
        var v = type.validator();
        expect(v).to.eql($validators.all.create([
          $validators.prototype.create($date.prototype),
          $validators.some.create([ $validators.pattern.create($pattern.create('19.*')) ])
        ]));
      });

    });

  });

});
