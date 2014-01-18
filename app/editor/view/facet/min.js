/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/ui/view',
  'sulfur/ui/view/access/checkbox',
  'sulfur/ui/view/access/view',
  'sulfur/ui/view/accessor',
  'sulfur/ui/view/blueprint',
  'sulfur/ui/view/event',
  'sulfur/ui/view/event/published',
  'text!app/editor/html/facet/min.html'
], function (
    View,
    CheckboxAccess,
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
      Event.create('change', '[name = "exclusive"]', PublishedEvent.create('exclusive'))
    ],

    accessors: [
      Accessor.create('value', '[name = "value"]', ViewAccess),
      Accessor.create('exclusive', '[name = "exclusive"]', CheckboxAccess)
    ]

  });

  return View.clone({

    get blueprint() { return blueprint }

  });

});
