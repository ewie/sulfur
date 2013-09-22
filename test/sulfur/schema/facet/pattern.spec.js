/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global describe, it */

define([
  'shared',
  'sulfur/schema/facet/_standard',
  'sulfur/schema/facet/pattern',
  'sulfur/schema/pattern',
  'sulfur/schema/validator/pattern',
  'sulfur/schema/validator/some'
], function (
    $shared,
    $_standardFacet,
    $patternFacet,
    $pattern,
    $patternValidator,
    $someValidator
) {

  'use strict';

  var expect = $shared.expect;
  var bind = $shared.bind;

  describe('sulfur/schema/facet/pattern', function () {

    it("should be derived from sulfur/schema/facet/_standard", function () {
      expect($_standardFacet).to.be.prototypeOf($patternFacet);
    });

    describe('.getName()', function () {

      it("should return 'pattern'", function () {
        expect($patternFacet.getName()).to.equal('pattern');
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
