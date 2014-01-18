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
  'sulfur/ui/view/accessor',
  'sulfur/ui/view/blueprint',
  'sulfur/ui/view/event',
  'sulfur/ui/view/event/dispatched',
  'sulfur/ui/view/event/published',
  'text!app/editor/html/tab.html'
], function (
    View,
    TextAccess,
    Accessor,
    Blueprint,
    Event,
    DispatchedEvent,
    PublishedEvent,
    html
) {

  'use strict';

  var blueprint = Blueprint.create({

    html: html,

    events: [
      Event.create('click', '[name = "name"]', DispatchedEvent.create('_onSelect')),
      Event.create('click', '[name = "remove"]', PublishedEvent.create('remove'))
    ],

    accessors: [
      Accessor.create('name', '[name = "name"]', TextAccess)
    ]

  });

  return View.clone({

    get blueprint() { return blueprint }

  }).augment({

    _onSelect: function () {
      if (!this.element.classList.contains('current')) {
        this.publisher.publish('select');
      }
    },

    select: function () {
      this.element.classList.add('current');
    },

    unselect: function () {
      this.element.classList.remove('current');
    },

    get error() {
      return this.element.classList.contains('error');
    },

    set error(value) {
      var cl = this.element.classList;
      value ? cl.add('error') : cl.remove('error');
    }

  });

});
