/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'app/common/model/value/boolean',
  'app/common/model/value/date',
  'app/common/model/value/dateTime',
  'app/common/model/value/decimal',
  'app/common/model/value/double',
  'app/common/model/value/float',
  'app/common/model/value/integer',
  'app/common/model/value/string',
  'app/common/model/value/uri',
  'app/common/presenter/value/boolean',
  'app/common/presenter/value/date',
  'app/common/presenter/value/dateTime',
  'app/common/presenter/value/decimal',
  'app/common/presenter/value/double',
  'app/common/presenter/value/float',
  'app/common/presenter/value/integer',
  'app/common/presenter/value/list',
  'app/common/presenter/value/string',
  'app/common/presenter/value/uri',
  'app/editor/model/facet/enumeration',
  'app/editor/model/facet/maxLength',
  'app/editor/model/facet/minLength',
  'app/editor/model/facet/pattern',
  'app/editor/presenter/facet/enumeration',
  'app/editor/presenter/facet/maxLength',
  'app/editor/presenter/facet/minLength',
  'app/editor/presenter/facet/pattern',
  'app/editor/presenter/type/simple/atomic',
  'app/editor/view/type/simple/list',
  'sulfur/ui/presenter'
], function (
    BooleanValueModel,
    DateValueModel,
    DateTimeValueModel,
    DecimalValueModel,
    DoubleValueModel,
    FloatValueModel,
    IntegerValueModel,
    StringValueModel,
    UriValueModel,
    BooleanValuePresenter,
    DateValuePresenter,
    DateTimeValuePresenter,
    DecimalValuePresenter,
    DoubleValuePresenter,
    FloatValuePresenter,
    IntegerValuePresenter,
    ListValuePresenter,
    StringValuePresenter,
    UriValuePresenter,
    EnumerationFacetModel,
    MaxLengthFacetModel,
    MinLengthFacetModel,
    PatternFacetModel,
    EnumerationFacetPresenter,
    MaxLengthFacetPresenter,
    MinLengthFacetPresenter,
    PatternFacetPresenter,
    SimpleAtomicTypePresenter,
    SimpleListTypeView,
    Presenter
) {

  'use strict';

  function invoke(fn) {
    fn();
    return fn;
  }

  function getValuePresenter(valueModel) {
    switch (valueModel) {
    case BooleanValueModel:
      return BooleanValuePresenter;
    case DateValueModel:
      return DateValuePresenter;
    case DateTimeValueModel:
      return DateTimeValuePresenter;
    case DecimalValueModel:
      return DecimalValuePresenter;
    case DoubleValueModel:
      return DoubleValuePresenter;
    case FloatValueModel:
      return FloatValuePresenter;
    case IntegerValueModel:
      return IntegerValuePresenter;
    case StringValueModel:
      return StringValuePresenter;
    case UriValueModel:
      return UriValuePresenter;
    default:
      throw new Error("unexpected facet value model");
    }
  }

  function getFacetPresenter(facetModel) {
    switch (true) {
    case EnumerationFacetModel.prototype.isPrototypeOf(facetModel):
      return EnumerationFacetPresenter.withValuePresenter(
        ListValuePresenter.withValuePresenter(
          getValuePresenter(facetModel.valueModel.itemValueModel)));
    case MaxLengthFacetModel.prototype.isPrototypeOf(facetModel):
      return MaxLengthFacetPresenter;
    case MinLengthFacetModel.prototype.isPrototypeOf(facetModel):
      return MinLengthFacetPresenter;
    case PatternFacetModel.prototype.isPrototypeOf(facetModel):
      return PatternFacetPresenter;
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
