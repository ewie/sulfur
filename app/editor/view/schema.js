/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/ui/view',
  'sulfur/ui/view/access/value',
  'sulfur/ui/view/access/view',
  'sulfur/ui/view/access/views',
  'sulfur/ui/view/accessor',
  'sulfur/ui/view/blueprint',
  'sulfur/ui/view/event',
  'sulfur/ui/view/event/published',
  'text!app/editor/html/schema.html'
], function (
    View,
    ValueAccess,
    ViewAccess,
    ViewsAccess,
    Accessor,
    Blueprint,
    Event,
    PublishedEvent,
    html
) {

  'use strict';

  var blueprint = Blueprint.create({

    html: html,

    events: [
      Event.create('click', '[name = "add-element"]', PublishedEvent.create('add-element')),
      Event.create('change', '[name = "root"]', PublishedEvent.create('root')),
      Event.create('change', '[name = "namespace"]', PublishedEvent.create('namespace'))
    ],

    accessors: [
      Accessor.create('element', '[name = "element"]', ViewAccess),
      Accessor.create('tabs', '[name = "tabs"]', ViewsAccess),
      Accessor.create('root', '[name = "root"]', ValueAccess),
      Accessor.create('namespace', '[name = "namespace"]', ValueAccess)
    ]

  });

  return View.clone({

    get blueprint() { return blueprint }

  });

});
