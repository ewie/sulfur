/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'text!app/widget/html/app.html',
  'sulfur/ui/view',
  'sulfur/ui/view/access/html',
  'sulfur/ui/view/access/link',
  'sulfur/ui/view/access/text',
  'sulfur/ui/view/access/view',
  'sulfur/ui/view/accessor',
  'sulfur/ui/view/blueprint',
  'sulfur/ui/view/event',
  'sulfur/ui/view/event/published'
], function (
    html,
    View,
    HtmlAccess,
    LinkAccess,
    TextAccess,
    ViewAccess,
    Accessor,
    Blueprint,
    Event,
    PublishedEvent
) {

  'use strict';

  var blueprint = Blueprint.create({

    html: html,

    events: [
      Event.create('click', '[name = "new"]', PublishedEvent.create('new')),
      Event.create('click', '[name = "toggle-about"]', PublishedEvent.create('about'))
    ],

    accessors: [
      Accessor.create('name', '[name = "name"]', TextAccess),
      Accessor.create('authorName', '[name = "author-name"]', TextAccess),
      Accessor.create('authorEmail', '[name = "author-email"]', LinkAccess),
      Accessor.create('description', '[name = "description"]', TextAccess),
      Accessor.create('status', '[name = "status"]', HtmlAccess),
      Accessor.create('index', '[name = "index"]', ViewAccess),
      Accessor.create('records', '[name = "records"]', ViewAccess)
    ]

  });

  return View.clone({

    get blueprint() { return blueprint }

  }).augment({

    toggleAbout: function () {
      this._aboutElement.classList.toggle('show');
    },

    get _aboutElement() { return this.element.querySelector('[name = "about"]') },

    hideStatus: function () {
      this._status.style.display = 'none';
    },

    get _status() { return this.element.querySelector('[name = "status"]') }

  });

});
