/* Copyright (c) 2013, Erik Wienhold
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
  'sulfur/schema/regex/piece'
], function ($shared, $branch, $codepoint, $piece) {

  'use strict';

  var expect = $shared.expect;
  var sinon = $shared.sinon;

  describe('sulfur/schema/regex/branch', function () {

    describe('#initialize()', function () {

      it("should initialize the branch with the given pieces", function () {
        var b = $branch.create([$piece.create($codepoint.create('a'))]);
        expect(b.pieces).to.eql([$piece.create($codepoint.create('a'))]);
      });

      context("with no arguments", function () {

        it("should create an empty branch", function () {
          var b = $branch.create();
          expect(b.pieces).to.have.length(0);
        });

      });

    });

    describe('#containsEmptyGroup', function () {

      it("should call .containsEmptyGroup on each piece", function () {
        var piece = { containsEmptyGroup: function () {} };
        var spy = sinon.spy(piece, 'containsEmptyGroup');
        var branch = $branch.create([piece]);
        branch.containsEmptyGroup();
        expect(spy).to.be.calledOn(branch.pieces[0]);
      });

      it("should return as soon .containsEmptyGroup returns true on some piece", function () {
        var truePiece = { containsEmptyGroup: function () { return true; } };
        var falsePiece = { containsEmptyGroup: function () {} };
        var trueSpy = sinon.spy(truePiece, 'containsEmptyGroup');
        var falseSpy = sinon.spy(falsePiece, 'containsEmptyGroup');
        var branch = $branch.create([
          truePiece,
          falsePiece
        ]);
        branch.containsEmptyGroup();
        expect(trueSpy).to.be.calledOn(truePiece);
        expect(falseSpy).to.not.be.called;
      });

    });

    describe('#containsGroupWithSurrogateCodepoints', function () {

      it("should call .containsGroupWithSurrogateCodepoints on each piece", function () {
        var piece = { containsGroupWithSurrogateCodepoints: function () {} };
        var spy = sinon.spy(piece, 'containsGroupWithSurrogateCodepoints');
        var branch = $branch.create([piece]);
        branch.containsGroupWithSurrogateCodepoints();
        expect(spy).to.be.calledOn(branch.pieces[0]);
      });

      it("should return as soon .containsGroupWithSurrogateCodepoints returns true on some piece", function () {
        var truePiece = { containsGroupWithSurrogateCodepoints: function () { return true; } };
        var falsePiece = { containsGroupWithSurrogateCodepoints: function () {} };
        var trueSpy = sinon.spy(truePiece, 'containsGroupWithSurrogateCodepoints');
        var falseSpy = sinon.spy(falsePiece, 'containsGroupWithSurrogateCodepoints');
        var branch = $branch.create([
          truePiece,
          falsePiece
        ]);
        branch.containsGroupWithSurrogateCodepoints();
        expect(trueSpy).to.be.calledOn(truePiece);
        expect(falseSpy).to.not.be.called;
      });

    });

  });

});
