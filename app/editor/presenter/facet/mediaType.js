/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'app/editor/presenter/value/mediaType',
  'app/editor/view/facet/mediaType',
  'sulfur/ui/presenter',
  'sulfur/util/objectMap'
], function (MediaTypeValuePresenter, MediaTypeFacetView, Presenter, ObjectMap) {

  'use strict';

  function invoke(fn) {
    fn();
    return fn;
  }

  return Presenter.derive({

    initialize: function (model) {
      var view = MediaTypeFacetView.create();
      Presenter.prototype.initialize.call(this, view, model);

      view.publisher.subscribe('add', function () {
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

      values.items.forEach(function (value) {
        var evp = MediaTypeValuePresenter.create(value);
        index.set(value, evp.view);
        view.access('values').append(evp.view);
      });

      values.publisher.subscribe('add', function (_, value) {
        var evp = MediaTypeValuePresenter.create(value);
        index.set(value, evp.view);
        view.access('values').append(evp.view);
      });

      values.publisher.subscribe('remove', function (_, value) {
        view.access('values').remove(index.get(value));
      });
    }

  });

});
