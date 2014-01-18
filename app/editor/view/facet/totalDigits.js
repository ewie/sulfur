/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/ui/view',
  'sulfur/ui/view/access/view',
  'sulfur/ui/view/accessor',
  'sulfur/ui/view/blueprint',
  'text!app/editor/html/facet/totalDigits.html'
], function (View, ViewAccess, Accessor, Blueprint, html) {

  'use strict';

  var blueprint = Blueprint.create({

    html: html,

    accessors: [
      Accessor.create('value', '[name = "value"]', ViewAccess)
    ]

  });

  return View.clone({

    get blueprint() { return blueprint }

  });

});
