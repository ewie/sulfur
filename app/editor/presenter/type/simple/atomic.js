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
  'app/common/presenter/value/string',
  'app/common/presenter/value/uri',
  'app/editor/model/facet/enumeration',
  'app/editor/model/facet/fractionDigits',
  'app/editor/model/facet/max',
  'app/editor/model/facet/maxLength',
  'app/editor/model/facet/mediaType',
  'app/editor/model/facet/min',
  'app/editor/model/facet/minLength',
  'app/editor/model/facet/pattern',
  'app/editor/model/facet/totalDigits',
  'app/editor/model/facet/whiteSpace',
  'app/editor/presenter/facet/enumeration',
  'app/editor/presenter/facet/fractionDigits',
  'app/editor/presenter/facet/max',
  'app/editor/presenter/facet/maxLength',
  'app/editor/presenter/facet/mediaType',
  'app/editor/presenter/facet/min',
  'app/editor/presenter/facet/minLength',
  'app/editor/presenter/facet/pattern',
  'app/editor/presenter/facet/totalDigits',
  'app/editor/presenter/facet/whiteSpace',
  'app/editor/types',
  'app/editor/view/type/simple/atomic',
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
    StringValuePresenter,
    UriValuePresenter,
    EnumerationFacetModel,
    FractionDigitsFacetModel,
    MaxFacetModel,
    MaxLengthFacetModel,
    MediaTypeFacetModel,
    MinFacetModel,
    MinLengthFacetModel,
    PatternFacetModel,
    TotalDigitsFacetModel,
    WhiteSpaceFacetModel,
    EnumerationFacetPresenter,
    FractionDigitsFacetPresenter,
    MaxFacetPresenter,
    MaxLengthFacetPresenter,
    MediaTypeFacetPresenter,
    MinFacetPresenter,
    MinLengthFacetPresenter,
    PatternFacetPresenter,
    TotalDigitsFacetPresenter,
    WhiteSpaceFacetPresenter,
    types,
    SimpleAtomicTypeView,
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
        getValuePresenter(facetModel.valueModel));
    case FractionDigitsFacetModel.prototype.isPrototypeOf(facetModel):
      return FractionDigitsFacetPresenter;
    case MaxFacetModel.prototype.isPrototypeOf(facetModel):
      return MaxFacetPresenter;
    case MaxLengthFacetModel.prototype.isPrototypeOf(facetModel):
      return MaxLengthFacetPresenter;
    case MediaTypeFacetModel.prototype.isPrototypeOf(facetModel):
      return MediaTypeFacetPresenter;
    case MinFacetModel.prototype.isPrototypeOf(facetModel):
      return MinFacetPresenter;
    case MinLengthFacetModel.prototype.isPrototypeOf(facetModel):
      return MinLengthFacetPresenter;
    case PatternFacetModel.prototype.isPrototypeOf(facetModel):
      return PatternFacetPresenter;
    case TotalDigitsFacetModel.prototype.isPrototypeOf(facetModel):
      return TotalDigitsFacetPresenter;
    case WhiteSpaceFacetModel.prototype.isPrototypeOf(facetModel):
      return WhiteSpaceFacetPresenter;
    default:
      throw new Error("unexpected facet model");
    }
  }

  return Presenter.clone({

    getValuePresenter: getValuePresenter

  }).augment({

    initialize: function (model) {
      var view = SimpleAtomicTypeView.create();
      Presenter.prototype.initialize.call(this, view, model);
      this._registerModel();
    },

    _registerModel: function () {
      var view = this.view;
      var model = this.model;
      model.publisher.subscribe('update:base', invoke(function () {
        view.access('name').text = types.displayName(model.primitive);
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
