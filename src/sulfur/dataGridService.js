/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define(['sulfur/util/factory'], function (Factory) {

  'use strict';

  var NS_DGS = 'http://www.webcomposition.net/2008/02/dgs/';
  var DGS_XML_DATA_SPACE_ENGINE = NS_DGS + 'DataSpaceEngines/XmlDataSpaceEngine';
  var DGS_BINARY_DATA_SPACE_ENGINE = NS_DGS + 'DataSpaceEngines/BinaryDataSpaceEngine';
  var DGS_VALIDATION_SCOPE = NS_DGS + 'meta/ValidationScope';

  function createCollectionDefinition(title, dataSpaceEngine) {
    // XXX
    //   Generate a string rather than a Document object. The DataGridService
    //   won't handle a document with unqualified attribute "type" used by
    //   element "dataspaceengine", and the XML serializer won't generate a
    //   prefixed attribute either.
    return (
      '<collection xmlns="http://www.w3.org/2007/app">' +
       '<atom:title xmlns:atom="http://www.w3.org/2005/Atom">' + title + '</atom:title>' +
       '<dgs:dataspaceengines xmlns:dgs="' + NS_DGS + '">' +
        '<dgs:dataspaceengine dgs:type="' + dataSpaceEngine + '"/>' +
       '</dgs:dataspaceengines>' +
      '</collection>');
  }

  function concatPath(x, y) {
    (x.charAt(x.length - 1) !== '/') && (x += '/');
    x += y;
    return x;
  }

  return Factory.derive({

    initialize: function (endpoint) {
      if (!endpoint) {
        throw new Error("expecting a non-empty endpoint URL");
      }
      this._endpoint = endpoint;
    },

    get endpoint() { return this._endpoint },

    get relationshipsEndpoint() { return concatPath(this.endpoint, 'meta/relationships') },

    recordCollectionUrl: function (resource) {
      return concatPath(this.endpoint, resource.name);
    },

    fileCollectionUrl: function (resource) {
      return concatPath(this.endpoint, resource.name + '-files');
    },

    recordCollectionMetaUrl: function (resource) {
      return concatPath(this.recordCollectionUrl(resource), 'meta');
    },

    recordCollectionSchemaUrl: function (resource) {
      return concatPath(this.recordCollectionMetaUrl(resource), 'schema');
    },

    recordCollectionDefinition: function (resource) {
      return createCollectionDefinition(resource.name, DGS_XML_DATA_SPACE_ENGINE);
    },

    recordCollectionValidationScopeDefinition: function (resource) {
      return '<' + this.recordCollectionUrl(resource) + '>' +
        ' <' + DGS_VALIDATION_SCOPE + '>' +
        ' "Element".';
    },

    fileCollectionDefinition: function (resource) {
      return createCollectionDefinition(resource.name + '-files', DGS_BINARY_DATA_SPACE_ENGINE);
    },

    recordFileRelationDefinition: function (resource) {
      return '@prefix dm:<' + NS_DGS + 'meta/>.\n' +
        '<> dm:source <' + this.recordCollectionUrl(resource) + '>.\n' +
        '<> dm:target <' + this.fileCollectionUrl(resource) + '>.\n' +
        '<> dm:predicate <urn:example:hasFile>.\n' +
        '<> dm:inverse-predicate <urn:example:belongsToResource>.\n' +
        '<> dm:target-alias "files".\n' +
        '<> dm:source-alias "resource".';
    }

  });

});
