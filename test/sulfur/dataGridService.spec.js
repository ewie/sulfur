/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global beforeEach, context, describe, it */

define([
  'shared',
  'sulfur/dataGridService'
], function (shared, DataGridService) {

  'use strict';

  var expect = shared.expect;
  var bind = shared.bind;

  describe('sulfur/dataGridService', function () {

    describe('.namespaceURI', function () {

      it("should return 'http://www.webcomposition.net/2008/02/dgs/'", function () {
        expect(DataGridService.namespaceURI).to.equal('http://www.webcomposition.net/2008/02/dgs/');
      });

    });

    describe('#initialize()', function () {

      it("should reject an empty DataGridService URL", function () {
        expect(bind(DataGridService, 'create', ''))
          .to.throw("expecting a non-empty endpoint URL");
      });

    });

    describe('#endpoint', function () {

      it("should return the DataGridService endpoint URL", function () {
        var url = 'http://example.org';
        var dgs = DataGridService.create(url);
        expect(dgs.endpoint).to.equal(url);
      });

    });

    describe('#recordCollectionMetaUrl()', function () {

      it("should return the record collection's schema URL", function () {
        var dgs = DataGridService.create('http://example.org');
        var resource = { recordCollectionName: 'foo' };
        expect(dgs.recordCollectionMetaUrl(resource))
          .to.equal(dgs.recordCollectionUrl(resource) + '/meta');
      });

    });

    describe('#recordCollectionSchemaUrl()', function () {

      it("should return the record collection's schema URL", function () {
        var dgs = DataGridService.create('http://example.org');
        var resource = { recordCollectionName: 'foo' };
        expect(dgs.recordCollectionSchemaUrl(resource))
          .to.equal(dgs.recordCollectionMetaUrl(resource) + '/schema');
      });

    });

    describe('#recordCollectionUrl()', function () {

      it("should return the record collection URL", function () {
        var dgs = DataGridService.create('http://example.org');
        var resource = { recordCollectionName: 'xyz' };
        expect(dgs.recordCollectionUrl(resource)).to.equal(dgs.endpoint + '/' + resource.recordCollectionName);
      });

      it("should handle an endpoint URL with trailing slash", function () {
        var dgs = DataGridService.create('http://example.org/');
        var resource = { recordCollectionName: 'abc' };
        expect(dgs.recordCollectionUrl(resource)).to.equal(dgs.endpoint + resource.recordCollectionName);
      });

    });

    describe('#recordUrl()', function () {

      it("should return the record URL", function () {
        var dgs = DataGridService.create('http://example.org');
        var resource = { recordCollectionName: 'xyz' };
        expect(dgs.recordUrl(resource, 'foo-123')).to.equal(dgs.recordCollectionUrl(resource) + '/foo-123');
      });

    });

    describe('#recordIdFromUrl()', function () {

      var dgs;
      var resource;

      beforeEach(function () {
        dgs = DataGridService.create('http://example.org');
        resource = { recordCollectionName: 'foo-bar' };
      });

      it("should reject the URL when not equal to #recordCollectionUrl() for the given resource", function () {
        var url = 'http://example.org/xxx/123-456';
        expect(bind(dgs, 'recordIdFromUrl', resource, url))
          .to.throw("expecting a record URL of the given resource");
      });

      context("when the URL begins with the resource's record collection URL", function () {

        it("should return the record ID encoding in the given URL", function () {
          var url = 'http://example.org/foo-bar/123-456';
          expect(dgs.recordIdFromUrl(resource, url)).to.equal('123-456');
        });

        it("should return the substring up to the first slash", function () {
          var url = 'http://example.org/foo-bar/123/456';
          expect(dgs.recordIdFromUrl(resource, url)).to.equal('123');
        });

      });

    });

    describe('#fileCollectionUrl()', function () {

      it("should return the file collection URL", function () {
        var dgs = DataGridService.create('http://example.org');
        var resource = { fileCollectionName: 'xyz' };
        expect(dgs.fileCollectionUrl(resource)).to.equal(dgs.endpoint + '/' + resource.fileCollectionName);
      });

      it("should handle an endpoint URL with trailing slash", function () {
        var dgs = DataGridService.create('http://example.org/');
        var resource = { fileCollectionName: 'abc' };
        expect(dgs.fileCollectionUrl(resource)).to.equal(dgs.endpoint + resource.fileCollectionName);
      });

    });

    describe('#fileUrl()', function () {

      it("should return the file URL", function () {
        var dgs = DataGridService.create('http://example.org');
        var resource = { fileCollectionName: 'foo' };
        expect(dgs.fileUrl(resource, 'xyz-987')).to.equal(dgs.fileCollectionUrl(resource) + '/xyz-987');
      });

    });

    describe('#fileIdFromUrl()', function () {

      var dgs;
      var resource;

      beforeEach(function () {
        dgs = DataGridService.create('http://example.org');
        resource = { fileCollectionName: 'foo-bar' };
      });

      it("should reject the URL when not equal to #fileCollectionUrl() for the given resource", function () {
        var url = 'http://example.org/xxx/123-456';
        expect(bind(dgs, 'fileIdFromUrl', resource, url))
          .to.throw("expecting a file URL of the given resource");
      });

      context("when the URL begins with the resource's file collection URL", function () {

        it("should return the record ID encoding in the given URL", function () {
          var url = 'http://example.org/foo-bar/123-456';
          expect(dgs.fileIdFromUrl(resource, url)).to.equal('123-456');
        });

        it("should return the substring up to the first slash", function () {
          var url = 'http://example.org/foo-bar/123/456';
          expect(dgs.fileIdFromUrl(resource, url)).to.equal('123');
        });

      });

    });

    describe('#recordCollectionDefinition()', function () {

      it("should return a string representing an XML document with the record collection definition", function () {
        var dgs = DataGridService.create('http://example.org');
        var resource = { recordCollectionName: 'foo' };
        var s = dgs.recordCollectionDefinition(resource);
        expect(s).to.equal(
          '<collection xmlns="http://www.w3.org/2007/app">' +
           '<atom:title xmlns:atom="http://www.w3.org/2005/Atom">' + resource.recordCollectionName + '</atom:title>' +
           '<dgs:dataspaceengines xmlns:dgs="http://www.webcomposition.net/2008/02/dgs/">' +
            '<dgs:dataspaceengine dgs:type="http://www.webcomposition.net/2008/02/dgs/DataSpaceEngines/XmlDataSpaceEngine"/>' +
           '</dgs:dataspaceengines>' +
          '</collection>');
      });

    });

    describe('#recordCollectionValidationScopeDefinition()', function () {

      it("should return a N3 document with the record collection validation scope definition", function () {
        var dgs = DataGridService.create('http://example.org');
        var resource = { recordCollectionName: 'foo' };
        var d = dgs.recordCollectionValidationScopeDefinition(resource);
        expect(d).to.equal(
          '<' + dgs.recordCollectionUrl(resource) + '>' +
          ' <http://www.webcomposition.net/2008/02/dgs/meta/ValidationScope>' +
          ' "Element".');
      });

    });

    describe('#fileCollectionDefinition()', function () {

      it("should return a string representing an XML document with the file collection definition", function () {
        var dgs = DataGridService.create('http://example.org');
        var resource = { fileCollectionName: 'foo' };
        var s = dgs.fileCollectionDefinition(resource);
        expect(s).to.equal(
          '<collection xmlns="http://www.w3.org/2007/app">' +
           '<atom:title xmlns:atom="http://www.w3.org/2005/Atom">' + resource.fileCollectionName + '</atom:title>' +
           '<dgs:dataspaceengines xmlns:dgs="http://www.webcomposition.net/2008/02/dgs/">' +
            '<dgs:dataspaceengine dgs:type="http://www.webcomposition.net/2008/02/dgs/DataSpaceEngines/BinaryDataSpaceEngine"/>' +
           '</dgs:dataspaceengines>' +
          '</collection>');
      });

    });

  });

});
