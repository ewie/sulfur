/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global afterEach, beforeEach, describe, it */

define([
  'shared',
  'sulfur/schema/facets',
  'sulfur/schema/qname',
  'sulfur/schema/type/simple/derived',
  'sulfur/schema/type/simple/primitive',
  'sulfur/schema/type/simple/restricted'
], function (shared, Facets, QName, DerivedType, PrimitiveType, RestrictedType) {

  'use strict';

  var expect = shared.expect;
  var sinon = shared.sinon;
  var returns = shared.returns;

  describe('sulfur/schema/type/simple/derived', function () {

    var type;
    var qname;
    var base;
    var valueType;
    var facets;

    beforeEach(function () {
      qname = QName.create('foo', 'urn:bar');
      base = PrimitiveType.create({
        qname: QName.create('x', 'urn:y'),
        valueType: {},
        facets: { toArray: returns([]) }
      });
      valueType = {};
      facets = { toArray: returns([]) };
      type = DerivedType.create(
        { base: base,
          qname: qname,
          valueType: valueType,
          facets: facets
        });
    });

    it("should be derived from sulfur/schema/type/simple/restricted", function () {
      expect(RestrictedType).to.be.prototypeOf(DerivedType);
    });

    describe('#initialize()', function () {

      var sandbox;

      beforeEach(function () {
        sandbox = sinon.sandbox.create();
      });

      afterEach(function () {
        sandbox.restore();
      });

      it("should call sulfur/schema/type/simple/restricted#initialize() with the base and facets", function () {
        var spy = sandbox.spy(RestrictedType.prototype, 'initialize');
        var type = DerivedType.create({ base: base, facets: facets });
        expect(spy)
          .to.be.calledOn(type)
          .to.be.calledWith(
            sinon.match.same(base),
            sinon.match.same(facets));
      });

    });

    describe('#getQName()', function () {

      it("should return the qualified name", function () {
        expect(type.getQName()).to.equal(qname);
      });

    });

    describe('#getValueType()', function () {

      it("should return the value type", function () {
        expect(type.getValueType()).to.equal(valueType);
      });

    });

  });

});
