/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */
/* global describe, it */

define([
  'shared',
  'sulfur/dataGridService'
], function (shared, DataGridService) {

  'use strict';

  var expect = shared.expect;
  var bind = shared.bind;

  describe('sulfur/dataGridService', function () {

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

    describe('#relationshipsEndpoint', function () {

      it("should return the DataGridService relationships endpoint URL", function () {
        var dgs = DataGridService.create('http://example.org');
        expect(dgs.relationshipsEndpoint).to.equal(dgs.endpoint + '/meta/relationships');
      });

    });

    describe('#recordCollectionMetaUrl()', function () {

      it("should return the record collection's schema URL", function () {
        var dgs = DataGridService.create('http://example.org');
        var resource = { name: 'foo' };
        expect(dgs.recordCollectionMetaUrl(resource))
          .to.equal(dgs.recordCollectionUrl(resource) + '/meta');
      });

    });

    describe('#recordCollectionSchemaUrl()', function () {

      it("should return the record collection's schema URL", function () {
        var dgs = DataGridService.create('http://example.org');
        var resource = { name: 'foo' };
        expect(dgs.recordCollectionSchemaUrl(resource))
          .to.equal(dgs.recordCollectionMetaUrl(resource) + '/schema');
      });

    });

    describe('#recordCollectionUrl()', function () {

      it("should return the record collection URL", function () {
        var dgs = DataGridService.create('http://example.org');
        var resource = { name: 'xyz' };
        expect(dgs.recordCollectionUrl(resource)).to.equal(dgs.endpoint + '/' + resource.name);
      });

      it("should handle an endpoint URL with trailing slash", function () {
        var dgs = DataGridService.create('http://example.org/');
        var resource = { name: 'abc' };
        expect(dgs.recordCollectionUrl(resource)).to.equal(dgs.endpoint + resource.name);
      });

    });

    describe('#recordUrl()', function () {

      it("should return the record URL", function () {
        var dgs = DataGridService.create('http://example.org');
        var resource = { name: 'xyz' };
        expect(dgs.recordUrl(resource, 'foo-123')).to.equal(dgs.recordCollectionUrl(resource) + '/foo-123');
      });

    });

    describe('#fileCollectionUrl()', function () {

      it("should return the file collection URL", function () {
        var dgs = DataGridService.create('http://example.org');
        var resource = { name: 'xyz' };
        expect(dgs.fileCollectionUrl(resource)).to.equal(dgs.endpoint + '/' + resource.name + '-files');
      });

      it("should handle an endpoint URL with trailing slash", function () {
        var dgs = DataGridService.create('http://example.org/');
        var resource = { name: 'abc' };
        expect(dgs.fileCollectionUrl(resource)).to.equal(dgs.endpoint + resource.name + '-files');
      });

    });

    describe('#fileUrl()', function () {

      it("should return the file URL", function () {
        var dgs = DataGridService.create('http://example.org');
        var resource = { name: 'foo' };
        expect(dgs.fileUrl(resource, 'xyz-987')).to.equal(dgs.fileCollectionUrl(resource) + '/xyz-987');
      });

    });

    describe('#recordCollectionDefinition()', function () {

      it("should return a string representing an XML document with the record collection definition", function () {
        var dgs = DataGridService.create('http://example.org');
        var resource = { name: 'foo' };
        var s = dgs.recordCollectionDefinition(resource);
        expect(s).to.equal(
          '<collection xmlns="http://www.w3.org/2007/app">' +
           '<atom:title xmlns:atom="http://www.w3.org/2005/Atom">' + resource.name + '</atom:title>' +
           '<dgs:dataspaceengines xmlns:dgs="http://www.webcomposition.net/2008/02/dgs/">' +
            '<dgs:dataspaceengine dgs:type="http://www.webcomposition.net/2008/02/dgs/DataSpaceEngines/XmlDataSpaceEngine"/>' +
           '</dgs:dataspaceengines>' +
          '</collection>');
      });

    });

    describe('#recordCollectionValidationScopeDefinition()', function () {

      it("should return a N3 document with the record collection validation scope definition", function () {
        var dgs = DataGridService.create('http://example.org');
        var resource = { name: 'foo' };
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
        var resource = { name: 'foo' };
        var s = dgs.fileCollectionDefinition(resource);
        expect(s).to.equal(
          '<collection xmlns="http://www.w3.org/2007/app">' +
           '<atom:title xmlns:atom="http://www.w3.org/2005/Atom">' + resource.name + '-files</atom:title>' +
           '<dgs:dataspaceengines xmlns:dgs="http://www.webcomposition.net/2008/02/dgs/">' +
            '<dgs:dataspaceengine dgs:type="http://www.webcomposition.net/2008/02/dgs/DataSpaceEngines/BinaryDataSpaceEngine"/>' +
           '</dgs:dataspaceengines>' +
          '</collection>');
      });

    });

    describe('#recordFileRelationDefinition()', function () {

      it("should return a N3 document with the record-file-relationship definition", function () {
        var dgs = DataGridService.create('http://example.org');
        var resource = { name: 'foo' };
        var d = dgs.recordFileRelationDefinition(resource);
        expect(d).to.equal(
          '@prefix dm:<http://www.webcomposition.net/2008/02/dgs/meta/>.\n' +
          '<> dm:source <' + dgs.recordCollectionUrl(resource) + '>.\n' +
          '<> dm:target <' + dgs.fileCollectionUrl(resource) + '>.\n' +
          '<> dm:predicate <urn:example:hasFile>.\n' +
          '<> dm:inverse-predicate <urn:example:belongsToResource>.\n' +
          '<> dm:target-alias "files".\n' +
          '<> dm:source-alias "resource".');
      });

    });

  });

});
