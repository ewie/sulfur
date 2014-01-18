/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/ui/view',
  'sulfur/ui/view/access/dropdown',
  'sulfur/ui/view/accessor',
  'sulfur/ui/view/blueprint',
  'text!app/editor/html/facet/whiteSpace.html'
], function (View, DropdownAccess, Accessor, Blueprint, html) {

  'use strict';

  var blueprint = Blueprint.create({

    html: html,

    accessors: [
      Accessor.create('value', '[name = "value"]', DropdownAccess)
    ]

  });

  return View.clone({

    get blueprint() { return blueprint }

  }).augment({

    initialize: function () {
      View.prototype.initialize.call(this);

      this.access('value').publisher.subscribe('select', function () {
        this.publisher.publish('value');
      }.bind(this));
    }

  });

});
