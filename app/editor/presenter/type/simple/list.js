/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'app/editor/model/facet/enumeration',
  'app/editor/model/facet/maxLength',
  'app/editor/model/facet/minLength',
  'app/editor/presenter/facet/enumeration',
  'app/editor/presenter/facet/maxLength',
  'app/editor/presenter/facet/minLength',
  'app/editor/presenter/type/simple/atomic',
  'app/editor/view/type/simple/list',
  'sulfur/ui/presenter'
], function (
    EnumerationFacetModel,
    MaxLengthFacetModel,
    MinLengthFacetModel,
    EnumerationFacetPresenter,
    MaxLengthFacetPresenter,
    MinLengthFacetPresenter,
    SimpleAtomicTypePresenter,
    SimpleListTypeView,
    Presenter
) {

  'use strict';

  function invoke(fn) {
    fn();
    return fn;
  }

  function getFacetPresenter(facet) {
    switch (true) {
    case EnumerationFacetModel.prototype.isPrototypeOf(facet):
      return EnumerationFacetPresenter;
    case MaxLengthFacetModel.prototype.isPrototypeOf(facet):
      return MaxLengthFacetPresenter;
    case MinLengthFacetModel.prototype.isPrototypeOf(facet):
      return MinLengthFacetPresenter;
    }
  }

  return Presenter.derive({

    initialize: function (model) {
      var view = SimpleListTypeView.create();
      Presenter.prototype.initialize.call(this, view, model);
      this._registerModel();
    },

    _registerModel: function () {
      var view = this.view;
      var model = this.model;
      model.publisher.subscribe('update:itemType', invoke(function () {
        var itemType = model.get('itemType');
        if (itemType) {
          var p = SimpleAtomicTypePresenter.create(itemType);
          view.access('itemType').view = p.view;
        }
      }));

      model.publisher.subscribe('update:facets', invoke(function () {
        view.access('facets').clear();
        model.get('facets').items.forEach(function (facetModel) {
          var fp = getFacetPresenter(facetModel);
          if (fp) {
            fp = fp.create(facetModel);
            view.access('facets').append(fp.view);
          }
        });
      }));
    }

  });

});
