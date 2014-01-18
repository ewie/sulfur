/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'app/editor/presenter/type/simple/atomic',
  'app/editor/types',
  'app/editor/view/type/complex/element',
  'sulfur/ui/presenter'
], function (
    SimpleAtomicTypePresenter,
    types,
    ComplexTypeElementView,
    Presenter
) {

  'use strict';

  function invoke(fn) {
    fn();
    return fn;
  }

  return Presenter.derive({

    initialize: function (model) {
      var view = ComplexTypeElementView.create();
      Presenter.prototype.initialize.call(this, view, model);
      this._registerModel();
    },

    _registerModel: function() {
      var model = this.model;
      var view = this.view;

      model.publisher.subscribe('update:name', invoke(function () {
        view.access('name').text = model.get('name');
      }));

      model.publisher.subscribe('update:type', invoke(function () {
        view.access('type-name').text = types.displayName(model.get('type').primitive);
        var p = SimpleAtomicTypePresenter.create(model.get('type'));
        view.access('type').view = p.view;
      }));
    }

  });

});
