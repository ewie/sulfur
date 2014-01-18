/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'text!app/common/html/value/list.html',
  'sulfur/ui/view',
  'sulfur/ui/view/access/views',
  'sulfur/ui/view/accessor',
  'sulfur/ui/view/blueprint',
  'sulfur/ui/view/event',
  'sulfur/ui/view/event/published'
], function (html, View, ViewsAccess, Accessor, Blueprint, Event, PublishedEvent) {

  'use strict';

  var blueprint = Blueprint.create({

    html: html,

    events: [
      Event.create('click', '[name = "add"]', PublishedEvent.create('add'))
    ],

    accessors: [
      Accessor.create('values', '[name = "values"]', ViewsAccess)
    ]

  });

  return View.clone({

    get blueprint() { return blueprint }

  }).augment({

    setError: function (error) {
      var e = this.element.querySelector('[name = "error"]');
      var cl = this.element.classList;
      if (error) {
        cl.add('error');
        e.setAttribute('data-error-message', error);
      } else {
        cl.remove('error');
        e.removeAttribute('data-error-message');
      }
    }

  });

});
