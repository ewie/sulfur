/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'app/editor/view/value/pattern',
  'sulfur/ui/presenter'
], function (PatternValueView, Presenter) {

  'use strict';

  function invoke(fn) {
    fn();
    return fn;
  }

  return Presenter.derive({

    initialize: function (model) {
      var view = PatternValueView.create();
      Presenter.prototype.initialize.call(this, view, model);

      view.publisher.subscribe('change', function () {
        model.update({ value: view.access('value').value });
      });

      view.publisher.subscribe('remove', function () {
        model.destroy();
      });

      this._registerModel();
    },

    _registerModel: function () {
      var view = this.view;
      var model = this.model;
      model.publisher.subscribe('change:value', invoke(function () {
        view.access('value').value = model.get('value');
        view.access('value').error = model.error('value');
      }));
    }

  });

});
