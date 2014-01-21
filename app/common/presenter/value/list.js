/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'app/common/presenter/value/enumerated',
  'app/common/view/value/list',
  'sulfur/ui/presenter',
  'sulfur/util/objectMap'
], function (EnumeratedValuePresenter, ListValueView, Presenter, ObjectMap) {

  'use strict';

  function invoke(fn) {
    fn();
    return fn;
  }

  return Presenter.clone({

    // inject the value presener
    withValuePresenter: function (valuePresenter) {
      return this.clone({ get valuePresenter() { return valuePresenter } });
    }

  }).augment({

    initialize: function (model) {
      var view = ListValueView.create();
      Presenter.prototype.initialize.call(this, view, model);

      view.publisher.subscribe('add', function () {
        model.get('values').add(model.itemValueModel.create());
      });

      this._registerModel();
    },

    _registerModel: function () {
      var view = this.view;
      var model = this.model;

      model.publisher.subscribe('update:values', invoke(function () {
        this._registerValuesCollection();
      }.bind(this)));

      model.publisher.subscribe('change:values', invoke(function () {
        var err = model.error('values');

        // XXX
        if (err === true) {
          err = "there are invalid values";
        }

        view.setError(err);
      }));
    },

    _registerValuesCollection: function () {
      var model = this.model;
      var view = this.view;
      var values = model.get('values');

      var index = ObjectMap.create();

      var vp = this.factory.valuePresenter;

      values.items.forEach(function (value) {
        var evp = EnumeratedValuePresenter.withValuePresenter(vp).create(value);
        index.set(value, evp.view);
        view.access('values').append(evp.view);
      });

      values.publisher.subscribe('add', function (_, value) {
        var evp = EnumeratedValuePresenter.withValuePresenter(vp).create(value);
        index.set(value, evp.view);
        view.access('values').append(evp.view);
      });

      values.publisher.subscribe('remove', function (_, value) {
        view.access('values').remove(index.get(value));
      });
    }

  });

});
