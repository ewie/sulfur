/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/file',
  'sulfur/schema/value/simple/fileRef',
  'sulfur/ui/model'
], function (File, FileRefValue, Model) {

  'use strict';

  return Model.clone({

    attributes: {
      id: { default: '' },
      blob: { default: null }
    },

    _extract: function (value) {
      return {
        id: value.value,
        file: null
      };
    }

  }).augment({

    _validate: function (errors) {
      var blob = this.get('blob');
      if (blob) {
        blob.size || (errors.blob = "the file must not be empty");
      }
    },

    validateWithType: function (type) {
      if (this.isInternallyValid()) {
        var value = this.object;
        var err = false;
        if (value) {
          var v = type.createValidator();
          var errors = [];
          var isValid = v.validate(value, errors);
          isValid || (err = errors.join('\n'));
        }
        this.updateExternalErrors({ value: err });
      }
    },

    _construct: function () {
      var id = this.get('id');
      var blob = this.get('blob');
      var file;
      blob && (file = File.create(blob));
      if (id || file) {
        return FileRefValue.create(id, file);
      }
    }

  });

});
