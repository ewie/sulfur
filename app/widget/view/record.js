/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'text!app/widget/html/record.html',
  'sulfur/ui/view',
  'sulfur/ui/view/access/text',
  'sulfur/ui/view/access/views',
  'sulfur/ui/view/accessor',
  'sulfur/ui/view/blueprint',
  'sulfur/ui/view/event',
  'sulfur/ui/view/event/published'
], function (
    html,
    View,
    TextAccess,
    ViewsAccess,
    Accessor,
    Blueprint,
    Event,
    PublishedEvent
) {

  'use strict';

  var blueprint = Blueprint.create({

    html: html,

    events: [
      Event.create('click', '[name = "id"]', PublishedEvent.create('open')),
      Event.create('click', '[name = "remove"]', PublishedEvent.create('remove')),
      Event.create('click', '[name = "save"]', PublishedEvent.create('save')),
      Event.create('click', '[name = "close"]', PublishedEvent.create('close')),
      Event.create('click', '[name = "reset"]', PublishedEvent.create('reset'))
    ],

    accessors: [
      Accessor.create('id', '[name = "id"]', TextAccess),
      Accessor.create('fields', '[name = "fields"]', ViewsAccess)
    ]

  });

  return View.clone({

    get blueprint() { return blueprint }

  }).augment({

    showBody: function (show) {
      var cl = this.element.classList;
      show ? cl.add('expanded') : cl.remove('expanded');
    },

    setValid: function (isValid) {
      var cl = this.element.classList;
      isValid ? cl.remove('invalid') : cl.add('invalid');
      this.element.querySelector('[name = "save"]').disabled = !isValid;
    },

    setDownloadLink: function (url) {
      var e = this._downloadLink;
      url ? e.setAttribute('href', url) : e.removeAttribute('href');
    },

    get _downloadLink() { return this.element.querySelector('[name = "download"]') }

  });

});
