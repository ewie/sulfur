/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global describe, it */

define([
  'shared',
  'sulfur/schema/facet',
  'sulfur/schema/facet/pattern',
  'sulfur/schema/pattern',
  'sulfur/schema/qname',
  'sulfur/schema/validator/pattern',
  'sulfur/schema/validator/some'
], function (
    $shared,
    $facet,
    $patternFacet,
    $pattern,
    $qname,
    $patternValidator,
    $someValidator
) {

  'use strict';

  var expect = $shared.expect;
  var bind = $shared.bind;

  describe('sulfur/schema/facet/pattern', function () {

    it("should be derived from sulfur/schema/facet", function () {
      expect($facet).to.be.prototypeOf($patternFacet);
    });

    describe('.getQName()', function () {

      it("should return {http://www.w3.org/2001/XMLSchema}pattern", function () {
        expect($patternFacet.getQName())
          .to.eql($qname.create('pattern', 'http://www.w3.org/2001/XMLSchema'));
      });

    });

    describe('.isShadowingLowerRestrictions()', function () {

      it("should return false", function () {
        expect($patternFacet.isShadowingLowerRestrictions()).to.be.false;
      });

    });

    describe('.getMutualExclusiveFacets()', function () {

      it("should return an empty array", function () {
        expect($patternFacet.getMutualExclusiveFacets()).to.eql([]);
      });

    });

    describe('#initialize()', function () {

      it("should ignore duplicate patterns based on each patterns's string representation", function () {
        var patterns = [
          $pattern.create(''),
          $pattern.create('')
        ];
        var facet = $patternFacet.create(patterns);
        expect(facet.getValue()).to.eql(patterns.slice(0, 1));
      });

      it("should reject an empty array", function () {
        expect(bind($patternFacet, 'create', []))
          .to.throw("expecting at least one sulfur/schema/pattern");
      });

      it("should reject values not of type sulfur/schema/pattern", function () {
        expect(bind($patternFacet, 'create', ['']))
          .to.throw("expecting only sulfur/schema/pattern values");
      });

    });

    describe('#isRestrictionOf()', function () {

      it("should return undefined", function () {
        var facet = $patternFacet.create([ $pattern.create('') ]);
        expect(facet.isRestrictionOf()).to.be.undefined;
      });

    });

    describe('#validate()', function () {

      it("should return true", function () {
        var facet = $patternFacet.create([ $pattern.create('') ]);
        expect(facet.validate()).to.be.true;
      });

    });

    describe('#createValidator()', function () {

      it("should return a validator/some with a validator/pattern for each pattern", function () {
        var patterns = [ $pattern.create('') ];
        var facet = $patternFacet.create(patterns);
        var v = facet.createValidator();
        expect(v).to.eql(
          $someValidator.create([
            $patternValidator.create(patterns[0])
          ])
        );
      });

    });

  });

});
