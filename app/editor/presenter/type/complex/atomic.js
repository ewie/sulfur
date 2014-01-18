/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'app/editor/presenter/type/complex/element',
  'app/editor/types',
  'app/editor/view/type/complex/atomic',
  'sulfur/ui/presenter'
], function (ComplexTypeElementPresenter, types, ComplexAtomicTypeView, Presenter) {

  'use strict';

  function invoke(fn) {
    fn();
    return fn;
  }

  return Presenter.derive({

    initialize: function (model) {
      var view = ComplexAtomicTypeView.create();
      Presenter.prototype.initialize.call(this, view, model);
      this._registerModel();
    },

    _registerModel: function () {
      var view = this.view;
      var model = this.model;
      model.publisher.subscribe('update:primitive', invoke(function () {
        view.access('name').text = types.displayName(model.get('primitive'));
      }));
      model.publisher.subscribe('update:elements', invoke(function () {
        model.get('elements').items.forEach(function (e) {
          var p = ComplexTypeElementPresenter.create(e);
          view.access('elements').append(p.view);
        });
      }));
    }

  });

});
