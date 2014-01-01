/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/ui/publisher',
  'sulfur/ui/view/accessor'
], function (Publisher, Accessor) {

  'use strict';

  return Accessor.derive({

    initialize: function (element) {
      this._element = element;
    },

    get text() {
      return this._element.textContent;
    },

    set text(value) {
      if (this._element.textContent !== value) {
        this._element.textContent = value;
      }
    }

  });

});
