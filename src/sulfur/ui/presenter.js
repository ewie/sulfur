/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define(['sulfur/util/factory'], function (Factory) {

  'use strict';

  return Factory.derive({

    /**
     * @param {sulfur/ui/view} view
     * @param {sulfur/ui/model} model
     */
    initialize: function (view, model) {
      this._view = view;
      this._model = model;
    },

    get model() {
      return this._model;
    },

    get view() {
      return this._view;
    }

  });

});
