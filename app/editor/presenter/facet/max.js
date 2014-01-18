/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'app/common/presenter/value/date',
  'app/common/presenter/value/dateTime',
  'app/common/presenter/value/decimal',
  'app/common/presenter/value/double',
  'app/common/presenter/value/float',
  'app/common/presenter/value/integer',
  'app/editor/view/facet/max',
  'sulfur/schema/value/simple/date',
  'sulfur/schema/value/simple/dateTime',
  'sulfur/schema/value/simple/decimal',
  'sulfur/schema/value/simple/double',
  'sulfur/schema/value/simple/float',
  'sulfur/schema/value/simple/integer',
  'sulfur/ui/presenter'
], function (
    DateValuePresenter,
    DateTimeValuePresenter,
    DecimalValuePresenter,
    DoubleValuePresenter,
    FloatValuePresenter,
    IntegerValuePresenter,
    MaxFacetView,
    DateValue,
    DateTimeValue,
    DecimalValue,
    DoubleValue,
    FloatValue,
    IntegerValue,
    Presenter
) {

  'use strict';

  function invoke(fn) {
    fn();
    return fn;
  }

  function getValuePresenter(valueType) {
    switch (valueType) {
    case DateValue:
      return DateValuePresenter;
    case DateTimeValue:
      return DateTimeValuePresenter;
    case DecimalValue:
      return DecimalValuePresenter;
    case DoubleValue:
      return DoubleValuePresenter;
    case FloatValue:
      return FloatValuePresenter;
    case IntegerValue:
      return IntegerValuePresenter;
    default:
      throw new Error("unexpected value type for maximum facet");
    }
  }

  return Presenter.derive({

    initialize: function (model) {
      var view = MaxFacetView.create();
      Presenter.prototype.initialize.call(this, view, model);

      view.publisher.subscribe('exclusive', function () {
        model.update({ exclusive: view.access('exclusive').value });
      });

      this._registerModel();
    },

    _registerModel: function () {
      var model = this.model;
      var view = this.view;
      var vp = getValuePresenter(model.valueModel.valueType);
      model.publisher.subscribe('update:value', invoke(function () {
        var p = vp.create(model.get('value'));
        view.access('value').view = p.view;
      }));
      model.publisher.subscribe('update:exclusive', invoke(function () {
        view.access('exclusive').value = model.get('exclusive');
      }));
    }

  });

});
