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
  'sulfur/ui/view/access/view',
  'sulfur/ui/view/accessor',
  'sulfur/ui/view/blueprint',
  'sulfur/ui/view/event',
  'sulfur/ui/view/event/dispatched',
  'text!app/editor/html/type/complex/element.html'
], function (
    View,
    TextAccess,
    ViewAccess,
    Accessor,
    Blueprint,
    Event,
    DispatchedEvent,
    html
) {

  'use strict';

  var blueprint = Blueprint.create({

    html: html,

    events: [
      Event.create('click', '[name = "head"]', DispatchedEvent.create('_toggleExpand'))
    ],

    accessors: [
      Accessor.create('name', '[name = "name"]', TextAccess),
      Accessor.create('type-name', '[name = "type-name"]', TextAccess),
      Accessor.create('type', '[name = "type"]', ViewAccess)
    ]

  });

  return View.clone({

    get blueprint() { return blueprint }

  }).augment({

    _toggleExpand: function () {
      this.element.classList.toggle('expanded');
    }

  });

});
