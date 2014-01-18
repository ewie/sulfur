/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'app/editor/model/resource',
  'sulfur/widget',
  'sulfur/ui/model'
], function (ResourceModel, Widget, Model) {

  'use strict';

  return Model.clone({

    attributes: {
      name: { default: '' },
      description: { default: '' },
      authorName: { default: '' },
      authorEmail: { default: '' },
      resource: { default: function () { return ResourceModel.create() } }
    },

    _extract: function (widget) {
      return {
        name: widget.name,
        description: widget.description || '',
        authorName: widget.authorName || '',
        authorEmail: widget.authorEmail || '',
        resource: ResourceModel.createFromObject(widget.resource)
      };
    }

  }).augment({

    _validate: function (errors) {
      Model.prototype._validate.call(this, errors);
      this.get('name') || (errors.name = "must not be empty");
    },

    _construct: function () {
      var name = this.get('name');
      var resource = this.get('resource');
      if (name && resource) {
        return Widget.create(name, resource.object, {
          description: this.get('description'),
          authorName: this.get('authorName'),
          authorEmail: this.get('authorEmail')
        });
      }
    }

  });

});
