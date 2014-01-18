/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'app/editor/model/widget',
  'app/editor/presenter/widget',
  'app/editor/settings',
  'app/editor/view/app',
  'sulfur/resource',
  'sulfur/ui/presenter'
], function (
    WidgetModel,
    WidgetPresenter,
    settings,
    AppView,
    Resource,
    Presenter
) {

  'use strict';

  function invoke(fn) {
    fn();
    return fn;
  }

  return Presenter.derive({

    initialize: function (model) {
      var view = AppView.create();
      Presenter.prototype.initialize.call(this, view, model);

      view.publisher.subscribe('new', function () {
        var wm = WidgetModel.create();
        var rp = WidgetPresenter.create(wm);
        view.access('widget').view = rp.view;
      });

      view.publisher.subscribe('settings', function () {
        view.toggleSettings();
      });

      view.publisher.subscribe('endpoint', function () {
        model.update({ endpoint: view.access('endpoint').value });
      });

      view.publisher.subscribe('proxy', function () {
        model.update({ proxy: view.access('proxy').value });
      });

      this._registerModel();
    },

    _registerModel: function () {
      var model = this.model;
      var view = this.view;

      model.publisher.subscribe('change:endpoint', invoke(function () {
        var access = view.access('endpoint');
        var value = model.get('endpoint');
        var error = model.error('endpoint');
        access.value = value;
        access.error = error;
        error || (settings.endpoint = value);
      }));

      model.publisher.subscribe('change:proxy', invoke(function () {
        var access = view.access('proxy');
        var value = model.get('proxy');
        var error = model.error('proxy');
        access.value = value;
        access.error = error;
        error || (settings.proxy = value);
      }));
    }

  });

});
