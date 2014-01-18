/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'text!app/editor/html/facet/mediaType.html',
  'sulfur/ui/view',
  'sulfur/ui/view/access/views',
  'sulfur/ui/view/accessor',
  'sulfur/ui/view/blueprint',
  'sulfur/ui/view/event',
  'sulfur/ui/view/event/published'
], function (html, View, ViewsAccess, Accessor, Blueprint, Event, PublishedEvent) {

  'use strict';

  var blueprint = Blueprint.create({

    html: html,

    events: [
      Event.create('click', '[name = "add"]', PublishedEvent.create('add'))
    ],

    accessors: [
      Accessor.create('values', '[name = "values"]', ViewsAccess)
    ]

  });

  return View.clone({

    get blueprint() { return blueprint }

  });

});
