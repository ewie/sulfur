/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global afterEach, beforeEach, describe, it */

define([
  'shared',
  'sulfur/schema/facet/_standard',
  'sulfur/schema/facet/enumeration',
  'sulfur/schema/validator/enumeration',
  'sulfur/schema/value/integer',
  'sulfur/schema/value/string'
], function (
    $shared,
    $_standardFacet,
    $enumerationFacet,
    $enumerationValidator,
    $integerValue,
    $stringValue
) {

  'use strict';

  var expect = $shared.expect;
  var bind = $shared.bind;
  var sinon = $shared.sinon;

  describe('sulfur/schema/facet/enumeration', function () {

    it("should be derived from sulfur/schema/facet/_standard", function () {
      expect($_standardFacet).to.be.prototypeOf($enumerationFacet);
    });

    describe('.getName()', function () {

      it("should return 'enumeration'", function () {
        expect($enumerationFacet.getName()).to.equal('enumeration');
      });

    });

    describe('#initialize()', function () {

      var sandbox;

      beforeEach(function () {
        sandbox = sinon.sandbox.create();
      });

      afterEach(function () {
        sandbox.restore();
      });

      it("should call sulfur/schema/facet/_standard#initialize()", function () {
        var spy = sandbox.spy($_standardFacet.prototype, 'initialize');
        var values = [ 'foo' ];
        var facet = $enumerationFacet.create(values);
        expect(spy).to.be.calledOn(facet).to.be.calledWith(values);
      });

      it("should ignore duplicate values based on each value's string representation", function () {
        var values = [
          { toString: function () { return 'x'; } },
          { toString: function () { return 'x'; } }
        ];
        var facet = $enumerationFacet.create(values);
        expect(facet.getValue()).to.eql(values.slice(0, 1));
      });

      it("should reject an empty array", function () {
        expect(bind($enumerationFacet, 'create', []))
          .to.throw("must provide at least one value");
      });

    });

    describe('#validate()', function () {

      var facet;

      beforeEach(function () {
        facet = $enumerationFacet.create([ $stringValue.create('') ]);
      });

      it("should return true when all values are of the given type", function () {
        var type = { getValueType: function () { return $stringValue; } };
        expect(facet.validate(type)).to.be.true;
      });

      it("should return false when any value is not of the given type", function () {
        var type = { getValueType: function () { return $integerValue; } };
        expect(facet.validate(type)).to.be.false;
      });

    });

    describe('#createValidator()', function () {

      it("should return a validator/enumeration with the facets values and #eq() as test method", function () {
        var facet = $enumerationFacet.create([{ eq: function () {} }]);
        var v = facet.createValidator();
        expect(v).to.eql(
          $enumerationValidator.create(
            facet.getValue(),
            { testMethod: 'eq' }
          )
        );
      });

    });

  });

});
