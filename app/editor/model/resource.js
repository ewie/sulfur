/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'app/editor/model/schema',
  'sulfur/resource',
  'sulfur/ui/model'
], function (SchemaModel, Resource, Model) {

  'use strict';

  return Model.clone({

    attributes: {
      recordCollectionName: { default: '' },
      fileCollectionName: { default: '' },
      schema: { default: function () { return SchemaModel.create() } }
    },

    _extract: function (resource) {
      return {
        recordCollectionName: resource.recordCollectionName,
        fileCollectionName: resource.fileCollectionName,
        schema: SchemaModel.createFromObject(resource.schema)
      };
    }

  }).augment({

    _validate: function (errors) {
      Model.prototype._validate.call(this, errors);

      var rname = this.get('recordCollectionName');
      var fname = this.get('fileCollectionName');

      var rvalid = Resource.isValidName(rname);
      var fvalid = Resource.isValidName(fname);

      rvalid || (errors.recordCollectionName = "must not be empty and may contain only the characters A-Z a-z 0-9 - _");
      fvalid || (errors.fileCollectionName = "must not be empty and may contain only the characters A-Z a-z 0-9 - _");

      if (rvalid && fvalid && rname === fname) {
        errors.recordCollectionName = "must be different from file collection name";
        errors.fileCollectionName = "must be different from record collection name";
      }
    },

    _construct: function () {
      var rname = this.get('recordCollectionName');
      var fname = this.get('fileCollectionName');
      var schema = this.get('schema');
      if (rname && fname && schema) {
        return Resource.create(schema.object, rname, fname);
      }
    }

  });

});
