/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global context, describe, it */

define([
  'shared',
  'sulfur/schema/regex/branch',
  'sulfur/schema/regex/codepoint',
  'sulfur/schema/regex/codeunit',
  'sulfur/schema/regex/group',
  'sulfur/schema/regex/pattern',
  'sulfur/schema/regex/piece',
  'sulfur/schema/regex/quant'
], function (
    shared,
    Branch,
    Codepoint,
    Codeunit,
    Group,
    Pattern,
    Piece,
    Quant
) {

  'use strict';

  var expect = shared.expect;
  var sinon = shared.sinon;

  describe('sulfur/schema/regex/piece', function () {

    describe('#initialize()', function () {

      it("should initialize the piece with the given atom", function () {
        var c = Codepoint.create('a');
        var p = Piece.create(c);
        expect(p.atom).to.equal(c);
      });

      it("should initialize the piece with the given quantifier", function () {
        var c = Codepoint.create('a');
        var q = Quant.create(1, 3);
        var p = Piece.create(c, q);
        expect(p.quant).to.equal(q);
      });

      context("when called without quantifier", function () {

        it("should use a quantifier of exactly 1", function () {
          var p = Piece.create();
          expect(p.quant).to.eql(Quant.create(1));
        });

      });

    });

    describe('#containsEmptyGroup()', function () {

      context("when .atom is a group", function () {

        it("should return the result of calling .isEmpty on the group", function () {
          var group = Group.create();
          var spy = sinon.spy(group, 'isEmpty');
          var piece = Piece.create(group);
          var result = piece.containsEmptyGroup();
          expect(spy).to.be.calledOn(piece.atom);
          expect(result).to.equal(spy.getCall(0).returnValue);
        });

      });

      context("when .atom is a pattern", function () {

        it("should return the result of calling .containsEmptyGroup on the pattern", function () {
          var pattern = Pattern.create([ Branch.create() ]);
          var spy = sinon.spy(pattern, 'containsEmptyGroup');
          var piece = Piece.create(pattern);
          var result = piece.containsEmptyGroup();
          expect(spy).to.be.calledOn(piece.atom);
          expect(result).to.equal(spy.getCall(0).returnValue);
        });

      });

      context("when .atom is anything else", function () {

        it("should return false", function () {
          var piece = Piece.create(Codepoint.create('a'));
          expect(piece.containsEmptyGroup()).to.be.false;
        });

      });

    });

    describe('#containsGroupWithSurrogateCodepoints()', function () {

      context("when .atom is a group", function () {

        it("should return the result of calling .containsSurrogateCodepoints on the group", function () {
          var group = Group.create([ Codeunit.create(0xD800) ]);
          var spy = sinon.spy(group, 'containsSurrogateCodepoints');
          var piece = Piece.create(group);
          var result = piece.containsGroupWithSurrogateCodepoints();
          expect(spy).to.be.calledOn(piece.atom);
          expect(result).to.equal(spy.getCall(0).returnValue);
        });

      });

      context("when .atom is a pattern", function () {

        it("should return the result of calling .containsGroupWithSurrogateCodepoints on the pattern", function () {
          var pattern = Pattern.create([ Branch.create() ]);
          var spy = sinon.spy(pattern, 'containsGroupWithSurrogateCodepoints');
          var piece = Piece.create(pattern);
          var result = piece.containsGroupWithSurrogateCodepoints();
          expect(spy).to.be.calledOn(piece.atom);
          expect(result).to.equal(spy.getCall(0).returnValue);
        });

      });

      context("when .atom is anything else", function () {

        it("should return false", function () {
          var piece = Piece.create(Codepoint.create('a'));
          expect(piece.containsEmptyGroup()).to.be.false;
        });

      });

    });

  });

});
