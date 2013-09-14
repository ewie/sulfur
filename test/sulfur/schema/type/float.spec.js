/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global context, describe, it */

define([
  'shared',
  'sulfur/schema/float',
  'sulfur/schema/pattern',
  'sulfur/schema/type/float',
  'sulfur/schema/validators'
], function ($shared, $float, $pattern, $floatType, $validators) {

  'use strict';

  var expect = $shared.expect;
  var bind = $shared.bind;

  describe('sulfur/schema/type/float', function () {

    describe('.validateFacets()', function () {

      context("with facet `enumeration`", function () {

        it("should accept an array of float values", function () {
          expect($floatType.validateFacets({
            enumeration: [ $float.create() ]
          })).to.be.true;
        });

        context("with no values", function () {

          it("should reject", function () {
            expect($floatType.validateFacets({ enumeration: [] })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $floatType.validateFacets({ enumeration: [] }, errors);
            expect(errors).to.include.something.eql([
              'enumeration',
              "must specify at least one float value"
            ]);
          });

        });

        context("with invalid values", function () {

          it("should reject", function () {
            expect($floatType.validateFacets({ enumeration: [1] })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $floatType.validateFacets({ enumeration: [1] }, errors);
            expect(errors).to.include.something.eql([
              'enumeration',
              "must specify only float values"
            ]);
          });

        });

      });

      context("with facet `maxExclusive`", function () {

        it("should accept a float value", function () {
          expect($floatType.validateFacets({ maxExclusive: $float.create() })).to.be.true;
        });

        context("with a non-float value", function () {

          it("should reject", function () {
            expect($floatType.validateFacets({ maxExclusive: true })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $floatType.validateFacets({ maxExclusive: true }, errors);
            expect(errors).to.include.something.eql([
              'maxExclusive',
              "must be a float"
            ]);
          });

        });

        context("with facet `maxInclusive`", function () {

          it("should reject", function () {
            expect($floatType.validateFacets({
              maxExclusive: $float.create(),
              maxInclusive: $float.create()
            })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $floatType.validateFacets({
              maxExclusive: $float.create(),
              maxInclusive: $float.create()
            }, errors);
            expect(errors).to.include.something.eql([
              'maxExclusive',
              "cannot be used along with facet maxInclusive"
            ]);
          });

        });

        context("with a value less than `minExclusive`", function () {

          it("should reject", function () {
            expect($floatType.validateFacets({
              maxExclusive: $float.create(1),
              minExclusive: $float.create(2)
            })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $floatType.validateFacets({
              maxExclusive: $float.create(1),
              minExclusive: $float.create(2)
            }, errors);
            expect(errors).to.include.something.eql([
              'maxExclusive',
              "must be greater than or equal to facet minExclusive"
            ]);
          });

        });

        context("with a value less than `minInclusive`", function () {

          it("should reject", function () {
            expect($floatType.validateFacets({
              maxExclusive: $float.create(1),
              minInclusive: $float.create(2)
            })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $floatType.validateFacets({
              maxExclusive: $float.create(1),
              minInclusive: $float.create(2)
            }, errors);
            expect(errors).to.include.something.eql([
              'maxExclusive',
              "must be greater than facet minInclusive"
            ]);
          });

        });

        context("with a value equal to `minInclusive`", function () {

          it("should reject", function () {
            expect($floatType.validateFacets({
              maxExclusive: $float.create(),
              minInclusive: $float.create()
            })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $floatType.validateFacets({
              maxExclusive: $float.create(),
              minInclusive: $float.create()
            }, errors);
            expect(errors).to.include.something.eql([
              'maxExclusive',
              "must be greater than facet minInclusive"
            ]);
          });

        });

      });

      context("with facet `maxInclusive`", function () {

        it("should accept a float value", function () {
          expect($floatType.validateFacets({ maxInclusive: $float.create() })).to.be.true;
        });

        context("with a non-float value", function () {

          it("should reject", function () {
            expect($floatType.validateFacets({ maxInclusive: true })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $floatType.validateFacets({ maxInclusive: true }, errors);
            expect(errors).to.include.something.eql([
              'maxInclusive',
              "must be a float"
            ]);
          });

        });

        context("with a value less than `minExclusive`", function () {

          it("should reject", function () {
            expect($floatType.validateFacets({
              maxInclusive: $float.create(1),
              minExclusive: $float.create(2)
            })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $floatType.validateFacets({
              maxInclusive: $float.create(1),
              minExclusive: $float.create(2)
            }, errors);
            expect(errors).to.include.something.eql([
              'maxInclusive',
              "must be greater than facet minExclusive"
            ]);
          });

        });

        context("with a value equal to `minExclusive`", function () {

          it("should reject", function () {
            expect($floatType.validateFacets({
              maxInclusive: $float.create(),
              minExclusive: $float.create()
            })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $floatType.validateFacets({
              maxInclusive: $float.create(),
              minExclusive: $float.create()
            }, errors);
            expect(errors).to.include.something.eql([
              'maxInclusive',
              "must be greater than facet minExclusive"
            ]);
          });

        });

        context("with a value less than `minInclusive`", function () {

          it("should reject", function () {
            expect($floatType.validateFacets({
              maxInclusive: $float.create(1),
              minInclusive: $float.create(2)
            })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $floatType.validateFacets({
              maxInclusive: $float.create(1),
              minInclusive: $float.create(2)
            }, errors);
            expect(errors).to.include.something.eql([
              'maxInclusive',
              "must be greater than or equal to facet minInclusive"
            ]);
          });

        });

      });

      context("with facet `minExclusive`", function () {

        it("should accept a float value", function () {
          expect($floatType.validateFacets({ minExclusive: $float.create() })).to.be.true;
        });

        context("with a non-float value", function () {

          it("should reject", function () {
            expect($floatType.validateFacets({ minExclusive: true })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $floatType.validateFacets({ minExclusive: true }, errors);
            expect(errors).to.include.something.eql([
              'minExclusive',
              "must be a float"
            ]);
          });

        });

        context("with facet `minInclusive`", function () {

          it("should reject", function () {
            expect($floatType.validateFacets({
              minExclusive: $float.create(),
              minInclusive: $float.create()
            })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $floatType.validateFacets({
              minExclusive: $float.create(),
              minInclusive: $float.create()
            }, errors);
            expect(errors).to.include.something.eql([
              'minExclusive',
              "cannot be used along with facet minInclusive"
            ]);
          });

        });

      });

      context("with facet `minInclusive`", function () {

        it("should accept a float value", function () {
          expect($floatType.validateFacets({ minInclusive: $float.create() })).to.be.true;
        });

        context("with a non-float value", function () {

          it("should reject", function () {
            expect($floatType.validateFacets({ minInclusive: true })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $floatType.validateFacets({ minInclusive: true }, errors);
            expect(errors).to.include.something.eql([
              'minInclusive',
              "must be a float"
            ]);
          });

        });

      });

      context("with facet `patterns`", function () {

        it("should accept an array of patterns", function () {
          expect($floatType.validateFacets({
            patterns: [ $pattern.create('.') ]
          })).to.be.true;
        });

        context("with no patterns", function () {

          it("should reject", function () {
            expect($floatType.validateFacets({ patterns: [] })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $floatType.validateFacets({ patterns: [] }, errors);
            expect(errors).to.include.something.eql([
              'patterns',
              "must specify at least one pattern"
            ]);
          });

        });

        context("with an invalid pattern", function () {

          it("should reject", function () {
            expect($floatType.validateFacets({ patterns: ['.'] })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $floatType.validateFacets({ patterns: ['.'] }, errors);
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
        expect(bind($floatType, 'create')).to.not.throw();
      });

      it("should throw any of the validation errors when .validateFacets() returns false", function () {
        expect(bind($floatType, 'create', { minInclusive: 1 }))
          .to.throw("facet minInclusive must be a float");
      });

      context("when .validateFacets() returns true", function () {

        it("should use facet `enumeration` when given", function () {
          var d = $float.create();
          var type = $floatType.create({ enumeration: [ d ] });
          expect(type.enumeration).to.eql([ d ]);
        });

        it("should use facet `maxExclusive` when given", function () {
          var d = $float.create();
          var type = $floatType.create({ maxExclusive: d });
          expect(type.maxExclusive).to.equal(d);
        });

        it("should use facet `maxInclusive` when given", function () {
          var d = $float.create();
          var type = $floatType.create({ maxInclusive: d });
          expect(type.maxInclusive).to.equal(d);
        });

        it("should use facet `minExclusive` when given", function () {
          var d = $float.create();
          var type = $floatType.create({ minExclusive: d });
          expect(type.minExclusive).to.equal(d);
        });

        it("should use facet `minInclusive` when given", function () {
          var d = $float.create();
          var type = $floatType.create({ minInclusive: d });
          expect(type.minInclusive).to.equal(d);
        });

        it("should ignore duplicate values in facet `enumeration`", function () {
          var type = $floatType.create({
            enumeration: [
              $float.create(1),
              $float.create(1)
            ]
          });
          expect(type.enumeration).to.eql([ $float.create(1) ]);
        });

        it("should use facet `patterns` when given", function () {
          var type = $floatType.create({ patterns: [ $pattern.create('.') ] });
          expect(type.patterns).to.eql([ $pattern.create('.') ]);
        });

        it("should ignore duplicate values in facet `patterns`", function () {
          var type = $floatType.create({
            patterns: [
              $pattern.create('.'),
              $pattern.create('.')
            ]
          });
          expect(type.patterns).to.eql([ $pattern.create('.') ]);
        });

      });

    });

    describe('#validator()', function () {

      it("should return a validator/all", function () {
        var type = $floatType.create();
        var v = type.validator();
        expect($validators.all.prototype).to.be.prototypeOf(v);
      });

      it("should include a validator/prototype matching sulfur/schema/dateTime", function () {
        var type = $floatType.create();
        var v = type.validator();
        expect(v).to.eql($validators.all.create([
          $validators.prototype.create($float.prototype)
        ]));
      });

      it("should include a validator/enumeration when facet `enumeration` is defined", function () {
        var type = $floatType.create({ enumeration: [ $float.create(1) ] });
        var v = type.validator();
        expect(v).to.eql($validators.all.create([
          $validators.prototype.create($float.prototype),
          $validators.enumeration.create([ $float.create(1) ])
        ]));
      });

      it("should include a validator/maximum (exclusive) when facet `maxExclusive` is defined", function () {
        var type = $floatType.create({ maxExclusive: $float.create(1) });
        var v = type.validator();
        expect(v).to.eql($validators.all.create([
          $validators.prototype.create($float.prototype),
          $validators.maximum.create($float.create(1), { exclusive: true })
        ]));
      });

      it("should include a validator/maximum (inclusive) when facet `maxInclusive` is defined", function () {
        var type = $floatType.create({ maxInclusive: $float.create(1) });
        var v = type.validator();
        expect(v).to.eql($validators.all.create([
          $validators.prototype.create($float.prototype),
          $validators.maximum.create($float.create(1))
        ]));
      });

      it("should include a validator/minimum (exclusive) when facet `minExclusive` is defined", function () {
        var type = $floatType.create({ minExclusive: $float.create(1) });
        var v = type.validator();
        expect(v).to.eql($validators.all.create([
          $validators.prototype.create($float.prototype),
          $validators.minimum.create($float.create(1), { exclusive: true })
        ]));
      });

      it("should include a validator/minimum (inclusive) when facet `minInclusive` is defined", function () {
        var type = $floatType.create({ minInclusive: $float.create(1) });
        var v = type.validator();
        expect(v).to.eql($validators.all.create([
          $validators.prototype.create($float.prototype),
          $validators.minimum.create($float.create(1))
        ]));
      });

      it("should include a validator/some with validator/pattern when facet `pattern` is defined", function () {
        var type = $floatType.create({ patterns: [ $pattern.create('[0-9]\\.[0-9]{2}') ] });
        var v = type.validator();
        expect(v).to.eql($validators.all.create([
          $validators.prototype.create($float.prototype),
          $validators.some.create([ $validators.pattern.create($pattern.create('[0-9]\\.[0-9]{2}')) ])
        ]));
      });

    });

  });

});
