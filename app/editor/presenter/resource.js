/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'app/editor/presenter/schema',
  'app/editor/resourceExistenceTask',
  'app/editor/settings',
  'app/editor/view/resource',
  'sulfur/ui/presenter'
], function (
    SchemaPresenter,
    ResourceExistenceTask,
    settings,
    ResourceView,
    Presenter
) {

  'use strict';

  function invoke(fn) {
    fn();
    return fn;
  }

  function titleize(s) { return s.charAt(0).toUpperCase() + s.substr(1) }

  return Presenter.derive({

    initialize: function (model) {
      var view = ResourceView.create();
      Presenter.prototype.initialize.call(this, view, model);

      'record file'.split(' ').forEach(function (prefix) {
        var name = prefix + 'CollectionName';
        view.publisher.subscribe(name, function () {
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

      model.publisher.subscribe('update:schema', invoke(function () {
        var schema = model.get('schema');
        var p = SchemaPresenter.create(schema);
        view.access('schema').view = p.view;
      }));

      'record file'.split(' ').forEach(function (prefix) {
        var name = prefix + 'CollectionName';
        var dgsMth = prefix + 'CollectionUrl';
        var viewMth = 'set' + titleize(name) + 'Pending';

        var exists = ResourceExistenceTask.create(function (result) {
          view[viewMth](false);
          var err = {};
          if (result.error) {
            err[name] = "could not verify resource name";
          } else if (result.found) {
            err[name] = "the resource already exists";
          } else {
            err[name] = false;
          }
          model.updateExternalErrors(err);
        });

        model.publisher.subscribe('change:' + name, invoke(function () {
          var access = view.access(name);
          access.value = model.get(name);
          access.error = model.error(name);
          settings.publisher.subscribe('change', invoke(function () {
            if (model.error(name)) {
              return;
            }
            // Mock the resource, because we may not be able to construct it
            // from the model which may be invalid.
            var r = {};
            r[name] = model.get(name);
            var url = settings.url(settings.dataGridService[dgsMth](r));
            exists.check(url);
            view[viewMth](true);
          }));
        }));
      });
    }

  });

});
