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
  'text!app/editor/html/resource.html'
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
      Event.create('change', '[name = "rname"]', PublishedEvent.create('recordCollectionName')),
      Event.create('change', '[name = "fname"]', PublishedEvent.create('fileCollectionName'))
    ],

    accessors: [
      Accessor.create('recordCollectionName', '[name = "rname"]', ValueAccess),
      Accessor.create('fileCollectionName', '[name = "fname"]', ValueAccess),
      Accessor.create('schema', '[name = "schema"]', ViewAccess)
    ]

  });

  return View.clone({

    get blueprint() { return blueprint }

  }).augment({

    setRecordCollectionNamePending: function (isPending) {
      var cl = this.element.querySelector('[name = "rname"]').classList;
      isPending ? cl.add('pending') : cl.remove('pending');
    },

    setFileCollectionNamePending: function (isPending) {
      var cl = this.element.querySelector('[name = "fname"]').classList;
      isPending ? cl.add('pending') : cl.remove('pending');
    }

  });

});
