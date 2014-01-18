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
      Resource.isValidName(this.get('recordCollectionName')) ||
        (errors.recordCollectionName = "must not be empty and may contain only the characters A-Z a-z 0-9 - _");
      Resource.isValidName(this.get('fileCollectionName')) ||
        (errors.fileCollectionName = "must not be empty and may contain only the characters A-Z a-z 0-9 - _");
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
