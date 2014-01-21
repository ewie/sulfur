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
  'sulfur/ui/view/accessor',
  'sulfur/ui/view/blueprint',
  'sulfur/ui/view/event',
  'sulfur/ui/view/event/published',
  'text!app/editor/html/app.html'
], function (
    View,
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
      Event.create('click', '[name = "new"]', PublishedEvent.create('new')),
      Event.create('click', '[name = "toggle-settings"]', PublishedEvent.create('settings')),
      Event.create('change', '[name = "endpoint"]', PublishedEvent.create('endpoint')),
      Event.create('change', '[name = "proxy"]', PublishedEvent.create('proxy'))
    ],

    accessors: [
      Accessor.create('widget', '[name = "widget"]', ViewAccess),
      Accessor.create('endpoint', '[name = "endpoint"]', ValueAccess),
      Accessor.create('proxy', '[name = "proxy"]', ValueAccess)
    ]

  });

  return View.clone({

    get blueprint() { return blueprint }

  }).augment({

    toggleSettings: function () {
      this._settingsElement.classList.toggle('show');
    },

    get _settingsElement() { return this.element.querySelector('[name = "settings"]') }

  });

});
