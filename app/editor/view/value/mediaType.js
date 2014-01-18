/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'text!app/editor/html/value/mediaType.html',
  'sulfur/ui/view',
  'sulfur/ui/view/access/value',
  'sulfur/ui/view/accessor',
  'sulfur/ui/view/blueprint',
  'sulfur/ui/view/event',
  'sulfur/ui/view/event/published'
], function (
    html,
    View,
    ValueAccess,
    Accessor,
    Blueprint,
    Event,
    PublishedEvent
) {

  'use strict';

  var blueprint = Blueprint.create({

    html: html,

    events: [
      Event.create('change', '[name = "value"]', PublishedEvent.create('change')),
      Event.create('click', '[name = "remove"]', PublishedEvent.create('remove'))
    ],

    accessors: [
      Accessor.create('value', '[name = "value"]', ValueAccess)
    ]

  });

  return View.clone({

    get blueprint() { return blueprint }

  });

});
