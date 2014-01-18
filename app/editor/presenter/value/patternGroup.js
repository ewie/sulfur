/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'app/editor/model/value/pattern',
  'app/editor/presenter/value/pattern',
  'app/editor/view/value/patternGroup',
  'sulfur/ui/presenter',
  'sulfur/util/objectMap'
], function (PatternValueModel, PatternValuePresenter, PatternGroupValueView, Presenter, ObjectMap) {

  'use strict';

  return Presenter.derive({

    initialize: function (model) {
      var view = PatternGroupValueView.create();
      Presenter.prototype.initialize.call(this, view, model);

      view.publisher.subscribe('add', function () {
        model.add(PatternValueModel.create());
      });

      view.publisher.subscribe('remove', function () {
        model.destroy();
      });

      this._registerModel();
    },

    _registerModel: function () {
      var model = this.model;
      var view = this.view;

      var index = ObjectMap.create();

      model.items.forEach(function (value) {
        var vp = PatternValuePresenter.create(value);
        index.set(value, vp.view);
        view.access('values').append(vp.view);
      });

      model.publisher.subscribe('add', function (_, value) {
        var vp = PatternValuePresenter.create(value);
        index.set(value, vp.view);
        view.access('values').append(vp.view);
      });

      model.publisher.subscribe('remove', function (_, value) {
        view.access('values').remove(index.get(value));
      });
    }

  });

});
