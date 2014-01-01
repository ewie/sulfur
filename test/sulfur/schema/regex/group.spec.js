/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global beforeEach, context, describe, it */

define([
  'shared',
  'sulfur/schema/regex/codepoint',
  'sulfur/schema/regex/codeunit',
  'sulfur/schema/regex/group',
  'sulfur/schema/regex/range'
], function (shared, Codepoint, Codeunit, Group, Range) {

  'use strict';

  var expect = shared.expect;

  describe('sulfur/schema/regex/group', function () {

    describe('#initialize()', function () {

      context("with no items", function () {

        it("should initialize an empty group", function () {
          var group = Group.create();
          expect(group.isEmpty()).to.be.true;
        });

      });

      it("should initialize the group with the given items", function () {
        var group = Group.create([Codepoint.create('a')]);
        expect(group.items).to.eql([Codepoint.create('a')]);
      });

      context("with no options", function () {

        var group;

        beforeEach(function () {
          group = Group.create([Codepoint.create('a')]);
        });

        it("should create a positive group", function () {
          expect(group.positive).to.be.true;
        });

        it("should use no subtrahend", function () {
          expect(group.subtrahend).to.be.undefined;
        });

      });

      describe("option `positive`", function () {

        context("when true", function () {

          it("should create a positive group", function () {
            var group = Group.create(
              [Codepoint.create('a')],
              { positive: true });
            expect(group.positive).to.be.true;
          });

        });

        context("when false", function () {

          it("should create a negative group", function () {
            var group = Group.create(
              [Codepoint.create('a')],
              { positive: false });
            expect(group.positive).to.be.false;
          });

        });

        context("when undefined", function () {

          it("should create a positive group", function () {
            var group = Group.create(
              [Codepoint.create('a')],
              {});
            expect(group.positive).to.be.true;
          });

        });

      });

      describe("option `subtract`", function () {

        context("when given", function () {

          it("should use that object as subtrahend", function () {
            var sub = Group.create([Codepoint.create('b')]);
            var group = Group.create(
              [Codepoint.create('a')],
              { subtract: sub });

            expect(group.subtrahend).to.equal(sub);
          });

        });

        context("when undefined", function () {

          it("should use no subtrahend", function () {
            var group = Group.create(
              [Codepoint.create('a')],
              {});
            expect(group.subtrahend).to.be.undefined;
          });

        });

      });

    });

    describe('#isEmpty()', function () {

      context("with no items", function () {

        it("should return true", function () {
          var group = Group.create();
          expect(group.isEmpty()).to.be.true;
        });

      });

      context("with one or more items", function () {

        it("should return false", function () {
          var group = Group.create([Codepoint.create('a')]);
          expect(group.isEmpty()).to.be.false;
        });

      });

    });

    describe('#containsSurrogateCodepoints()', function () {

      context("when the group contains a surrogate codepoint", function () {

        it("should return true", function () {
          var group = Group.create([Codeunit.create(0xD800)]);
          expect(group.containsSurrogateCodepoints()).to.be.true;
        });

      });

      context("when the group contains a range with surrogate codepoints", function () {

        it("should return true", function () {
          var group = Group.create(
            [Range.create(
              Codeunit.create(0x20),
              Codeunit.create(0xD800))
            ]);
          expect(group.containsSurrogateCodepoints()).to.be.true;
        });

      });

      context("when the group contains no surrogate codepoints", function () {

        it("should return false", function () {
          var group = Group.create();
          expect(group.containsSurrogateCodepoints()).to.be.false;
        });

      });

    });

  });

});
