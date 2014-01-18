/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'app/common/view/value/enumerated',
  'sulfur/ui/presenter'
], function (EnumeratedValueView, Presenter) {

  'use strict';

  return Presenter.clone({

    // inject the value presener
    withValuePresenter: function (valuePresenter) {
      return this.clone({ get valuePresenter() { return valuePresenter } });
    }

  }).augment({

    initialize: function (model) {
      var view = EnumeratedValueView.create();
      Presenter.prototype.initialize.call(this, view, model);

      view.publisher.subscribe('remove', function () { model.destroy() });

      this._registerModel();
    },

    _registerModel: function () {
      var vp = this.factory.valuePresenter.create(this.model);
      this.view.access('value').view = vp.view;
    }

  });

});
