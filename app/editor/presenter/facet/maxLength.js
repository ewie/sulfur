/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'app/common/presenter/value/integer',
  'app/editor/view/facet/maxLength',
  'sulfur/ui/presenter'
], function (IntegerValuePresenter, MaxLengthFacetView, Presenter) {

  'use strict';

  function invoke(fn) {
    fn();
    return fn;
  }

  return Presenter.derive({

    initialize: function (model) {
      var view = MaxLengthFacetView.create();
      Presenter.prototype.initialize.call(this, view, model);
      this._registerModel();
    },

    _registerModel: function () {
      var model = this.model;
      var view = this.view;
      model.publisher.subscribe('update:value', invoke(function () {
        var ivp = IntegerValuePresenter.create(model.get('value'));
        view.access('value').view = ivp.view;
      }));
    }

  });

});
