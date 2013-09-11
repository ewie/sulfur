/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global context, describe, it */

define([
  'shared',
  'sulfur/schema/type/boolean',
  'sulfur/schema/pattern',
  'sulfur/schema/validators'
], function ($shared, $booleanType, $pattern, $validators) {

  'use strict';

  var expect = $shared.expect;
  var bind = $shared.bind;

  describe('sulfur/schema/type/boolean', function () {

    describe('.validateFacets()', function () {

      context("with facet `enumeration`", function () {

        it("should accept value 'true'", function () {
          expect($booleanType.validateFacets({ enumeration: ['true'] })).to.be.true;
        });

        it("should accept value 'false'", function () {
          expect($booleanType.validateFacets({ enumeration: ['false'] })).to.be.true;
        });

        it("should accept value '1'", function () {
          expect($booleanType.validateFacets({ enumeration: ['1'] })).to.be.true;
        });

        it("should accept value '0'", function () {
          expect($booleanType.validateFacets({ enumeration: ['0'] })).to.be.true;
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
              "must specify at least one of 'true', '1', 'false' or '0'"
            ]);
          });

        });

        context("with non-boolean values", function () {

          it("should reject", function () {
            expect($booleanType.validateFacets({ enumeration: ['xxx'] })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $booleanType.validateFacets({ enumeration: ['xxx'] }, errors);
            expect(errors).to.include.something.eql([
              'enumeration',
              "must specify only boolean values 'true', '1', 'false' or '0'"
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
              "must specify at least one XSD pattern"
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
              "must specify only XSD patterns"
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
          .to.throw("facet patterns must specify at least one XSD pattern");
      });

      context("when .validateFacets() returns true", function () {

        it("should use facet `enumeration` when given", function () {
          var type = $booleanType.create({ enumeration: ['true'] });
          expect(type.enumeration).to.eql(['true']);
        });

        it("should ignore duplicate values in facet `enumeration`", function () {
          var type = $booleanType.create({ enumeration: ['true', 'true'] });
          expect(type.enumeration).to.eql(['true']);
        });

        it("should use facet `patterns` when given", function () {
          var type = $booleanType.create({ patterns: [$pattern.create('.')] });
          expect(type.patterns).to.eql([$pattern.create('.')]);
        });

        it("should ignore duplicate patterns in facet `patterns` based on their source", function () {
          var type = $booleanType.create({
            patterns: [
              $pattern.create('.'),
              $pattern.create('.')
            ]
          });
          expect(type.patterns).to.eql([$pattern.create('.')]);
        });

      });

    });

    describe('#validator()', function () {

      it("should return a validator/all", function () {
        var type = $booleanType.create();
        var v = type.validator();
        expect($validators.all.prototype).to.be.prototypeOf(v);
      });

      it("should include a validator/pattern matching only boolean literals", function () {
        var type = $booleanType.create();
        var v = type.validator();
        expect(v).to.eql($validators.all.create([
          $validators.pattern.create(/^(?:true|false|1|0)$/)
        ]));
      });

      it("should include a validator/enumeration when facet `enumeration` is defined", function () {
        var type = $booleanType.create({ enumeration: [ 'true', '1' ] });
        var v = type.validator();
        expect(v).to.eql($validators.all.create([
          $validators.pattern.create(/^(?:true|false|1|0)$/),
          $validators.enumeration.create([ 'true', '1' ])
        ]));
      });

      it("should include a validator/some with validator/pattern when facet `pattern` is defined", function () {
        var type = $booleanType.create({
          patterns: [
            $pattern.create('true'),
            $pattern.create('1')
          ]
        });
        var v = type.validator();
        expect(v).to.eql($validators.all.create([
          $validators.pattern.create(/^(?:true|false|1|0)$/),
          $validators.some.create([
            $validators.pattern.create($pattern.create('true')),
            $validators.pattern.create($pattern.create('1'))
          ])
        ]));
      });

    });

  });

});
