/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global beforeEach, context, describe, it */

define([
  'shared',
  'sulfur/schema/type/_faceted',
  'sulfur/schema/validator/all'
], function ($shared, $_facetedType, $allValidator) {

  'use strict';

  var expect = $shared.expect;
  var sinon = $shared.sinon;
  var bind = $shared.bind;

  describe('sulfur/schema/type/_faceted', function () {

    describe('#initialize()', function () {

      it("should be callable without any facets", function () {
        var type = $_facetedType.create();
        expect(type.countFacets()).to.equal(0);
      });

      context("with facets", function () {

        it("should initialize with facets", function () {
          var facets = [
            {
              getName: function () { return 'foo'; },
              getNamespace: function () { return 'urn:void'; },
              getValue: function () { return 3; }
            }
          ];
          var type = $_facetedType.create(facets);
          expect(type.getFacets()).to.eql(facets);
        });

        it("should reject duplicate facets", function () {
          var facets = [
            {
              getName: function () { return 'xyz'; },
              getNamespace: function () { return 'urn:abc'; }
            },
            {
              getName: function () { return 'xyz'; },
              getNamespace: function () { return 'urn:abc'; }
            }
          ];
          expect(bind($_facetedType, 'create', facets))
            .to.throw("duplicate facet");
        });

      });

    });

    describe('#countFacets()', function () {

      it("should return the number of facets", function () {
        var type = $_facetedType.create([
          {
            getNamespace: function () { return 'urn:xyz'; },
            getName: function () { return 'x'; }
          }
        ]);
        expect(type.countFacets()).to.equal(1);
      });

    });

    describe('#hasFacet()', function () {

      var type;

      beforeEach(function () {
        type = $_facetedType.create([
          {
            getName: function () { return 'bar'; },
            getNamespace: function () { return 'urn:dummy'; }
          }
        ]);
      });

      it("should return true when a facet with the given name and namespace is defined", function () {
        expect(type.hasFacet('bar', 'urn:dummy')).to.be.true;
      });

      it("should return false when no facet with the given name is defined", function () {
        expect(type.hasFacet('foo', 'urn:dummy')).to.be.false;
      });

      it("should return false when no facet with the given namespace is defined", function () {
        expect(type.hasFacet('bar', 'urn:xyz')).to.be.false;
      });

    });

    describe('#hasStandardFacet()', function () {

      var type;

      beforeEach(function () {
        type = $_facetedType.create([
          {
            getName: function () { return 'foo'; },
            getNamespace: function () { return 'http://www.w3.org/2001/XMLSchema'; }
          },
          {
            getName: function () { return 'bar'; },
            getNamespace: function () { return 'urn:arrr'; }
          }
        ]);
      });

      it("should return true when an XML Schema facet with the given name is defined", function () {
        expect(type.hasStandardFacet('foo')).to.be.true;
      });

      it("should return false when no XML Schema facet with the given name is defined", function () {
        expect(type.hasStandardFacet('bar')).to.be.false;
      });

    });

    describe('#getFacet()', function () {

      var facets;
      var type;

      beforeEach(function () {
        facets = [
          {
            getName: function () { return 'bar'; },
            getNamespace: function () { return 'urn:void'; }
          }
        ];
        type = $_facetedType.create(facets);
      });

      it("should return the facet with the given name and namespace", function () {
        expect(type.getFacet('bar', 'urn:void')).to.eql(facets[0]);
      });

      it("should return undefined when no facet with the given namespace is defined", function () {
        expect(type.getFacet('bar', 'urn:dummy')).to.be.undefined;
      });

      it("should return undefined when no facet with the given name is defined", function () {
        expect(type.getFacet('foo')).to.be.undefined;
      });

    });

    describe('#getStandardFacet()', function () {

      var facets;
      var type;

      beforeEach(function () {
        facets = [
          {
            getName: function () { return 'foo'; },
            getNamespace: function () { return 'http://www.w3.org/2001/XMLSchema'; }
          },
          {
            getName: function () { return 'bar'; },
            getNamespace: function () { return 'urn:arrr'; }
          }
        ];
        type = $_facetedType.create(facets);
      });

      it("should return the facet when an XML Schema facet with the given name is defined", function () {
        expect(type.getStandardFacet('foo')).to.equal(facets[0]);
      });

      it("should return false when no XML Schema facet with the given name is defined", function () {
        expect(type.getStandardFacet('bar')).to.be.undefined;
      });

    });

    describe('#getFacets()', function () {

      it("should return the defined facets in initialization order", function () {
        var facets = [
          {
            getName: function () { return 'bar'; },
            getNamespace: function () { return 'urn:x'; },
            getValue: function () { return 3; }
          },
          {
            getName: function () { return 'foo'; },
            getNamespace: function () { return 'urn:y'; },
            getValue: function () { return 'xyz'; }
          }
        ];
        var type = $_facetedType.create(facets);
        expect(type.getFacets()).to.eql(facets);
      });

    });

    describe('#validateFacets()', function () {

      it("should return true when no facets are defined", function () {
        var type = $_facetedType.create();
        expect(type.validateFacets()).to.be.true;
      });

      context("with facets", function () {

        function mockFacet(namespace, name, validatefn) {
          return {
            getNamespace: function () { return namespace; },
            getName: function () { return name; },
            validate: validatefn || function () { return true; }
          };
        }

        var $derivedType;

        beforeEach(function () {
          $derivedType = $_facetedType.clone({
            getLegalFacets: function () {
              return [
                {
                  getName: function () { return 'foo'; },
                  getNamespace: function () { return 'urn:dummy'; }
                },
                {
                  getName: function () { return 'bar'; },
                  getNamespace: function () { return 'urn:dummy'; }
                }
              ];
            }
          });

          $derivedType.augment({
            getValueType: function () { return {}; }
          });
        });

        it("should reject facets not specified with .getLegalFacets()", function () {
          var facets = [
            mockFacet('urn:void', 'foo')
          ];
          var type = $derivedType.create(facets);
          expect(type.validateFacets()).to.be.false;
        });

        it("should treat all facets as optional", function () {
          var facets = [
            mockFacet('urn:dummy', 'foo')
          ];
          var type = $derivedType.create(facets);
          expect(type.validateFacets()).to.be.true;
        });

        it("should call #validate() on each facet with the type and value type as arguments", function () {
          var facets = [
            mockFacet('urn:dummy', 'foo', sinon.stub().returns(true)),
            mockFacet('urn:dummy', 'bar', sinon.stub().returns(true))
          ];
          var type = $derivedType.create(facets);
          type.validateFacets();
          expect(facets[0].validate)
            .to.be.calledOn(facets[0])
            .to.be.calledWith(type);
          expect(facets[1].validate)
            .to.be.calledOn(facets[1])
            .to.be.calledWith(type);
        });

        it("should return true when all facets are valid", function () {
          var facets = [
            mockFacet('urn:dummy', 'foo', sinon.stub().returns(true)),
            mockFacet('urn:dummy', 'bar', sinon.stub().returns(true))
          ];
          var type = $derivedType.create(facets);
          expect(type.validateFacets()).to.be.true;
        });

        context("when a facet is not valid", function () {

          var type;
          var facets;

          beforeEach(function () {
            facets = [
              mockFacet('urn:dummy', 'foo', sinon.stub().returns(false)),
              mockFacet('urn:dummy', 'bar', sinon.spy())
            ];
            type = $derivedType.create(facets);
          });

          it("should return false", function () {
            expect(type.validateFacets()).to.be.false;
          });

          it("should fail fast", function () {
            type.validateFacets();
            expect(facets[1].validate).to.not.be.called;
          });

        });

      });

    });

    describe('#createValidator()', function () {

      var valueType;
      var $derivedType;

      beforeEach(function () {
        valueType = { prototype: {} };
        $derivedType = $_facetedType.derive({
          getValueType: function () {
            return valueType;
          }
        });
      });

      it("should return a validator/all using each facet's validator", function () {
        var facetsValidator = {};
        var facets = [
          {
            getNamespace: function () { return 'urn:foo'; },
            getName: function () { return 'bar'; },
            createValidator: function () { return facetsValidator; }
          }
        ];
        var type = $derivedType.create(facets);
        var v = type.createValidator();
        expect(v).to.eql(
          $allValidator.create([
            facets[0].createValidator()
          ])
        );
      });

    });

  });

});
