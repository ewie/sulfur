/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'app/editor/settings',
  'sulfur/ui/model'
], function (settings, Model) {

  'use strict';

  return Model.clone({

    attributes: {
      endpoint: { default: '' },
      proxy: { default: '' }
    },

    createFromSettings: function () {
      return this.create({
        endpoint: settings.endpoint,
        proxy: settings.proxy
      });
    }

  }).augment({

    _validate: function (errors) {
      this.get('endpoint') || (errors.endpoint = "must not be empty");
    },

    _construct: function () {
      // empty
    }

  });

});
