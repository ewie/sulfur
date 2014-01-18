/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'app/editor/view/facet/whiteSpace',
  'sulfur/ui/presenter'
], function (WhiteSpaceFacetView, Presenter) {

  'use strict';

  function invoke(fn) {
    fn();
    return fn;
  }

  return Presenter.derive({

    initialize: function (model) {
      var view = WhiteSpaceFacetView.create();
      Presenter.prototype.initialize.call(this, view, model);

      // XXX
      view.access('value').values = ['n/a', 'collapse', 'preserve', 'replace'];

      view.publisher.subscribe('value', function () {
        var value = view.access('value').value;
        (value === 'n/a') && (value = null);
        model.update({ value: value });
      });

      this._registerModel();
    },

    _registerModel: function () {
      var model = this.model;
      var view = this.view;
      model.publisher.subscribe('update:value', invoke(function () {
        view.access('value').value = model.get('value') || 'n/a';
      }));
    }

  });

});
