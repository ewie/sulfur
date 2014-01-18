/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'text!app/widget/html/field.html',
  'sulfur/ui/view',
  'sulfur/ui/view/access/text',
  'sulfur/ui/view/access/view',
  'sulfur/ui/view/accessor',
  'sulfur/ui/view/blueprint',
  'sulfur/ui/view/event',
  'sulfur/ui/view/event/dispatched'
], function (
    html,
    View,
    TextAccess,
    ViewAccess,
    Accessor,
    Blueprint,
    Event,
    DispatchedEvent
) {

  'use strict';

  var blueprint = Blueprint.create({

    html: html,

    events: [
      Event.create('click', '[name = "expand"]', DispatchedEvent.create('_toggleExpand')),
      Event.create('click', 'label', DispatchedEvent.create('_toggleExpand'))
    ],

    accessors: [
      Accessor.create('name', '[name = "name"]', TextAccess),
      Accessor.create('value', '[name = "value"]', ViewAccess)
    ]

  });

  return View.clone({

    get blueprint() { return blueprint }

  }).augment({

    setRequired: function (isRequired) {
      var cl = this.element.classList;
      isRequired ? cl.add('required') : cl.remove('required');
    },

    setError: function (error) {
      var cl = this.element.classList;
      error ? cl.add('error') : cl.remove('error');
      if (error && error.length) {
        this.element.querySelector('.field-head').setAttribute('data-error-message', error);
      }
    },

    _toggleExpand: function () {
      this.element.classList.toggle('expanded');
    }

  });

});
