/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global context, describe, it */

define([
  'shared',
  'sulfur/schema/type/string',
  'sulfur/schema/pattern',
  'sulfur/schema/regex',
  'sulfur/schema/validators'
], function ($shared, $stringType, $pattern, $regex, $validators) {

  'use strict';

  var expect = $shared.expect;
  var bind = $shared.bind;

  describe('sulfur/schema/type/string', function () {

    describe('.validateFacets()', function () {

      context("with facet `enumeration`", function () {

        it("should accept an array of strings", function () {
          expect($stringType.validateFacets({ enumeration: ['a'] })).to.be.true;
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
              "must specify at least one value"
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
              "must specify at least one XSD pattern"
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
              "must specify only XSD patterns"
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
          .to.throw("facet patterns must specify at least one XSD pattern");
      });

      context("when .validateFacets() returns true", function () {

        it("should use facet `maxLength` when given", function () {
          var type = $stringType.create({ maxLength: 3 });
          expect(type.maxLength).to.equal(3);
        });

        it("should use facet `minLength` when given", function () {
          var type = $stringType.create({ minLength: 3 });
          expect(type.minLength).to.equal(3);
        });

        context("with facet `enumeration`", function () {

          it("should use the facet", function () {
            var type = $stringType.create({ enumeration: [''] });
            expect(type.enumeration).to.eql(['']);
          });

          it("should normalize each value to NFC", function () {
            var type = $stringType.create({ enumeration: ['\u0065\u0301'] });
            expect(type.enumeration).to.eql(['\u00E9']);
          });

          it("should ignore duplicate values after normalization", function () {
            var type = $stringType.create({ enumeration: ['\u00C5', '\u0041\u030A'] });
            expect(type.enumeration).to.eql(['\u00C5']);
          });

        });

        context("with facet `patterns`", function () {

          it("should use the facet", function () {
            var type = $stringType.create({ patterns: [ $pattern.create('') ] });
            expect(type.patterns).to.eql([ $pattern.create('') ]);
          });

          it("should ignore duplicate patterns", function () {
            var type = $stringType.create({
              patterns: [
                $pattern.create('.'),
                $pattern.create('.')
              ]
            });
            expect(type.patterns).to.eql([ $pattern.create('.') ]);
          });

        });

      });

    });

    describe('#validator()', function () {

      it("should return a validator/all", function () {
        var type = $stringType.create();
        var v = type.validator();
        expect($validators.all.prototype).to.be.prototypeOf(v);
      });

      it("should include a validator/enumeration when facet `enumeration` is defined", function () {
        var type = $stringType.create({ enumeration: [ 'a', 'b' ] });
        var v = type.validator();
        expect(v).to.eql($validators.all.create([
          $validators.enumeration.create([ 'a', 'b' ])
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
        var type = $stringType.create({
          patterns: [
            $pattern.create('a'),
            $pattern.create('b')
          ]
        });

        var v = type.validator();

        expect(v).to.eql($validators.all.create([
          $validators.some.create([
            $validators.pattern.create($pattern.create('a')),
            $validators.pattern.create($pattern.create('b'))
          ])
        ]));
      });

    });

  });

});