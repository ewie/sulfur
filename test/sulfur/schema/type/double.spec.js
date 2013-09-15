/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global context, describe, it */

define([
  'shared',
  'sulfur/schema/double',
  'sulfur/schema/pattern',
  'sulfur/schema/type/double',
  'sulfur/schema/validators'
], function ($shared, $double, $pattern, $doubleType, $validators) {

  'use strict';

  var expect = $shared.expect;
  var bind = $shared.bind;

  describe('sulfur/schema/type/double', function () {

    describe('.validateFacets()', function () {

      context("with facet `enumeration`", function () {

        it("should accept an array of double values", function () {
          expect($doubleType.validateFacets({
            enumeration: [ $double.create() ]
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
          expect($doubleType.validateFacets({ maxExclusive: $double.create() })).to.be.true;
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
              maxExclusive: $double.create(),
              maxInclusive: $double.create()
            })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $doubleType.validateFacets({
              maxExclusive: $double.create(),
              maxInclusive: $double.create()
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
              maxExclusive: $double.create(1),
              minExclusive: $double.create(2)
            })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $doubleType.validateFacets({
              maxExclusive: $double.create(1),
              minExclusive: $double.create(2)
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
              maxExclusive: $double.create(1),
              minInclusive: $double.create(2)
            })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $doubleType.validateFacets({
              maxExclusive: $double.create(1),
              minInclusive: $double.create(2)
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
              maxExclusive: $double.create(),
              minInclusive: $double.create()
            })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $doubleType.validateFacets({
              maxExclusive: $double.create(),
              minInclusive: $double.create()
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
          expect($doubleType.validateFacets({ maxInclusive: $double.create() })).to.be.true;
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
              maxInclusive: $double.create(1),
              minExclusive: $double.create(2)
            })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $doubleType.validateFacets({
              maxInclusive: $double.create(1),
              minExclusive: $double.create(2)
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
              maxInclusive: $double.create(),
              minExclusive: $double.create()
            })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $doubleType.validateFacets({
              maxInclusive: $double.create(),
              minExclusive: $double.create()
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
              maxInclusive: $double.create(1),
              minInclusive: $double.create(2)
            })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $doubleType.validateFacets({
              maxInclusive: $double.create(1),
              minInclusive: $double.create(2)
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
          expect($doubleType.validateFacets({ minExclusive: $double.create() })).to.be.true;
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
              minExclusive: $double.create(),
              minInclusive: $double.create()
            })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $doubleType.validateFacets({
              minExclusive: $double.create(),
              minInclusive: $double.create()
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
          expect($doubleType.validateFacets({ minInclusive: $double.create() })).to.be.true;
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
            var d = $double.create();
            var type = $doubleType.create({ enumeration: [ d ] });
            expect(type.getEnumerationValues()).to.eql([ d ]);
          });

          it("should ignore duplicate values", function () {
            var type = $doubleType.create({
              enumeration: [
                $double.create(1),
                $double.create(1)
              ]
            });
            expect(type.getEnumerationValues()).to.eql([ $double.create(1) ]);
          });

        });

        it("should use facet `maxExclusive` when given", function () {
          var d = $double.create();
          var type = $doubleType.create({ maxExclusive: d });
          expect(type.getMaxExclusiveValue()).to.equal(d);
        });

        it("should use facet `maxInclusive` when given", function () {
          var d = $double.create();
          var type = $doubleType.create({ maxInclusive: d });
          expect(type.getMaxInclusiveValue()).to.equal(d);
        });

        it("should use facet `minExclusive` when given", function () {
          var d = $double.create();
          var type = $doubleType.create({ minExclusive: d });
          expect(type.getMinExclusiveValue()).to.equal(d);
        });

        it("should use facet `minInclusive` when given", function () {
          var d = $double.create();
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
        var values = [ $double.create() ];
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
        var value = $double.create();
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
        var value = $double.create();
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
        var value = $double.create();
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
        var value = $double.create();
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
          $validators.prototype.create($double.prototype)
        ]));
      });

      it("should include a validator/enumeration when facet `enumeration` is defined", function () {
        var type = $doubleType.create({ enumeration: [ $double.create(1) ] });
        var v = type.validator();
        expect(v).to.eql($validators.all.create([
          $validators.prototype.create($double.prototype),
          $validators.enumeration.create([ $double.create(1) ])
        ]));
      });

      it("should include a validator/maximum (exclusive) when facet `maxExclusive` is defined", function () {
        var type = $doubleType.create({ maxExclusive: $double.create(1) });
        var v = type.validator();
        expect(v).to.eql($validators.all.create([
          $validators.prototype.create($double.prototype),
          $validators.maximum.create($double.create(1), { exclusive: true })
        ]));
      });

      it("should include a validator/maximum (inclusive) when facet `maxInclusive` is defined", function () {
        var type = $doubleType.create({ maxInclusive: $double.create(1) });
        var v = type.validator();
        expect(v).to.eql($validators.all.create([
          $validators.prototype.create($double.prototype),
          $validators.maximum.create($double.create(1))
        ]));
      });

      it("should include a validator/minimum (exclusive) when facet `minExclusive` is defined", function () {
        var type = $doubleType.create({ minExclusive: $double.create(1) });
        var v = type.validator();
        expect(v).to.eql($validators.all.create([
          $validators.prototype.create($double.prototype),
          $validators.minimum.create($double.create(1), { exclusive: true })
        ]));
      });

      it("should include a validator/minimum (inclusive) when facet `minInclusive` is defined", function () {
        var type = $doubleType.create({ minInclusive: $double.create(1) });
        var v = type.validator();
        expect(v).to.eql($validators.all.create([
          $validators.prototype.create($double.prototype),
          $validators.minimum.create($double.create(1))
        ]));
      });

      it("should include a validator/some with validator/pattern when facet `pattern` is defined", function () {
        var type = $doubleType.create({ patterns: [ $pattern.create('[0-9]\\.[0-9]{2}') ] });
        var v = type.validator();
        expect(v).to.eql($validators.all.create([
          $validators.prototype.create($double.prototype),
          $validators.some.create([ $validators.pattern.create($pattern.create('[0-9]\\.[0-9]{2}')) ])
        ]));
      });

    });

  });

});
