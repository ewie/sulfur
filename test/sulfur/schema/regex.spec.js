/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global afterEach, beforeEach, describe, it */

define([
  'shared',
  'sulfur/schema/regex',
  'sulfur/schema/regex/branch',
  'sulfur/schema/regex/compiler',
  'sulfur/schema/regex/parser',
  'sulfur/schema/regex/pattern',
  'sulfur/schema/regex/translator'
], function (
    $shared,
    $regex,
    $branch,
    $compiler,
    $parser,
    $pattern,
    $translator
) {

  'use strict';

  var expect = $shared.expect;
  var sinon = $shared.sinon;

  describe('sulfur.schema.xsd.regex', function () {

    var sandbox;

    beforeEach(function () {
      sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
      sandbox.restore();
    });

    describe('#initialize()', function () {

      it("should initialize the regex with the given pattern", function () {
        var p = $pattern.create([ $branch.create() ]);
        var r = $regex.create(p);
        expect(r.pattern).to.eql(p);
      });

    });

    describe('#containsGroupWithSurrogateCodepoints()', function () {

      it("should return the result of calling .containsGroupWithSurrogateCodepoints on .pattern", function () {
        var p = $pattern.create([ $branch.create() ]);
        var r = $regex.create(p);
        var spy = sinon.spy(p, 'containsGroupWithSurrogateCodepoints');
        var result = r.containsGroupWithSurrogateCodepoints();
        expect(spy).to.be.called;
        expect(result).to.be.equal(spy.getCall(0).returnValue);
      });

    });

    describe('#containsEmptyGroup()', function () {

      it("should return the result of calling .containsEmptyGroup on .pattern", function () {
        var p = $pattern.create([ $branch.create() ]);
        var r = $regex.create(p);
        var spy = sinon.spy(p, 'containsEmptyGroup');
        var result = r.containsEmptyGroup();
        expect(spy).to.be.called;
        expect(result).to.be.equal(spy.getCall(0).returnValue);
      });

    });

    describe('#translate()', function () {

      it("should resolve .pattern", function () {
        var spy = sandbox.spy($translator.prototype, 'translate');
        var r = $regex.parse('');
        var rr = r.translate();
        expect(spy).to.be.calledWith(r.pattern);
        expect(spy).to.have.returned(rr.pattern);
      });

    });

    describe('#compile()', function () {

      it("should compile .pattern", function () {
        var spy = sandbox.spy($compiler.prototype, 'compile');
        var r = $regex.parse('').translate();
        var p = r.compile();
        expect(spy).to.be.calledWith(r.pattern);
        expect(spy).to.have.returned(p);
      });

    });

    describe('.parse()', function () {

      it("should parse the given source", function () {
        var parseSpy = sandbox.spy($parser.prototype, 'parse');
        var r = $regex.parse('');
        expect(parseSpy).to.be.calledWith('');
        expect(parseSpy).to.have.returned(r.pattern);
      });

    });

    describe('.compile()', function () {

      it("should parse, resolve and compile the given source", function () {
        var parseSpy = sandbox.spy($regex, 'parse');
        var translateSpy = sandbox.spy($regex.prototype, 'translate');
        var compileSpy = sandbox.spy($regex.prototype, 'compile');
        var r = $regex.compile('');
        expect(parseSpy).to.be.calledWith('');
        expect(translateSpy).to.be.calledOn(parseSpy.getCall(0).returnValue);
        expect(compileSpy).to.be.calledOn(translateSpy.getCall(0).returnValue);
        expect(r).to.eql(compileSpy.getCall(0).returnValue);
      });

    });

  });

});
