/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/dataGridService',
  'sulfur/resource'
], function (DataGridService, Resource) {

  'use strict';

  var dgs;
  var resource;

  var widget = window.widget;

  return {

    /** Provide a singleton sulfur/dataGridService using the configured endpoint URL */
    get dgs() { return dgs || (dgs = DataGridService.create(this.get('endpoint'))) },

    /** Provide a singleton sulfur/resource using the configured resource name */
    get resource() {
      return resource || (
        resource = Resource.create(
          // Mock schema without files so we can create a resource with
          // eventually no file collection name (which will be invalid if the
          // schema has files).
          { hasFiles: false },
          this.get('recordCollectionName'),
          this.get('fileCollectionName')));
    },

    setSchema: function (schema) {
      var rname;
      var fname;
      if (resource) {
        rname = resource.recordCollectionName;
        fname = resource.fileCollectionName;
      } else {
        rname = this.get('recordCollectionName');
        fname = this.get('fileCollectionName');
      }
      resource = Resource.create(schema, rname, fname);
    },

    get: function (name) { return widget.preferences.getItem(name) },

    get name() { return widget.name }

  };

});
