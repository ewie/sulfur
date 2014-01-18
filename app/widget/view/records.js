/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'text!app/widget/html/records.html',
  'sulfur/ui/view',
  'sulfur/ui/view/access/views',
  'sulfur/ui/view/accessor',
  'sulfur/ui/view/blueprint'
], function (html, View, ViewsAccess, Accessor, Blueprint) {

  'use strict';

  var blueprint = Blueprint.create({

    html: html,

    accessors: [
      Accessor.create('records', ViewsAccess)
    ]

  });

  return View.clone({

    get blueprint() { return blueprint }

  });

});
