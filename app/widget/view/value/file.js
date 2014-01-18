/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'text!app/widget/html/value/file.html',
  'sulfur/ui/view',
  'app/widget/access/file',
  'sulfur/ui/view/accessor',
  'sulfur/ui/view/blueprint',
  'sulfur/ui/view/event',
  'sulfur/ui/view/event/published'
], function (html, View, FileAccess, Accessor, Blueprint, Event, PublishedEvent) {

  'use strict';

  var blueprint = Blueprint.create({

    html: html,

    events: [
      Event.create('change', '[name = "file"]', PublishedEvent.create('change'))
    ],

    accessors: [
      Accessor.create('file', '[name = "file"]', FileAccess)
    ]

  });

  return View.clone({

    get blueprint() { return blueprint }

  }).augment({

    showDownloadLink: function (url) {
      this._link.setAttribute('href', url);
    },

    hideDownloadLink: function () {
      this._link.removeAttribute('href');
    },

    get _link() { return this.element.querySelector('[name = "download"]') }

  });

});
