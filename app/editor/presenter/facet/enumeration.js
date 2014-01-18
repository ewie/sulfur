/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'app/common/presenter/value/enumerated',
  'app/editor/view/facet/enumeration',
  'sulfur/ui/presenter',
  'sulfur/util/objectMap'
], function (EnumeratedValuePresenter, EnumerationFacetView, Presenter, ObjectMap) {

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
      var view = EnumerationFacetView.create();
      Presenter.prototype.initialize.call(this, view, model);

      view.publisher.subscribe('add', function () {
        console.log('--', model.valueModel);
        model.get('values').add(model.valueModel.create());
      });

      this._registerModel();
    },

    _registerModel: function () {
      this.model.publisher.subscribe('update:values', invoke(function () {
        this._registerValuesCollection();
      }.bind(this)));
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
