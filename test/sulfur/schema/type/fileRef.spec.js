/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global context, describe, it */

define([
  'shared',
  'sulfur/schema/mediaType',
  'sulfur/schema/type/fileRef',
  'sulfur/schema/validators'
], function ($shared, $mediaType, $fileRefType, $validators) {

  'use strict';

  var expect = $shared.expect;
  var bind = $shared.bind;

  describe('sulfur/schema/type/fileRef', function () {

    describe('.validateFacets()', function () {

      it("should return true when no facets are given", function () {
        expect($fileRefType.validateFacets({})).to.be.true;
      });

      context("with facet `mediaTypes`", function () {

        it("should accept an array of sulfur/schema/mediaTypes values", function () {
          expect($fileRefType.validateFacets({
            mediaTypes: [ $mediaType.create() ]
          })).to.be.true;
        });

        context("with an empty array", function () {

          it("should reject", function () {
            expect($fileRefType.validateFacets({ mediaTypes: [] })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $fileRefType.validateFacets({ mediaTypes: [] }, errors);
            expect(errors).to.include.something.eql([
              'mediaTypes',
              "must specify at least one sulfur/schema/mediaType value"
            ]);
          });

        });

        context("with a value not of type sulfur/schema/mediaType", function () {

          it("should reject", function () {
            expect($fileRefType.validateFacets({ mediaTypes: [''] })).to.be.false;
          });

          it("should add a validation error", function () {
            var errors = [];
            $fileRefType.validateFacets({ mediaTypes: [''] }, errors);
            expect(errors).to.include.something.eql([
              'mediaTypes',
              "must specify only sulfur/schema/mediaType values"
            ]);
          });

        });

      });

    });

    describe('#initialize()', function () {

      it("should be callable without facets", function () {
        expect(bind($fileRefType, 'create')).to.not.throw();
      });

      it("should throw when .validateFacets() returns false", function () {
        expect(bind($fileRefType, 'create', { mediaTypes: [] }))
          .to.throw("facet mediaTypes must specify at least one sulfur/schema/mediaType value");
      });

      context("when .validateFacets() returns true", function () {

        context("with facet `mediaTypes`", function () {

          it("should use the media types", function () {
            var mediaTypes = [ $mediaType.create('application', 'pdf') ];
            var type = $fileRefType.create({ mediaTypes: mediaTypes });
            expect(type.getMediaTypeValues()).to.eql(mediaTypes);
          });

          it("should ignore duplicate media types", function () {
            var mediaTypes = [
              $mediaType.create('image'),
              $mediaType.create('image')
            ];
            var type = $fileRefType.create({ mediaTypes: mediaTypes });
            expect(type.getMediaTypeValues()).to.eql([
              $mediaType.create('image')
            ]);
          });

        });

      });

    });

    describe('#getMediaTypeValues()', function () {

      it("should return the values of facet `mediaTypes` when defined", function () {
        var mediaTypes = [ $mediaType.create('text', 'plain') ];
        var type = $fileRefType.create({ mediaTypes: mediaTypes });
        expect(type.getMediaTypeValues()).to.eql(mediaTypes);
      });

      it("should return undefined when facet `mediaTypes` is not defined", function () {
        var type = $fileRefType.create();
        expect(type.getMediaTypeValues()).to.be.undefined;
      });

    });

    describe('#validator()', function () {

      it("should return a validator/all", function () {
        var type = $fileRefType.create();
        var v = type.validator();
        expect($validators.all.prototype).to.be.prototypeOf(v);
      });

      it("should include a validator/prototype matching sulfur/schema/fileRef", function () {
        var type = $fileRefType.create();
        var v = type.validator();
        expect(v).to.eql($validators.all.create([
          $validators.prototype.create($mediaType.prototype)
        ]));
      });

      it("should include a validator/enumeration when facet `mediaTypes` is defined", function () {
        var mediaTypes = [ $mediaType.create('image', 'jpeg') ];
        var type = $fileRefType.create({ mediaTypes: mediaTypes });
        var v = type.validator();
        expect(v).to.eql($validators.all.create([
          $validators.prototype.create($mediaType.prototype),
          $validators.enumeration.create(mediaTypes, { testMethod: 'matches' })
        ]));
      });

    });

  });

});
