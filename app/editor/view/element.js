/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/ui/view',
  'sulfur/ui/view/access/checkbox',
  'sulfur/ui/view/access/dropdown',
  'sulfur/ui/view/access/value',
  'sulfur/ui/view/access/view',
  'sulfur/ui/view/accessor',
  'sulfur/ui/view/blueprint',
  'sulfur/ui/view/event',
  'sulfur/ui/view/event/published',
  'text!app/editor/html/element.html'
], function (
    View,
    CheckboxAccess,
    DropdownAccess,
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
      Event.create('change', '[name = "name"]', PublishedEvent.create('name')),
      Event.create('change', '[name = "optional"]', PublishedEvent.create('optional')),
      Event.create('click', '[name = "up"]', PublishedEvent.create('up')),
      Event.create('click', '[name = "down"]', PublishedEvent.create('down'))
    ],

    accessors: [
      Accessor.create('name', '[name = "name"]', ValueAccess),
      Accessor.create('optional', '[name = "optional"]', CheckboxAccess),
      Accessor.create('baseType', '[name = "base-type"]', DropdownAccess),
      Accessor.create('itemType', '[name = "item-type"]', DropdownAccess),
      Accessor.create('defaultValue', '[name = "default"] > .input', ViewAccess),
      Accessor.create('type', '[name = "type"]', ViewAccess)
    ]

  });

  return View.clone({

    get blueprint() { return blueprint }

  }).augment({

    initialize: function () {
      View.prototype.initialize.call(this);

      this.access('baseType').publisher.subscribe('select', function () {
        this.publisher.publish('base-type');
      }.bind(this));

      var itemType = this.access('itemType');
      var itemTypeWrap = this.element.querySelector('.item-type-wrap');

      itemType.publisher.subscribe('values', function () {
        itemTypeWrap.style.display = '';
      });

      itemType.publisher.subscribe('select', function () {
        if (typeof itemType.value === 'undefined') {
          itemTypeWrap.style.display = 'none';
        }
        this.publisher.publish('item-type');
      }.bind(this));
    },

    showDefault: function () {
      this.element.querySelector('[name = "default"]').style.display = '';
    },

    hideDefault: function () {
      this.element.querySelector('[name = "default"]').style.display = 'none';
    },

    get defaultValueLabelRef() {
      this.element.querySelector('[name = "default"] > label').getAttribute('for');
    },

    set defaultValueLabelRef(id) {
      this.element.querySelector('[name = "default"] > label').setAttribute('for', id);
    }

  });

});
