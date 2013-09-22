/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global afterEach, beforeEach, describe, it */

define([
  'shared',
  'sulfur/schema/type/_faceted',
  'sulfur/schema/type/_simple',
  'sulfur/schema/validator/all'
], function ($shared, $_facetedType, $_simpleType, $allValidator) {

  'use strict';

  var expect = $shared.expect;
  var bind = $shared.bind;
  var sinon = $shared.sinon;

  describe('sulfur/schema/type/_simple', function () {

    it("should derive from sulfur/schema/type/_faceted", function () {
      expect($_facetedType).to.be.prototypeOf($_simpleType);
    });

    describe('#initialize()', function () {

      var sandbox;

      beforeEach(function () {
        sandbox = sinon.sandbox.create();
      });

      afterEach(function () {
        sandbox.restore();
      });

      it("should call sulfur/schema/type/_faceted#initialize() with the provided facets", function () {
        var spy = sandbox.spy($_facetedType.prototype, 'initialize');
        var facets = [{
          getName: function () { return 'foo'; },
          getNamespace: function () { return 'urn:bar'; }
        }];
        var type = $_simpleType.create(facets);
        expect(spy).to.be.calledOn(type).to.be.calledWith(facets);
      });

      it("should initialize the type with an optional base type", function () {
        var base = $_simpleType.create();
        var type = $_simpleType.create(undefined, base);
        expect(type.getBase()).to.equal(base);
      });

      it("should reject a base of different type when given", function () {
        expect(bind($_simpleType, 'create', undefined, {}))
          .to.throw("expecting base of same type");
      });

    });

    describe('#getBase()', function () {

      it("should return the base type when defined", function () {
        var base = $_simpleType.create();
        var type = $_simpleType.create(undefined, base);
        expect(type.getBase()).to.equal(base);
      });

      it("should return undefined when no base type is defined", function () {
        var type = $_simpleType.create();
        expect(type.getBase()).to.be.undefined;
      });

    });

    describe('#getValueType()', function () {

      it("should return .getValueType()", function () {
        var valueType = {};
        var $derivedType = $_simpleType.clone({
          getValueType: function () { return valueType; }
        });
        var type = $derivedType.create();
        expect(type.getValueType()).to.equal(valueType);
      });

    });

    describe('#validateFacets()', function () {

      it("should validate the facets against the base type's facets");

    });

    describe('#createValidator()', function () {

      var valueType;
      var $derivedType;

      beforeEach(function () {
        valueType = { prototype: {} };
        $derivedType = $_simpleType.clone({
          getValueType: function () { return valueType; }
        });
      });

      it("should return a validator/all with the base type's validator and the facets validator when a base type is defined", function () {
        var base = $derivedType.create();
        var type = $derivedType.create(undefined, base);
        var v = type.createValidator();
        expect(v).to.eql($allValidator.create([
          base.createValidator(),
          $_facetedType.prototype.createValidator.call(type)
        ]));
      });

      it("should return the facets validator when no base is defined", function () {
        var type = $derivedType.create();
        expect(type.createValidator()).to.eql($_facetedType.prototype.createValidator.call(type));
      });

    });

  });

});
