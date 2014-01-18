/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/ui/view',
  'sulfur/ui/view/access/text',
  'sulfur/ui/view/access/views',
  'sulfur/ui/view/accessor',
  'sulfur/ui/view/blueprint',
  'text!app/editor/html/type/simple/atomic.html'
], function (View, TextAccess, ViewsAccess, Accessor, Blueprint, html) {

  'use strict';

  var blueprint = Blueprint.create({

    html: html,

    accessors: [
      Accessor.create('name', '[name = "name"]', TextAccess),
      Accessor.create('facets', '[name = "facets"]', ViewsAccess)
    ]

  });

  return View.clone({

    get blueprint() { return blueprint }

  });

});
