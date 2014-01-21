/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/ui/view',
  'sulfur/ui/view/blueprint',
  'sulfur/ui/view/event',
  'sulfur/ui/view/event/published',
  'text!app/editor/html/create.html'
], function (View, Blueprint, Event, PublishedEvent, html) {

  'use strict';

  var blueprint = Blueprint.create({

    html: html,

    events: [
      Event.create('click', '[name = "create"]', PublishedEvent.create('create'))
    ]

  });

  return View.clone({

    get blueprint() { return blueprint }

  }).augment({

    setPending: function (isPending) {
      var cl = this.element.classList;
      isPending ? cl.add('pending') : cl.remove('pending');
    },

    enableDownload: function (url, filename) {
      var a = this._downloadButton;
      a.setAttribute('href', url);
      a.setAttribute('download', filename);
      a.textContent = filename;
      this.element.classList.add('complete');
    },

    triggerDownload: function () {
      this._downloadButton.click();
    },

    enable: function (enabled) {
      var cl = this.element.classList;
      enabled ? cl.add('enabled') : cl.remove('enabled');
    },

    get _downloadButton() { return this.element.querySelector('[name = "download"]') }

  });

});
