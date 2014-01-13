/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/value/simple/fileRef',
  'sulfur/util/factory'
], function (FileRefValue, Factory) {

  'use strict';

  return Factory.clone({

    isValidName: function (s) {
      return /^[A-Za-z0-9_-]+$/.test(s);
    }

  }).augment({

    initialize: function (schema, recordCollectionName, fileCollectionName) {
      if (!this.factory.isValidName(recordCollectionName)) {
        throw new Error("expecting a valid record collection name");
      }
      if (schema.hasFiles) {
        if (!this.factory.isValidName(fileCollectionName)) {
          throw new Error("expecting a valid file collection name");
        }
        if (recordCollectionName === fileCollectionName) {
          throw new Error("expecting different record and file collection names");
        }
      }
      this._schema = schema;
      this._recordCollectionName = recordCollectionName;
      this._fileCollectionName = fileCollectionName;
    },

    get schema() { return this._schema },

    get recordCollectionName() { return this._recordCollectionName },

    get fileCollectionName() { return this._fileCollectionName },

    get hasFiles () { return this.schema.hasFiles }

  });

});
