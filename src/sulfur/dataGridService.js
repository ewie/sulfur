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

  function extractIdFromUrl(url, collectionUrl) {
    collectionUrl = concatPath(collectionUrl, '');
    if (url.indexOf(collectionUrl) === 0) {
      var s = url.substr(collectionUrl.length);
      var p = s.indexOf('/');
      return p > -1 ? s.substr(0, p) : s;
    }
  }

  return Factory.clone({

    get namespaceURI() { return NS_DGS }

  }).augment({

    initialize: function (endpoint) {
      if (!endpoint) {
        throw new Error("expecting a non-empty endpoint URL");
      }
      this._endpoint = endpoint;
    },

    get endpoint() { return this._endpoint },

    recordCollectionUrl: function (resource) {
      return concatPath(this.endpoint, resource.recordCollectionName);
    },

    recordCollectionMetaUrl: function (resource) {
      return concatPath(this.recordCollectionUrl(resource), 'meta');
    },

    recordCollectionSchemaUrl: function (resource) {
      return concatPath(this.recordCollectionMetaUrl(resource), 'schema');
    },

    recordUrl: function (resource, id) {
      return concatPath(this.recordCollectionUrl(resource), id);
    },

    recordIdFromUrl: function (resource, url) {
      var id = extractIdFromUrl(url, this.recordCollectionUrl(resource));
      if (!id) {
        throw new Error("expecting a record URL of the given resource");
      }
      return id;
    },

    recordCollectionDefinition: function (resource) {
      return createCollectionDefinition(resource.recordCollectionName, DGS_XML_DATA_SPACE_ENGINE);
    },

    recordCollectionValidationScopeDefinition: function (resource) {
      return '<' + this.recordCollectionUrl(resource) + '>' +
        ' <' + DGS_VALIDATION_SCOPE + '>' +
        ' "Element".';
    },

    fileCollectionUrl: function (resource) {
      return concatPath(this.endpoint, resource.fileCollectionName);
    },

    fileUrl: function (resource, id) {
      return concatPath(this.fileCollectionUrl(resource), id);
    },

    fileIdFromUrl: function (resource, url) {
      var id = extractIdFromUrl(url, this.fileCollectionUrl(resource));
      if (!id) {
        throw new Error("expecting a file URL of the given resource");
      }
      return id;
    },

    fileCollectionDefinition: function (resource) {
      return createCollectionDefinition(resource.fileCollectionName, DGS_BINARY_DATA_SPACE_ENGINE);
    }

  });

});
