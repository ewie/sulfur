/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/ui/collection',
  'sulfur/ui/model'
], function (Collection, Model) {

  'use strict';

  return Model.clone({

    attributes: {
      resource: { default: null },
      records: { default: function () { return Collection.create() } }
    },

    _extract: function () {
      throw new Error("not implemented");
    }

  }).augment({

    _construct: function () {
      // empty
    }

  });

});
