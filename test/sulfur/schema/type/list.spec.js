/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global beforeEach, context, describe, it */

define([
  'shared',
  'sulfur/schema/type/list',
  'sulfur/schema/validators'
], function ($shared, $listType, $validators) {

  'use strict';

  var expect = $shared.expect;
  var bind = $shared.bind;

  describe('sulfur/schema/type/list', function () {

    describe('.validateFacets()', function () {

      context("with facet `maxLength`", function () {

        it("should accept non-negative integers", function () {
          expect($listType.validateFacets({ maxLength: 0 })).to.be.true;
        });

        context("with a negative value", function () {

          it("should reject", function () {
            expect($listType.validateFacets({ maxLength: -1 })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $listType.validateFacets({ maxLength: -1 }, errors);
            expect(errors).to.include.something.eql([
              'maxLength',
              "must not be negative"
            ]);
          });

        });

        context("with a value less than `minLength`", function () {

          it("should reject", function () {
            expect($listType.validateFacets({ maxLength: 1, minLength: 3 })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $listType.validateFacets({ maxLength: 1, minLength: 3 }, errors);
            expect(errors).to.include.something.eql([
              'maxLength',
              "must be greater than or equal to facet minLength"
            ]);
          });

        });

      });

      context("with facet `minLength`", function () {

        it("should accept non-negative integers", function () {
          expect($listType.validateFacets({ minLength: 0 })).to.be.true;
        });

        context("with a negative value", function () {

          it("should reject", function () {
            expect($listType.validateFacets({ minLength: -1 })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $listType.validateFacets({ minLength: -1 }, errors);
            expect(errors).to.include.something.eql([
              'minLength',
              "must not be negative"
            ]);
          });

        });

      });

    });

    describe('#initialize()', function () {

      it("should be callable without any facets", function () {
        expect(bind($listType, 'create')).to.not.throw();
      });

      it("should throw any of the validation errors when .validateFacets() returns false", function () {
        expect(bind($listType, 'create', {}, { maxLength: -1 }))
          .to.throw("facet maxLength must not be negative");
      });

      context("when .validateFacets() returns true", function () {

        it("should use facet `maxLength` when given", function () {
          var type = $listType.create({}, { maxLength: 3 });
          expect(type.maxLength).to.equal(3);
        });

        it("should use facet `minLength` when given", function () {
          var type = $listType.create({}, { minLength: 3 });
          expect(type.minLength).to.equal(3);
        });

      });

    });

    describe('#itemType', function () {

      it("should return the list's item type", function () {
        var itemType = {};
        var type = $listType.create(itemType);
        expect(type.itemType).to.equal(itemType);
      });

    });

    describe('#maxLength', function () {

      it("should return the lists's maximum allowed number of items", function () {
        var type = $listType.create({}, { maxLength: 3 });
        expect(type.maxLength).to.equal(3);
      });

    });

    describe('#minLength', function () {

      it("should return the list's minimum required number of items", function () {
        var type = $listType.create({}, { minLength: 1 });
        expect(type.minLength).to.equal(1);
      });

    });

    describe('#validator()', function () {

      var itemType;

      beforeEach(function () {
        var itemValidator = { dummy: 1 };
        itemType = {
          validator: function () {
            return itemValidator;
          }
        };
      });

      it("should return a validator/all", function () {
        var type = $listType.create(itemType);
        var v = type.validator();
        expect($validators.all.prototype).to.be.prototypeOf(v);
      });

      it("should include a sulfur/schema/validator/each using the item validator", function () {
        var type = $listType.create(itemType);
        var v = type.validator();
        expect(v).to.eql($validators.all.create([
          $validators.each.create(type.itemType.validator())
        ]));
      });

      it("should include a validator/length when facet `maxLength` is defined", function () {
        var type = $listType.create(itemType, { maxLength: 3 });
        var v = type.validator();
        expect(v).to.eql($validators.all.create([
          $validators.each.create(type.itemType.validator()),
          $validators.length.create({ max: 3 })
        ]));
      });

      it("should include a validator/length when facet `minLength` is defined", function () {
        var type = $listType.create(itemType, { minLength: 1 });
        var v = type.validator();
        expect(v).to.eql($validators.all.create([
          $validators.each.create(type.itemType.validator()),
          $validators.length.create({ min: 1 })
        ]));
      });

    });

  });

});
