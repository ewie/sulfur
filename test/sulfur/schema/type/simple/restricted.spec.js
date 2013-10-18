/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global beforeEach, context, describe, it */

define([
  'shared',
  'sulfur/schema/facet',
  'sulfur/schema/facets',
  'sulfur/schema/qname',
  'sulfur/schema/type/simple/primitive',
  'sulfur/schema/type/simple/restricted'
], function (
    shared,
    Facet,
    Facets,
    QName,
    PrimitiveType,
    RestrictedType
) {

  'use strict';

  var expect = shared.expect;
  var sinon = shared.sinon;
  var bind = shared.bind;
  var returns = shared.returns;

  describe('sulfur/schema/type/simple/restricted', function () {

    function mockFacet(qname, options) {
      options || (options = {});
      var shadowing = typeof options.shadowing === 'undefined' ? true : options.shadowing;
      var restriction = options.hasOwnProperty('restriction') ? options.restriction : true;
      var facet = Facet.clone({
        getQName: returns(qname),
        getMutualExclusiveFacets: returns(options.mutex || []),
        isShadowingLowerRestrictions: returns(shadowing)
      });
      facet.augment({
        isRestrictionOf: returns(restriction)
      });
      return facet;
    }

    describe('#initialize()', function () {

      var base;

      beforeEach(function () {
        var baseFacet = mockFacet(QName.create('x', 'urn:y'));
        base = PrimitiveType.create({
          facets: Facets.create([ baseFacet ])
        });
      });

      it("should reject facets not defined by the base", function () {
        var facet = mockFacet(QName.create('z', 'urn:y'));
        var facets = Facets.create([ facet.create() ]);
        expect(bind(RestrictedType, 'create', base, facets))
          .to.throw("expecting only facets defined by the base");
      });

      it("should reject facets prohibited due to mutual exclusion", function () {
        var facet1 = {
          getQName: returns(QName.create('x', 'urn:z')),
          getMutualExclusiveFacets: function () {
            return [ facet2 ];
          }
        };
        var facet2 = {
          getQName: returns(QName.create('y', 'urn:z')),
          getMutualExclusiveFacets: function () {
            return [ facet1 ];
          }
        };
        var base = PrimitiveType.create({
          facets: Facets.create([ facet1, facet2 ])
        });
        var facets = Facets.create([ facet1, facet2 ]);
        expect(bind(RestrictedType, 'create', base, facets))
          .to.throw("facets {urn:z}x and {urn:z}y are mutual exclusive");
      });

      it("should reject facets that are not a restriction of the base", function () {
        var derivedFacet = mockFacet(QName.create('x', 'urn:y'));
        var facet = mockFacet(QName.create('x', 'urn:y'));
        var spy = sinon.stub(facet.prototype, 'isRestrictionOf').returns(false);
        var restriction = RestrictedType.create(base,
          Facets.create([ derivedFacet.create() ]));
        var facets = Facets.create([ facet.create() ]);
        expect(bind(RestrictedType, 'create', restriction, facets))
          .to.throw("expecting the facets to be equal to or more restrictive than the base facets");
        expect(spy)
          .to.be.calledWith(sinon.match.same(restriction));
      });

      it("should accept facets whose #isRestrictionOf() returns undefined", function () {
        var derivedFacet = mockFacet(QName.create('x', 'urn:y'));
        var facet = mockFacet(QName.create('x', 'urn:y'));
        var spy = sinon.stub(facet.prototype, 'isRestrictionOf').returns(undefined);
        var restriction = RestrictedType.create(base,
          Facets.create([ derivedFacet.create() ]));
        var facets = Facets.create([ facet.create() ]);
        expect(bind(RestrictedType, 'create', restriction, facets))
          .not.to.throw();
        expect(spy)
          .to.be.calledWith(sinon.match.same(restriction));
      });

    });

    describe('#getBasePrimitive()', function () {

      it("should return the base when its a sulfur/schema/type/simple/primitive", function () {
        var allowedFacet = mockFacet(QName.create('x', 'urn:y'));
        var allowedFacets = Facets.create([ allowedFacet ]);
        var base = PrimitiveType.create({ facets: allowedFacets });
        var facets = Facets.create([ allowedFacet.create() ]);
        var restriction = RestrictedType.create(base, facets);
        expect(restriction.getBasePrimitive()).to.equal(base);
      });

      it("should return the base's base primitive when its a sulfur/schema/type/simple/restricted", function () {
        var allowedFacet = mockFacet(QName.create('x', 'urn:y'));
        var allowedFacets = Facets.create([ allowedFacet ]);
        var primitive = PrimitiveType.create({ facets: allowedFacets });
        var baseFacets = Facets.create([ allowedFacet.create() ]);
        var base = RestrictedType.create(primitive, baseFacets);
        var facets = Facets.create([ allowedFacet.create() ]);
        var restriction = RestrictedType.create(base, facets);
        expect(restriction.getBasePrimitive()).to.equal(base.getBasePrimitive());
      });

    });

    describe('#getBase()', function () {

      it("should return the base", function () {
        var dummyFacet = mockFacet(
          QName.create('x', 'urn:y')
        );
        var base = PrimitiveType.create({
          facets: Facets.create([ dummyFacet ])
        });
        var facets = Facets.create([ dummyFacet.create() ]);
        var restriction = RestrictedType.create(base, facets);
        expect(restriction.getBase()).to.equal(base);
      });

    });

    describe('#getValueType()', function () {

      it("should return the value type of the base", function () {
        var dummyFacet = mockFacet(
          QName.create('x', 'urn:y')
        );
        var base = PrimitiveType.create({
          facets: Facets.create([ dummyFacet ]),
          valueType: returns({})
        });
        var facets = Facets.create([ dummyFacet.create() ]);
        var restriction = RestrictedType.create(base, facets);
        expect(restriction.getValueType()).to.equal(base.getValueType());
      });

    });

    describe('#getAllowedFacets()', function () {

      it("should return the allowed facets of the base", function () {
        var dummyFacet = mockFacet(
          QName.create('x', 'urn:y')
        );
        var base = PrimitiveType.create({
          facets: Facets.create([ dummyFacet ])
        });
        var facets = Facets.create([ dummyFacet.create() ]);
        var restriction = RestrictedType.create(base, facets);
        expect(restriction.getAllowedFacets()).to.equal(base.getAllowedFacets());
      });

    });

    describe('#getFacets()', function () {

      it("should return the facets defined on this restriction", function () {
        var dummyFacet = mockFacet(
          QName.create('x', 'urn:y')
        );
        var base = PrimitiveType.create({
          facets: Facets.create([ dummyFacet ])
        });
        var facets = Facets.create([ dummyFacet.create() ]);
        var restriction = RestrictedType.create(base, facets);
        expect(restriction.getFacets()).to.equal(facets);
      });

    });

    describe('#isRestrictionOf()', function () {

      context("when this is a restriction of the other type", function () {

        it("should check if the other type is this type's base primitive", function () {
          var allowedFacet = mockFacet(QName.create('foo', 'urn:bar'));
          var primitive = PrimitiveType.create({
            facets: Facets.create([ allowedFacet ])
          });
          var restriction = RestrictedType.create(primitive,
            Facets.create([ allowedFacet.create() ]));
          expect(restriction.isRestrictionOf(primitive)).to.be.true;
        });

        it("should check that this and the other type have the same base primitive", function () {
          var allowedFacet = mockFacet(QName.create('foo', 'urn:bar'));
          var primitive = PrimitiveType.create({
            facets: Facets.create([ allowedFacet ])
          });
          var restriction = RestrictedType.create(primitive,
            Facets.create([ allowedFacet.create() ]));
          var other = RestrictedType.create(primitive,
            Facets.create([ allowedFacet.create() ]));
          expect(restriction.isRestrictionOf(other)).to.be.true;
        });

        context("when this and the other type have the same effective facet", function () {

          it("should check if the restriction's facet is a restriction of the other type", function () {
            var allowedFacet = mockFacet(QName.create('foo', 'urn:bar'));
            var primitive = PrimitiveType.create({
              facets: Facets.create([ allowedFacet ])
            });
            var restriction = RestrictedType.create(primitive,
              Facets.create([ allowedFacet.create() ]));
            var other = RestrictedType.create(primitive,
              Facets.create([ allowedFacet.create() ]));
            expect(restriction.isRestrictionOf(other)).to.be.true;
          });

        });

        context("when this does not have an effective facet defined by the other type", function () {

          it("should check that any of that facet's mutual exclusive facets is a restriction of the other type", function () {
            var allowedFacet = mockFacet(QName.create('x', 'urn:z'));
            var mutexFacet = mockFacet(QName.create('y', 'urn:z'),
              { mutex: [ allowedFacet ] });
            allowedFacet.getMutualExclusiveFacets = returns([ mutexFacet ]);
            var primitive = PrimitiveType.create({
              facets: Facets.create([ allowedFacet, mutexFacet ])
            });
            var restriction = RestrictedType.create(primitive,
              Facets.create([ mutexFacet.create() ]));
            var other = RestrictedType.create(primitive,
              Facets.create([ allowedFacet.create() ]));
            expect(restriction.isRestrictionOf(other)).to.be.true;
          });

        });

      });

      context("when this is not a restriction of the other type", function () {

        it("should detect if the other type is a primitive and not this type's base primitive", function () {
          var allowedFacet = mockFacet(QName.create('foo', 'urn:bar'));
          var primitive = PrimitiveType.create({
            facets: Facets.create([ allowedFacet ])
          });
          var otherPrimitive = PrimitiveType.create({
            facets: Facets.create([ allowedFacet ])
          });
          var restriction = RestrictedType.create(primitive,
            Facets.create([ allowedFacet.create() ]));
          expect(restriction.isRestrictionOf(otherPrimitive)).to.be.false;
        });

        it("should detect when this and the other type don't have the same base primitive", function () {
          var allowedFacet = mockFacet(QName.create('foo', 'urn:bar'));
          var primitive = PrimitiveType.create({
            facets: Facets.create([ allowedFacet ])
          });
          var otherPrimitive = PrimitiveType.create({
            facets: Facets.create([ allowedFacet ])
          });
          var restriction = RestrictedType.create(primitive,
            Facets.create([ allowedFacet.create() ]));
          var other = RestrictedType.create(otherPrimitive,
            Facets.create([ allowedFacet.create() ]));
          expect(restriction.isRestrictionOf(other)).to.be.false;
        });

        it("should detect an effective facet, defined by this and the other type, which is not a restriction of the type", function () {
          var allowedFacet = mockFacet(QName.create('foo', 'urn:bar'));
          allowedFacet.augment({
            isRestrictionOf: function (type) {
              var effectiveFacets = this.factory.getEffectiveFacets(type);
              if (effectiveFacets) {
                return this.getValue() < effectiveFacets[0].getValue();
              }
              return true;
            }
          });
          var primitive = PrimitiveType.create({
            facets: Facets.create([ allowedFacet ])
          });
          var restriction = RestrictedType.create(primitive,
            Facets.create([ allowedFacet.create(2) ]));
          var other = RestrictedType.create(primitive,
            Facets.create([ allowedFacet.create(1) ]));
          expect(restriction.isRestrictionOf(other)).to.be.false;
        });

        it("should detect an effective facet, defined by this and the other type, for which it is undecidable if it's a restriction of the type", function () {
          var allowedFacet = mockFacet(QName.create('foo', 'urn:bar'),
            { restriction: undefined });
          var primitive = PrimitiveType.create({
            facets: Facets.create([ allowedFacet ])
          });
          var restriction = RestrictedType.create(primitive,
            Facets.create([ allowedFacet.create() ]));
          var other = RestrictedType.create(primitive,
            Facets.create([ allowedFacet.create() ]));
          expect(restriction.isRestrictionOf(other)).to.be.false;
        });

        context("when this does not have an effective facet defined by the other type", function () {

          it("should detect when no mutual exclusive facet is in effect", function () {
            var allowedFacet = mockFacet(QName.create('x', 'urn:z'));
            var mutexFacet = mockFacet(QName.create('y', 'urn:z'),
              { mutex: [ allowedFacet ] });
            allowedFacet.getMutualExclusiveFacets = returns([ mutexFacet ]);

            var dummyFacet = mockFacet(QName.create('dummy', 'urn:void'));

            var primitive = PrimitiveType.create({
              facets: Facets.create([ allowedFacet, mutexFacet, dummyFacet ])
            });
            var restriction = RestrictedType.create(primitive,
              Facets.create([ mutexFacet.create() ]));
            var other = RestrictedType.create(primitive,
              Facets.create([ dummyFacet.create() ]));
            expect(restriction.isRestrictionOf(other)).to.be.false;
          });

          context("when a mutual exclusive facet is in effect", function () {

            it("should detect when not a restriction of the other type", function () {
              var allowedFacet = mockFacet(QName.create('x', 'urn:z'));
              var mutexFacet = mockFacet(QName.create('y', 'urn:z'),
                { mutex: [ allowedFacet ] });
              mutexFacet.augment({
                isRestrictionOf: function (type) {
                  var effectiveFacets = allowedFacet.getEffectiveFacets(type);
                  if (effectiveFacets) {
                    return this.getValue() < effectiveFacets[0].getValue();
                  }
                  return true;
                }
              });
              allowedFacet.getMutualExclusiveFacets = returns([ mutexFacet ]);

              var primitive = PrimitiveType.create({
                facets: Facets.create([ allowedFacet, mutexFacet ])
              });
              var restriction = RestrictedType.create(primitive,
                Facets.create([ mutexFacet.create(2) ]));
              var other = RestrictedType.create(primitive,
                Facets.create([ allowedFacet.create(1) ]));
              expect(restriction.isRestrictionOf(other)).to.be.false;
            });

            it("should detect when it's not decidable if it's a restriction of the other type", function () {
              var allowedFacet = mockFacet(QName.create('x', 'urn:z'));
              var mutexFacet = mockFacet(QName.create('y', 'urn:z'),
                { mutex: [ allowedFacet ],
                  restriction: undefined
                });
              allowedFacet.getMutualExclusiveFacets = returns([ mutexFacet ]);

              var primitive = PrimitiveType.create({
                facets: Facets.create([ allowedFacet, mutexFacet ])
              });
              var restriction = RestrictedType.create(primitive,
                Facets.create([ mutexFacet.create() ]));
              var other = RestrictedType.create(primitive,
                Facets.create([ allowedFacet.create() ]));
              expect(restriction.isRestrictionOf(other)).to.be.false;
            });

          });

        });

      });

    });

    describe('#createValidator()', function () {

      it("should return the validator created by the base primitive for this restriction", function () {
        var facet = mockFacet(QName.create('x', 'urn:y'));
        var primitive = PrimitiveType.create({ facets: Facets.create([ facet ]) });
        var facets = Facets.create([ facet.create() ]);
        var restriction = RestrictedType.create(primitive, facets);
        var spy = sinon.stub(primitive, 'createRestrictionValidator').returns({});
        var v = restriction.createValidator();
        expect(spy)
          .to.be.calledWith(sinon.match.same(restriction))
          .to.have.returned(sinon.match.same(v));
      });

    });

  });

});
