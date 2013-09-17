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
  'sulfur/schema/type/boolean',
  'sulfur/schema/validators',
  'sulfur/schema/value/boolean'
], function ($shared, $pattern, $booleanType, $validators, $booleanValue) {

  'use strict';

  var expect = $shared.expect;
  var bind = $shared.bind;

  describe('sulfur/schema/type/boolean', function () {

    describe('.validateFacets()', function () {

      context("with facet `enumeration`", function () {

        it("should accept an array of sulfur/schema/value/boolean values", function () {
          expect($booleanType.validateFacets({
            enumeration: [ $booleanValue.create(true) ]
          })).to.be.true;
        });

        context("with no values", function () {

          it("should reject", function () {
            expect($booleanType.validateFacets({ enumeration: [] })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $booleanType.validateFacets({ enumeration: [] }, errors);
            expect(errors).to.include.something.eql([
              'enumeration',
              "must specify at least one sulfur/schema/value/boolean value"
            ]);
          });

        });

        context("with non-boolean values", function () {

          it("should reject", function () {
            expect($booleanType.validateFacets({ enumeration: [true] })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $booleanType.validateFacets({ enumeration: [true] }, errors);
            expect(errors).to.include.something.eql([
              'enumeration',
              "must specify only sulfur/schema/value/boolean values"
            ]);
          });

        });

      });

      context("with facet `patterns`", function () {

        it("should accept only valid patterns", function () {
          expect($booleanType.validateFacets({ patterns: [$pattern.create('.')] })).to.be.true;
        });

        context("with no patterns", function () {

          it("should reject", function () {
            expect($booleanType.validateFacets({ patterns: [] })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $booleanType.validateFacets({ patterns: [] }, errors);
            expect(errors).to.include.something.eql([
              'patterns',
              "must specify at least one pattern"
            ]);
          });

        });

        context("with invalid patterns", function () {

          it("should reject", function () {
            expect($booleanType.validateFacets({ patterns: ['.'] })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $booleanType.validateFacets({ patterns: ['.'] }, errors);
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
        expect(bind($booleanType, 'create')).to.not.throw();
      });

      it("should throw any of the validation errors when .validateFacets() returns false", function () {
        expect(bind($booleanType, 'create', { patterns: [] }))
          .to.throw("facet patterns must specify at least one pattern");
      });

      context("when .validateFacets() returns true", function () {

        context("with facet `enumeration`", function () {

          it("should use the values", function () {
            var type = $booleanType.create({
              enumeration: [ $booleanValue.create(true) ]
            });
            expect(type.getEnumerationValues()).to.eql([ $booleanValue.create(true) ]);
          });

          it("should ignore duplicate values", function () {
            var type = $booleanType.create({
              enumeration: [
                $booleanValue.create(true),
                $booleanValue.create(true)
              ]
            });
            expect(type.getEnumerationValues()).to.eql([ $booleanValue.create(true) ]);
          });

        });

        context("with facet `patterns`", function () {

          it("should use the patterns", function () {
            var type = $booleanType.create({ patterns: [ $pattern.create('true') ] });
            expect(type.getPatternValues()).to.eql([$pattern.create('true')]);
          });

          it("should ignore duplicate patterns based on their source", function () {
            var type = $booleanType.create({
              patterns: [
                $pattern.create('true'),
                $pattern.create('true')
              ]
            });
            expect(type.getPatternValues()).to.eql([ $pattern.create('true') ]);
          });

        });

      });

    });

    describe('#getEnumerationValues()', function () {

      it("should return values of facet `enumeration` when defined", function () {
        var values = [ $booleanValue.create(true) ];
        var type = $booleanType.create({ enumeration: values });
        expect(type.getEnumerationValues()).to.eql(values);
      });

      it("should return undefined when facet `enumeration` is not defined", function () {
        var type = $booleanType.create();
        expect(type.getEnumerationValues()).to.be.undefined;
      });

    });

    describe('#getPatternValues()', function () {

      it("should return the patterns of facet `patterns` when defined", function () {
        var patterns = [ $pattern.create('.') ];
        var type = $booleanType.create({ patterns: patterns });
        expect(type.getPatternValues()).to.eql(patterns);
      });

      it("should return undefined when facet `patterns` is not defined", function () {
        var type = $booleanType.create();
        expect(type.getPatternValues()).to.be.undefined;
      });

    });

    describe('#validator()', function () {

      it("should return a validator/all", function () {
        var type = $booleanType.create();
        var v = type.validator();
        expect($validators.all.prototype).to.be.prototypeOf(v);
      });

      it("should include a validator/prototype matching sulfur/schema/value/boolean", function () {
        var type = $booleanType.create();
        var v = type.validator();
        expect(v).to.eql($validators.all.create([
          $validators.prototype.create($booleanValue.prototype)
        ]));
      });

      it("should include a validator/enumeration when facet `enumeration` is defined", function () {
        var type = $booleanType.create({
          enumeration: [ $booleanValue.create(true) ]
        });
        var v = type.validator();
        expect(v).to.eql($validators.all.create([
          $validators.prototype.create($booleanValue.prototype),
          $validators.enumeration.create([ $booleanValue.create(true) ], { testMethod: 'eq' })
        ]));
      });

      it("should include a validator/some with validator/pattern when facet `pattern` is defined", function () {
        var type = $booleanType.create({
          patterns: [ $pattern.create('true') ]
        });
        var v = type.validator();
        expect(v).to.eql($validators.all.create([
          $validators.prototype.create($booleanValue.prototype),
          $validators.some.create([
            $validators.pattern.create($pattern.create('true'))
          ])
        ]));
      });

    });

  });

});
