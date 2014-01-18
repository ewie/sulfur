/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'app/common/presenter/value/integer',
  'app/editor/presenter/type/complex/atomic',
  'app/editor/presenter/type/simple/atomic',
  'app/editor/view/type/complex/list',
  'sulfur/schema/types',
  'sulfur/ui/presenter'
], function (IntegerValuePresenter, ComplexAtomicTypePresenter, SimpleAtomicTypePresenter, ComplexListTypeView, schemaTypes, Presenter) {

  'use strict';

  function invoke(fn) {
    fn();
    return fn;
  }

  function getItemTypePresenter(itemType) {
    if (schemaTypes.isSimpleType(itemType)) {
      return SimpleAtomicTypePresenter;
    }
    if (schemaTypes.isComplexType(itemType)) {
      return ComplexAtomicTypePresenter;
    }
  }

  function createItemTypePresenter(itemType) {
    return getItemTypePresenter(itemType.primitive).create(itemType);
  }

  return Presenter.derive({

    initialize: function (model) {
      var view = ComplexListTypeView.create();
      Presenter.prototype.initialize.call(this, view, model);

      view.publisher.subscribe('item-name', function () {
        model.update({ itemName: view.access('itemName').value });
      });

      this._registerModel();
    },

    _registerModel: function () {
      var view = this.view;
      var model = this.model;

      model.publisher.subscribe('change:itemName', invoke(function () {
        var itemName = view.access('itemName');
        itemName.value = model.get('itemName');
        itemName.error = model.error('itemName');
      }));

      model.publisher.subscribe('update:itemType', invoke(function () {
        var itemTypeModel = model.get('itemType');
        if (itemTypeModel) {
          var p = createItemTypePresenter(itemTypeModel);
          view.access('itemType').view = p.view;
        }
      }));

      var p = IntegerValuePresenter.create(model.get('maxLength'));
      view.access('maxLength').view = p.view;
      p = IntegerValuePresenter.create(model.get('minLength'));
      view.access('minLength').view = p.view;
    }

  });

});
