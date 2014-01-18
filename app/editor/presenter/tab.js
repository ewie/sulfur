/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'app/editor/view/tab',
  'sulfur/ui/presenter'
], function (TabView, Presenter) {

  'use strict';

  function invoke(fn) {
    fn();
    return fn;
  }

  return Presenter.derive({

    initialize: function (model) {
      Presenter.prototype.initialize.call(this, TabView.create(), model);
      this._registerModel();
    },

    _registerModel: function () {
      var model = this.model;
      var view = this.view;

      view.publisher.subscribe('select', function () {
        model.publisher.publish('select');
      });

      view.publisher.subscribe('remove', function () {
        model.publisher.publish('remove');
      });

      model.publisher.subscribe('change', invoke(function () {
        view.access('name').text = model.get('name');
        view.error = !model.isValid();
      }));
    },

    select: function () {
      this._view.select();
    },

    unselect: function () {
      this._view.unselect();
    }

  });

});
