/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global context, describe, it */

define([
  'shared',
  'sulfur/schema/boolean',
  'sulfur/schema/pattern',
  'sulfur/schema/type/boolean',
  'sulfur/schema/validators'
], function ($shared, $boolean, $pattern, $booleanType, $validators) {

  'use strict';

  var expect = $shared.expect;
  var bind = $shared.bind;

  describe('sulfur/schema/type/boolean', function () {

    describe('.validateFacets()', function () {

      context("with facet `enumeration`", function () {

        it("should accept an array of sulfur/schema/boolean values", function () {
          expect($booleanType.validateFacets({
            enumeration: [ $boolean.create(true) ]
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
              "must specify at least one sulfur/schema/boolean value"
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
              "must specify only sulfur/schema/boolean values"
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

        it("should use facet `enumeration` when given", function () {
          var type = $booleanType.create({
            enumeration: [ $boolean.create(true) ]
          });
          expect(type.enumeration).to.eql([ $boolean.create(true) ]);
        });

        it("should ignore duplicate values in facet `enumeration`", function () {
          var type = $booleanType.create({
            enumeration: [
              $boolean.create(true),
              $boolean.create(true)
            ]
          });
          expect(type.enumeration).to.eql([ $boolean.create(true) ]);
        });

        it("should use facet `patterns` when given", function () {
          var type = $booleanType.create({ patterns: [ $pattern.create('true') ] });
          expect(type.patterns).to.eql([$pattern.create('true')]);
        });

        it("should ignore duplicate patterns in facet `patterns` based on their source", function () {
          var type = $booleanType.create({
            patterns: [
              $pattern.create('true'),
              $pattern.create('true')
            ]
          });
          expect(type.patterns).to.eql([ $pattern.create('true') ]);
        });

      });

    });

    describe('#validator()', function () {

      it("should return a validator/all", function () {
        var type = $booleanType.create();
        var v = type.validator();
        expect($validators.all.prototype).to.be.prototypeOf(v);
      });

      it("should include a validator/prototype matching sulfur/schema/boolean", function () {
        var type = $booleanType.create();
        var v = type.validator();
        expect(v).to.eql($validators.all.create([
          $validators.prototype.create($boolean.prototype)
        ]));
      });

      it("should include a validator/enumeration when facet `enumeration` is defined", function () {
        var type = $booleanType.create({
          enumeration: [ $boolean.create(true) ]
        });
        var v = type.validator();
        expect(v).to.eql($validators.all.create([
          $validators.prototype.create($boolean.prototype),
          $validators.enumeration.create([ $boolean.create(true) ])
        ]));
      });

      it("should include a validator/some with validator/pattern when facet `pattern` is defined", function () {
        var type = $booleanType.create({
          patterns: [ $pattern.create('true') ]
        });
        var v = type.validator();
        expect(v).to.eql($validators.all.create([
          $validators.prototype.create($boolean.prototype),
          $validators.some.create([
            $validators.pattern.create($pattern.create('true'))
          ])
        ]));
      });

    });

  });

});
