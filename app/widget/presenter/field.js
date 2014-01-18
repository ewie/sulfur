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
  'app/common/model/value/list',
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
  'app/widget/model/value/file',
  'app/widget/model/value/geolocation',
  'app/widget/model/value/sequence',
  'app/widget/presenter/value/file',
  'app/widget/presenter/value/geolocation',
  'app/widget/view/field',
  'sulfur/ui/presenter'
], function (
    BooleanValueModel,
    DateValueModel,
    DateTimeValueModel,
    DecimalValueModel,
    DoubleValueModel,
    FloatValueModel,
    IntegerValueModel,
    ListValueModel,
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
    FileValueModel,
    GeolocationValueModel,
    SequenceValueModel,
    FileValuePresenter,
    GeolocationValuePresenter,
    FieldView,
    Presenter
) {

  'use strict';

  function isFactoryOf(f, x) { return f.prototype.isPrototypeOf(x) }

  function getItemValuePresenter(valueModel) {
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
    case FileValueModel:
      return FileValuePresenter;
    case FloatValueModel:
      return FloatValuePresenter;
    case GeolocationValueModel:
      return GeolocationValuePresenter;
    case IntegerValueModel:
      return IntegerValuePresenter;
    case StringValueModel:
      return StringValuePresenter;
    case UriValueModel:
      return UriValuePresenter;
    default:
      throw new Error("unexpected item value model");
    }
  }

  function getValuePresenter(valueModel) {
    switch (true) {
    case isFactoryOf(BooleanValueModel, valueModel):
      return BooleanValuePresenter;
    case isFactoryOf(DateValueModel, valueModel):
      return DateValuePresenter;
    case isFactoryOf(DateTimeValueModel, valueModel):
      return DateTimeValuePresenter;
    case isFactoryOf(DecimalValueModel, valueModel):
      return DecimalValuePresenter;
    case isFactoryOf(DoubleValueModel, valueModel):
      return DoubleValuePresenter;
    case isFactoryOf(FileValueModel, valueModel):
      return FileValuePresenter;
    case isFactoryOf(FloatValueModel, valueModel):
      return FloatValuePresenter;
    case isFactoryOf(GeolocationValueModel, valueModel):
      return GeolocationValuePresenter;
    case isFactoryOf(IntegerValueModel, valueModel):
      return IntegerValuePresenter;
    case isFactoryOf(SequenceValueModel, valueModel):
      // use the same presenter for a single geolocation value as well as a
      // sequence of geolocation values
      if (valueModel.itemValueModel === GeolocationValueModel) {
        return GeolocationValuePresenter;
      }
      // use the list value presenter
      return ListValuePresenter.withValuePresenter(
        getItemValuePresenter(valueModel.itemValueModel));
    case isFactoryOf(ListValueModel, valueModel):
      return ListValuePresenter.withValuePresenter(
        getItemValuePresenter(valueModel.itemValueModel));
    case isFactoryOf(StringValueModel, valueModel):
      return StringValuePresenter;
    case isFactoryOf(UriValueModel, valueModel):
      return UriValuePresenter;
    default:
      throw new Error("unexpected value model");
    }
  }

  function createValuePresenter(valueModel) {
    return getValuePresenter(valueModel).create(valueModel);
  }

  function invoke(fn) {
    fn();
    return fn;
  }

  return Presenter.derive({

    initialize: function (model) {
      var view = FieldView.create();
      Presenter.prototype.initialize.call(this, view, model);

      // a field name does not change
      view.access('name').text = model.get('name');

      view.setRequired(model.get('required'));

      var p = createValuePresenter(model.get('value'));
      view.access('value').view = p.view;

      model.publisher.subscribe('change', invoke(function () {
        view.setError(model.error('value'));
      }));
    }

  });

});
