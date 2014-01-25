/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define(['sulfur/ui/view/access/text'], function (TextAccessor) {

  'use strict';

  return TextAccessor.derive({

    initialize: function (element) {
      this._element = element;
    },

    get url() { return this._element.href },

    set url(url) { this._element.href = url }

  });

});
