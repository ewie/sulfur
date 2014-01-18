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
      var cl = this.element.querySelector('[name = "create"]').classList;
      isPending ? cl.add('pending') : cl.remove('pending');
    },

    enableDownload: function (url, filename) {
      var a = this._downloadButton;
      var b = this._createButton;
      a.style.display = '';
      a.setAttribute('href', url);
      a.setAttribute('download', filename);
      a.textContent = filename;
      b.style.display = 'none';
    },

    triggerDownload: function () {
      this._downloadButton.click();
    },

    setValid: function (isValid) {
      this.element.style.display = isValid ? 'block' : 'none';
    },

    get _createButton() { return this.element.querySelector('[name = "create"]') },

    get _downloadButton() { return this.element.querySelector('[name = "download"]') }

  });

});
