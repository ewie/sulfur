/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/ui/view',
  'sulfur/ui/view/access/html',
  'sulfur/ui/view/access/value',
  'sulfur/ui/view/access/view',
  'sulfur/ui/view/accessor',
  'sulfur/ui/view/blueprint',
  'sulfur/ui/view/event',
  'sulfur/ui/view/event/published',
  'text!app/editor/html/widget.html'
], function (
    View,
    HtmlAccess,
    ValueAccess,
    ViewAccess,
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
      Event.create('change', '[name = "name"]', PublishedEvent.create('name')),
      Event.create('change', '[name = "author-name"]', PublishedEvent.create('author-name')),
      Event.create('change', '[name = "author-email"]', PublishedEvent.create('author-email')),
      Event.create('change', '[name = "description"]', PublishedEvent.create('description'))
    ],

    accessors: [
      Accessor.create('name', '[name = "name"]', ValueAccess),
      Accessor.create('authorName', '[name = "author-name"]', ValueAccess),
      Accessor.create('authorEmail', '[name = "author-email"]', ValueAccess),
      Accessor.create('description', '[name = "description"]', ValueAccess),
      Accessor.create('resource', '[name = "resource"]', ViewAccess),
      Accessor.create('xml', '[name = "xml"]', HtmlAccess),
      Accessor.create('create', '[name = "create"]', ViewAccess)
    ]

  });

  return View.clone({

    get blueprint() { return blueprint }

  });

});
