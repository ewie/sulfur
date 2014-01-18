/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define(function () {

  'use strict';

  return {
    url: function (url) {
      return window.widget.proxify(url);
    }
  };

});
