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
  'app/editor/model/type/complex/atomic',
  'app/editor/model/type/complex/list',
  'app/editor/model/type/simple/atomic',
  'app/editor/model/type/simple/list',
  'app/editor/presenter/type/complex/atomic',
  'app/editor/presenter/type/complex/list',
  'app/editor/presenter/type/simple/atomic',
  'app/editor/presenter/type/simple/list',
  'app/editor/types',
  'app/editor/view/element',
  'sulfur/schema/types',
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
    ComplexAtomicTypeModel,
    ComplexListTypeModel,
    SimpleAtomicTypeModel,
    SimpleListTypeModel,
    ComplexAtomicTypePresenter,
    ComplexListTypePresenter,
    SimpleAtomicTypePresenter,
    SimpleListTypePresenter,
    types,
    ElementView,
    schemaTypes,
    Presenter
) {

  'use strict';

  function isFactoryOf(f, x) { return f.prototype.isPrototypeOf(x) }

  function getTypePresenter(type) {
    if (schemaTypes.simpleTypes.indexOf(type) > -1) {
      return SimpleAtomicTypePresenter;
    } else if (schemaTypes.complexTypes.indexOf(type) > -1) {
      return ComplexAtomicTypePresenter;
    } else if (schemaTypes.isSimpleListType(type)) {
      return SimpleListTypePresenter;
    } else if (schemaTypes.complexListType === type) {
      return ComplexListTypePresenter;
    }
  }

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
    case FloatValueModel:
      return FloatValuePresenter;
    case IntegerValueModel:
      return IntegerValuePresenter;
    case StringValueModel:
      return StringValuePresenter;
    case UriValueModel:
      return UriValuePresenter;
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
    case isFactoryOf(FloatValueModel, valueModel):
      return FloatValuePresenter;
    case isFactoryOf(IntegerValueModel, valueModel):
      return IntegerValuePresenter;
    case isFactoryOf(ListValueModel, valueModel):
      var p = getItemValuePresenter(valueModel.itemValueModel);
      if (p) {
        return ListValuePresenter.withValuePresenter(p);
      }
      break;
    case isFactoryOf(StringValueModel, valueModel):
      return StringValuePresenter;
    case isFactoryOf(UriValueModel, valueModel):
      return UriValuePresenter;
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
      var view = ElementView.create();

      Presenter.prototype.initialize.call(this, view, model);

      this.view.publisher.subscribe('up', function () {
        model.publisher.publish('up');
      });

      this.view.publisher.subscribe('down', function () {
        model.publisher.publish('down');
      });

      this.view.publisher.subscribe('name', function () {
        model.update({ name: view.access('name').value });
      });

      this.view.publisher.subscribe('optional', function () {
        model.update({ optional: view.access('optional').value });
      });

      this.view.access('baseType').values = types.primitiveTypeNames;

      this._registerModel();
    },

    _registerModel: function() {
      this._attachModel();
      this._setupTypeSelection();
    },

    _attachModel: function () {
      var model = this.model;
      var view = this.view;

      model.publisher.subscribe('change:name', invoke(function () {
        var name = view.access('name');
        name.value = model.get('name');
        name.error = model.error('name');
      }));

      model.publisher.subscribe('change:type', invoke(function () {
        view.access('baseType').error = model.error('type');
      }));

      model.publisher.subscribe('update:default', invoke(function () {

        var defaultValueModel = model.get('default');

        if (defaultValueModel) {
          var p = createValuePresenter(defaultValueModel);
          view.access('defaultValue').view = p.view;
          view.showDefault();
          view.defaultValueLabelRef = p.view.inputElementID;
        } else {
          view.hideDefault();
        }

      }));

      model.publisher.subscribe('update:type', invoke(function () {
        var baseTypeName = view.access('baseType');
        var typeModel = model.get('type');
        if (typeModel) {
          var type = typeModel.primitive;
          baseTypeName.value = types.displayName(type);
          var tp = getTypePresenter(type).create(typeModel);
          view.access('type').view = tp.view;

          var itemTypeName = view.access('itemType');

          if (schemaTypes.isSimpleListType(type)) {
            itemTypeName.values = types.simpleTypeNames;
            typeModel.publisher.subscribe('update:itemType', invoke(function () {
              var itemTypeModel = typeModel.get('itemType');
              if (itemTypeModel) {
                var itemType = itemTypeModel.primitive;
                itemTypeName.value = types.displayName(itemType);
              }
            }));
          } else if (type === schemaTypes.complexListType) {
            itemTypeName.values = types.atomicTypeNames;
            typeModel.publisher.subscribe('update:itemType', invoke(function () {
              var itemTypeModel = typeModel.get('itemType');
              if (itemTypeModel) {
                var itemType = itemTypeModel.primitive;
                itemTypeName.value = types.displayName(itemType);
              }
            }));
          } else if (schemaTypes.isSimpleType(type)) {
            itemTypeName.value = undefined;
          } else if (schemaTypes.isComplexType(type)) {
            itemTypeName.value = undefined;
          }
        }
      }));
    },

    _setupTypeSelection: function () {
      var model = this.model;
      var view = this.view;

      var currentItemTypeModel;

      view.publisher.subscribe('base-type', function () {

        var baseTypeName = view.access('baseType').value;

        var typeModel;
        var defaultValueModel = null;
        var type = types.anyType(baseTypeName);

        if (types.isList(baseTypeName)) {
          if (SimpleAtomicTypeModel.prototype.isPrototypeOf(currentItemTypeModel)) {
            typeModel = SimpleListTypeModel.createWithItemTypeModel(currentItemTypeModel);
          } else {
            typeModel = SimpleListTypeModel.create();
          }
        } else if (types.isSequence(baseTypeName)) {
          if (currentItemTypeModel) {
            typeModel = ComplexListTypeModel.createWithItemTypeModel(currentItemTypeModel);
          } else {
            typeModel = ComplexListTypeModel.create();
          }
        } else if (types.isSimple(baseTypeName)) {
          typeModel = SimpleAtomicTypeModel.createFromObject(type);
          var dvm = SimpleAtomicTypeModel.getValueModel(type.valueType);
          dvm && (defaultValueModel = dvm.create());
        } else if (types.isComplex(baseTypeName)) {
          typeModel = ComplexAtomicTypeModel.createFromObject(type);
        }

        model.update({
          type: typeModel,
          default: defaultValueModel
        });
      });

      view.publisher.subscribe('item-type', function () {

        var typeModel = model.get('type');

        if (!typeModel) {
          return;
        }

        var itemTypeName = view.access('itemType').value;
        var itemType = types.anyType(itemTypeName);
        var itemTypeModel;

        var defaultValueModel = null;
        var updateDefault = true;

        if (SimpleListTypeModel.prototype.isPrototypeOf(typeModel)) {
          itemTypeModel = SimpleAtomicTypeModel.createFromObject(itemType);
          defaultValueModel = ListValueModel.withItemValueModel(
            SimpleAtomicTypeModel.getValueModel(itemType.valueType)).create();
        } else if (ComplexListTypeModel.prototype.isPrototypeOf(typeModel)) {
          if (itemType.allowedFacets) {
            itemTypeModel = SimpleAtomicTypeModel.createFromObject(itemType);
          } else {
            itemTypeModel = ComplexAtomicTypeModel.createFromObject(itemType);
          }
        } else {
          // keep the current default value when its neither a simple nor
          // complex list type, i.e. an atomic type
          updateDefault = false;
        }

        typeModel.update({ itemType: itemTypeModel });

        currentItemTypeModel = itemTypeModel;

        updateDefault && model.update({ default: defaultValueModel });

      });
    }

  });

});
