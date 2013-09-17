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
  'sulfur/schema/type/string',
  'sulfur/schema/validators',
  'sulfur/schema/value/string'
], function ($shared, $pattern, $stringType, $validators, $stringValue) {

  'use strict';

  var expect = $shared.expect;
  var bind = $shared.bind;

  describe('sulfur/schema/type/string', function () {

    describe('.validateFacets()', function () {

      context("with facet `enumeration`", function () {

        it("should accept an array of sulfur/schema/value/string", function () {
          expect($stringType.validateFacets({
            enumeration: [ $stringValue.create() ]
          })).to.be.true;
        });

        context("when empty", function () {

          it("should reject", function () {
            expect($stringType.validateFacets({ enumeration: [] })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $stringType.validateFacets({ enumeration: [] }, errors);
            expect(errors).to.include.something.eql([
              'enumeration',
              "must specify at least one sulfur/schema/value/string value"
            ]);
          });

        });

        context("when empty", function () {

          it("should reject", function () {
            expect($stringType.validateFacets({ enumeration: [''] })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $stringType.validateFacets({ enumeration: [''] }, errors);
            expect(errors).to.include.something.eql([
              'enumeration',
              "must specify only sulfur/schema/value/string values"
            ]);
          });

        });

      });

      context("with facet `maxLength`", function () {

        it("should accept positive integers", function () {
          expect($stringType.validateFacets({ maxLength: 3 })).to.be.true;
        });

        context("with a negative value", function () {

          it("should reject", function () {
            expect($stringType.validateFacets({ maxLength: -1 })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $stringType.validateFacets({ maxLength: -1 }, errors);
            expect(errors).to.include.something.eql([
              'maxLength',
              "must be a non-negative integer"
            ]);
          });

        });

        context("with a non-integer", function () {

          it("should reject", function () {
            expect($stringType.validateFacets({ maxLength: 1.2 })).to.be.false;
          });

          it("should add validation error", function () {
            var errors = [];
            $stringType.validateFacets({ maxLength: 1.2 }, errors);
            expect(errors).to.include.something.eql([
              'maxLength',
              "must be a non-negative integer"
            ]);
          });

        });

        context("with a value less than `minLength`", function () {

          it("should reject", function () {
            expect($stringType.validateFacets({ maxLength: 1, minLength: 3 })).to.be.false;
          });

          it("should add validation error", function () {
            var errors = [];
            $stringType.validateFacets({ maxLength: 1, minLength: 3 }, errors);
            expect(errors).to.include.something.eql([
              'maxLength',
              "must be greater than or equal to facet minLength"
            ]);
          });

        });

      });

      context("with facet `minLength`", function () {

        it("should accept positive integers", function () {
          expect($stringType.validateFacets({ minLength: 1 })).to.be.true;
        });

        context("with a negative value", function () {

          it("should reject", function () {
            expect($stringType.validateFacets({ minLength: -1 })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $stringType.validateFacets({ minLength: -1 }, errors);
            expect(errors).to.include.something.eql([
              'minLength',
              "must be a non-negative integer"
            ]);
          });

        });

        context("with a non-integer value", function () {

          it("should reject", function () {
            expect($stringType.validateFacets({ minLength: 1.2 })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $stringType.validateFacets({ minLength: 1.2 }, errors);
            expect(errors).to.include.something.eql([
              'minLength',
              "must be a non-negative integer"
            ]);
          });

        });

      });

      context("with facet `patterns`", function () {

        it("should accept an array of XSD patterns", function () {
          expect($stringType.validateFacets({
            patterns: [ $pattern.create('') ]
          })).to.be.true;
        });

        context("with an empty array", function () {

          it("should reject", function () {
            expect($stringType.validateFacets({ patterns: [] })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $stringType.validateFacets({ patterns: [] }, errors);
            expect(errors).to.include.something.eql([
              'patterns',
              "must specify at least one sulfur/schema/pattern"
            ]);
          });

        });

        context("with any non-pattern", function () {

          it("should reject", function () {
            expect($stringType.validateFacets({ patterns: [''] })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $stringType.validateFacets({ patterns: [''] }, errors);
            expect(errors).to.include.something.eql([
              'patterns',
              "must specify only sulfur/schema/pattern"
            ]);
          });

        });

      });

    });

    describe('#initialize()', function () {

      it("should be callable without any facets", function () {
        expect(bind($stringType, 'create')).to.not.throw();
      });

      it("should throw any of the validation errors when .validateFacets() returns false", function () {
        expect(bind($stringType, 'create', { patterns: [] }))
          .to.throw("facet patterns must specify at least one sulfur/schema/pattern");
      });

      context("when .validateFacets() returns true", function () {

        context("with facet `enumeration`", function () {

          it("should use the values", function () {
            var type = $stringType.create({ enumeration: [ $stringValue.create() ] });
            expect(type.getEnumerationValues()).to.eql([ $stringValue.create() ]);
          });

          it("should ignore duplicate values", function () {
            var type = $stringType.create({
              enumeration: [
                $stringValue.create('\u00C5'),
                $stringValue.create('\u0041\u030A')
              ]
            });
            expect(type.getEnumerationValues()).to.eql([ $stringValue.create('\u00C5') ]);
          });

        });

        it("should use facet `maxLength` when given", function () {
          var type = $stringType.create({ maxLength: 3 });
          expect(type.getMaxLengthValue()).to.equal(3);
        });

        it("should use facet `minLength` when given", function () {
          var type = $stringType.create({ minLength: 3 });
          expect(type.getMinLengthValue()).to.equal(3);
        });

        context("with facet `patterns`", function () {

          it("should use the patterns", function () {
            var type = $stringType.create({ patterns: [ $pattern.create('') ] });
            expect(type.getPatternValues()).to.eql([ $pattern.create('') ]);
          });

          it("should ignore duplicate patterns based on their source", function () {
            var type = $stringType.create({
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
        var type = $stringType.create();
        expect(type.getEnumerationValues()).to.be.undefined;
      });

      it("should return the values of facet `enumeration` when defined", function () {
        var values = [ $stringValue.create() ];
        var type = $stringType.create({ enumeration: values });
        expect(type.getEnumerationValues()).to.eql(values);
      });

    });

    describe('#getMaxLengthValue()', function () {

      it("should return undefined if facet `minExclusive` is not defined", function () {
        var type = $stringType.create();
        expect(type.getMaxLengthValue()).to.be.undefined;
      });

      it("should return the values of facet `minExclusive` when defined", function () {
        var type = $stringType.create({ maxLength: 3 });
        expect(type.getMaxLengthValue()).to.eql(3);
      });

    });

    describe('#getMinLengthValue()', function () {

      it("should return undefined if facet `minInclusive` is not defined", function () {
        var type = $stringType.create();
        expect(type.getMinLengthValue()).to.be.undefined;
      });

      it("should return the values of facet `minInclusive` when defined", function () {
        var type = $stringType.create({ minLength: 1 });
        expect(type.getMinLengthValue()).to.eql(1);
      });

    });

    describe('#getPatternValues()', function () {

      it("should return undefined if facet `enumeration` is not defined", function () {
        var type = $stringType.create();
        expect(type.getPatternValues()).to.be.undefined;
      });

      it("should return the values of facet `enumeration` when defined", function () {
        var patterns = [ $pattern.create('.') ];
        var type = $stringType.create({ patterns: patterns });
        expect(type.getPatternValues()).to.eql(patterns);
      });

    });

    describe('#validator()', function () {

      it("should return a validator/all", function () {
        var type = $stringType.create();
        var v = type.validator();
        expect($validators.all.prototype).to.be.prototypeOf(v);
      });

      it("should include a validator/enumeration when facet `enumeration` is defined", function () {
        var type = $stringType.create({ enumeration: [ $stringValue.create() ] });
        var v = type.validator();
        expect(v).to.eql($validators.all.create([
          $validators.enumeration.create([ $stringValue.create() ], { testMethod: 'eq' })
        ]));
      });

      it("should include a validator/length when facet `maxLength` is defined", function () {
        var type = $stringType.create({ maxLength: 3 });
        var v = type.validator();
        expect(v).to.eql($validators.all.create([
          $validators.length.create({ max: 3 })
        ]));
      });

      it("should include a validator/length when facet `minLength` is defined", function () {
        var type = $stringType.create({ minLength: 1 });
        var v = type.validator();
        expect(v).to.eql($validators.all.create([
          $validators.length.create({ min: 1 })
        ]));
      });

      it("should include a validator/some with validator/pattern when facet `pattern` is defined", function () {
        var type = $stringType.create({ patterns: [ $pattern.create('.') ] });
        var v = type.validator();
        expect(v).to.eql($validators.all.create([
          $validators.some.create([
            $validators.pattern.create($pattern.create('.'))
          ])
        ]));
      });

    });

  });

});
