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
  'sulfur/schema/regex/pattern'
], function (shared, Branch, Pattern) {

  'use strict';

  var expect = shared.expect;
  var sinon = shared.sinon;
  var bind = shared.bind;

  describe('sulfur/schema/regex/pattern', function () {

    describe('#initialize()', function () {

      it("should initialize the pattern with the given branches", function () {
        var p = Pattern.create([Branch.create()]);
        expect(p.branches).to.eql([Branch.create()]);
      });

      context("with no branches", function () {

        it("should throw", function () {
          expect(bind(Pattern, 'create', []))
            .to.throw("pattern must contain at least one branch");
        });

      });

    });

    describe('#containsEmptyGroup', function () {

      it("should call .containsEmptyGroup on each branch", function () {
        var branch = { containsEmptyGroup: function () {} };
        var spy = sinon.spy(branch, 'containsEmptyGroup');
        var pattern = Pattern.create([branch]);
        pattern.containsEmptyGroup();
        expect(spy).to.be.calledOn(pattern.branches[0]);
      });

      it("should return as soon .containsEmptyGroup return true on some branch", function () {
        var trueBranch = Branch.create();
        var falseBranch = Branch.create();
        var pattern = Pattern.create([
          trueBranch,
          falseBranch
        ]);
        var trueSpy = sinon.stub(trueBranch, 'containsEmptyGroup').returns(true);
        var falseSpy = sinon.stub(falseBranch, 'containsEmptyGroup').returns(false);
        pattern.containsEmptyGroup();
        expect(trueSpy).to.be.calledOn(trueBranch);
        expect(falseSpy).to.not.be.called;
      });

    });

    describe('#containsGroupWithSurrogateCodepoints', function () {

      it("should call .containsGroupWithSurrogateCodepoints on each branch", function () {
        var branch = Branch.create();
        var spy = sinon.spy(branch, 'containsGroupWithSurrogateCodepoints');
        var pattern = Pattern.create([branch]);
        pattern.containsGroupWithSurrogateCodepoints();
        expect(spy).to.be.calledOn(pattern.branches[0]);
      });

      it("should return as soon .containsGroupWithSurrogateCodepoints return true on some branch", function () {
        var trueBranch = Branch.create();
        var falseBranch = Branch.create();
        var trueSpy = sinon.stub(trueBranch, 'containsGroupWithSurrogateCodepoints').returns(true);
        var falseSpy = sinon.spy(falseBranch, 'containsGroupWithSurrogateCodepoints');
        var pattern = Pattern.create([
          trueBranch,
          falseBranch
        ]);
        pattern.containsGroupWithSurrogateCodepoints();
        expect(trueSpy).to.be.calledOn(trueBranch);
        expect(falseSpy).to.not.be.called;
      });

    });

  });

});
