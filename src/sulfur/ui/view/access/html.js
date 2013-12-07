/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define(['sulfur/ui/view/accessor'], function (Accessor) {

  'use strict';

  return Accessor.derive({

    initialize: function (element) {
      this._element = element;
    },

    get html() {
      return this._element.innerHTML;
    },

    set html(value) {
      this._element.innerHTML = value;
    }

  });

});
