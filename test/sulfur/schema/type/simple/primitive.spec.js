/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global beforeEach, describe, it */

define([
  'shared',
  'sulfur/schema/facet',
  'sulfur/schema/facets',
  'sulfur/schema/qname',
  'sulfur/schema/type/simple/primitive',
  'sulfur/schema/type/simple/restricted',
  'sulfur/schema/validator/all',
  'sulfur/schema/validator/prototype'
], function (
    shared,
    Facet,
    Facets,
    QName,
    PrimitiveType,
    RestrictedType,
    AllValidator,
    PrototypeValidator
) {

  'use strict';

  var expect = shared.expect;
  var returns = shared.returns;

  describe('sulfur/schema/type/simple/primitive', function () {

    function mockFacet(qname, shadowing, initialize, createValidator) {
      var facet = Facet.clone({
        qname: qname,
        mutualExclusiveFacets: [],
        isShadowingLowerRestrictions: returns(shadowing)
      });
      facet.augment({
        initialize: initialize,
        isRestrictionOf: returns(true),
        createValidator: createValidator
      });
      return facet;
    }

    var type;
    var qname;
    var valueType;
    var facets;
    var shadowingFacet;
    var nonShadowingFacet;

    beforeEach(function () {
      qname = QName.create('foo', 'urn:bar');
      valueType = { prototype: {} };
      shadowingFacet = mockFacet(
        QName.create('x', 'urn:z'),
        true,
        function () {},
        returns({}));
      nonShadowingFacet = mockFacet(
        QName.create('y', 'urn:z'),
        false,
        function (x) { this._x = x; },
        function () { return { x: this._x }; });
      facets = Facets.create([ shadowingFacet, nonShadowingFacet ]);
      type = PrimitiveType.create(
        { qname: qname,
          valueType: valueType,
          facets: facets
        });
    });

    describe('#qname', function () {

      it("should return the qualified name", function () {
        expect(type.qname).to.equal(qname);
      });

    });

    describe('#valueType', function () {

      it("should return the value type", function () {
        expect(type.valueType).to.equal(valueType);
      });

    });

    describe('#allowedFacets', function () {

      it("should return the allowed facets", function () {
        expect(type.allowedFacets).to.equal(facets);
      });

    });

    describe('#isRestrictionOf()', function () {

      it("should return true when the other type is the same sulfur/schema/type/simple/primitive", function () {
        expect(type.isRestrictionOf(type)).to.be.true;
      });

      it("should return false when the other type is not the same sulfur/schema/type/simple/primitive", function () {
        var other = PrimitiveType.create({});
        expect(type.isRestrictionOf(other)).to.be.false;
      });

    });

    describe('#createValidator()', function () {

      it("should return a sulfur/schema/validator/prototype using the value type's prototype", function () {
        var v = type.createValidator();
        expect(v).to.eql(PrototypeValidator.create(valueType.prototype));
        expect(v.prototype).to.equal(valueType.prototype);
      });

    });

    describe('#createRestrictionValidator()', function () {

      it("should return an sulfur/schema/validator/all using each effective facet's validator", function () {
        var facets = Facets.create([ shadowingFacet.create(0) ]);
        var restriction = RestrictedType.create(type, facets);
        var v = type.createRestrictionValidator(restriction);
        expect(AllValidator.prototype).to.be.prototypeOf(v);
        expect(v.validators)
          .to.include.something.equal(
            facets.getByQName(shadowingFacet.qname).createValidator());
      });

      it("should include this type's validator", function () {
        var facets = Facets.create([ shadowingFacet.create(0) ]);
        var restriction = RestrictedType.create(type, facets);
        var v = type.createRestrictionValidator(restriction);
        expect(v.validators)
          .to.include.something.eql(type.createValidator());
      });

      it("should include a sulfur/schema/validator/all to wrap a non-shadowing facet's validators", function () {
        var baseFacets = Facets.create([ nonShadowingFacet.create(1) ]);
        var base = RestrictedType.create(type, baseFacets);
        var facets = Facets.create([ nonShadowingFacet.create(2) ]);
        var restriction = RestrictedType.create(base, facets);
        var v = type.createRestrictionValidator(restriction);
        expect(v.validators)
          .to.include.something.eql(
            AllValidator.create(
              [ facets.getByQName(nonShadowingFacet.qname).createValidator(),
                baseFacets.getByQName(nonShadowingFacet.qname).createValidator()
              ]));
      });

    });

  });

});
