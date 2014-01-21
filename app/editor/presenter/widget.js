/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'app/editor/presenter/create',
  'app/editor/presenter/resource',
  'app/editor/serializer',
  'app/editor/view/widget',
  'sulfur/ui/presenter'
], function (CreatePresenter, ResourcePresenter, Serializer, WidgetView, Presenter) {

  'use strict';

  function invoke(fn) {
    fn();
    return fn;
  }

  var serializer = Serializer.create();

  return Presenter.derive({

    initialize: function (model) {
      var view = WidgetView.create();
      Presenter.prototype.initialize.call(this, view, model);

      var p = CreatePresenter.create(model);
      view.access('create').view = p.view;

      'name description authorName authorEmail'.split(' ').forEach(function (name) {
        var channel = name.replace(/([a-z])([A-Z])/g, function (_, a, b) {
          return a + '-' + b.toLowerCase();
        });
        view.publisher.subscribe(channel, function () {
          var attrs = {};
          attrs[name] = view.access(name).value;
          model.update(attrs);
        });
      });

      this._registerModel();
    },

    _registerModel: function () {
      var model = this.model;
      var view = this.view;

      model.publisher.subscribe('update:resource', invoke(function () {
        var resource = model.get('resource');
        var p = ResourcePresenter.create(resource);
        view.access('resource').view = p.view;

        resource.publisher.subscribe('change:schema', invoke(function () {
          var schema = resource.get('schema');
          if (schema.object) {
            view.access('xml').html = serializer.serializeToMarkup(schema.object);
          } else {
            view.access('xml').html = '';
          }
        }));
      }.bind(this)));

      'name description authorName authorEmail'.split(' ').forEach(function (name) {
        model.publisher.subscribe('update:' + name, invoke(function () {
          var access = view.access(name);
          access.value = model.get(name);
          access.error = model.error(name);
        }));
      });
    }

  });

});
