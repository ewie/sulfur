/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global beforeEach, describe, it */

define([
  'shared',
  'sulfur',
  'sulfur/schema/facet/mediaType',
  'sulfur/schema/facets',
  'sulfur/schema/file',
  'sulfur/schema/qname',
  'sulfur/schema/type/simple/primitive',
  'sulfur/schema/type/simple/primitive/fileRef',
  'sulfur/schema/type/simple/restricted',
  'sulfur/schema/validator/all',
  'sulfur/schema/validator/presence',
  'sulfur/schema/validator/property',
  'sulfur/schema/value/simple/fileRef',
  'sulfur/schema/value/simple/mediaType'
], function (
    shared,
    sulfur,
    MediaTypeFacet,
    Facets,
    File,
    QName,
    PrimitiveType,
    FileRefType,
    RestrictedType,
    AllValidator,
    PresenceValidator,
    PropertyValidator,
    FileRefValue,
    MediaTypeValue
) {

  'use strict';

  var expect = shared.expect;

  describe('sulfur/schema/type/simple/primitive/fileRef', function () {

    it("should be a sulfur/schema/type/simple/primitive", function () {
      expect(PrimitiveType.prototype).to.be.prototypeOf(FileRefType);
    });

    describe('.qname', function () {

      it("should return {" + sulfur.namespaceURI + "}fileRef", function () {
        expect(FileRefType.qname)
          .to.eql(QName.create('fileRef', sulfur.namespaceURI));
      });


    });

    describe('.valueType', function () {

      it("should return sulfur/schema/value/simple/fileRef", function () {
        expect(FileRefType.valueType).to.equal(FileRefValue);
      });

    });

    describe('.allowedFacets', function () {

      it("should include sulfur/schema/facet/mediaType", function () {
        expect(FileRefType.allowedFacets.toArray()).to.include(MediaTypeFacet);
      });

    });

    describe('.createRestrictionValidator()', function () {

      var facet;

      beforeEach(function () {
        var mediaType = MediaTypeValue.create('text', 'plain');
        facet = MediaTypeFacet.create([ mediaType ]);
      });

      it("should return a sulfur/schema/validator/all", function () {
        var restriction = RestrictedType.create(FileRefType,
          Facets.create([ facet ]));
        var v = FileRefType.createRestrictionValidator(restriction);
        expect(AllValidator.prototype).to.be.prototypeOf(v);
      });

      it("should include this type's validator", function () {
        var restriction = RestrictedType.create(FileRefType,
          Facets.create([ facet ]));
        var v = FileRefType.createRestrictionValidator(restriction);
        expect(v.validators)
          .to.include.something.eql(FileRefType.createValidator());
      });

      it("should include a sulfur/schema/validator/property with property 'file' using a sulfur/schema/validator/presence using a sulfur/schema/validator/property with property 'mediaType' using the media type facet's validator", function () {
        var restriction = RestrictedType.create(FileRefType,
          Facets.create([ facet ]));
        var v = FileRefType.createRestrictionValidator(restriction);
        expect(v.validators)
          .to.include.something.eql(PropertyValidator.create('file',
            PresenceValidator.create(
              PropertyValidator.create('mediaType', facet.createValidator()))));
      });

    });

  });

});
