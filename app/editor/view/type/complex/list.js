/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/ui/view',
  'sulfur/ui/view/accessor',
  'sulfur/ui/view/access/value',
  'sulfur/ui/view/access/view',
  'sulfur/ui/view/blueprint',
  'sulfur/ui/view/event',
  'sulfur/ui/view/event/published',
  'text!app/editor/html/type/complex/list.html'
], function (
    View,
    Accessor,
    ValueAccess,
    ViewAccess,
    Blueprint,
    Event,
    PublishedEvent,
    html
) {

  'use strict';

  var blueprint = Blueprint.create({

    html: html,

    events: [
      Event.create('change', '[name = "item-name"]', PublishedEvent.create('item-name'))
    ],

    accessors: [
      Accessor.create('itemName', '[name = "item-name"]', ValueAccess),
      Accessor.create('maxLength', '[name = "max-length"]', ViewAccess),
      Accessor.create('minLength', '[name = "min-length"]', ViewAccess),
      Accessor.create('itemType', '[name = "itemType"]', ViewAccess)
    ]

  });

  return View.clone({

    get blueprint() { return blueprint }

  });

});
