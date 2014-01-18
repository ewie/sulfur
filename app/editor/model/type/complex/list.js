/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'app/common/model/value/integer',
  'app/editor/model/type/complex/atomic',
  'app/editor/model/type/simple/atomic',
  'sulfur/schema/element',
  'sulfur/schema/type/complex/list',
  'sulfur/schema/types',
  'sulfur/schema/value/simple/integer',
  'sulfur/ui/model'
], function (
    IntegerValueModel,
    ComplexAtomicTypeModel,
    SimpleAtomicTypeModel,
    Element,
    ListType,
    schemaTypes,
    IntegerValue,
    Model
) {

  'use strict';

  function getItemTypeModel(type) {
    if (schemaTypes.isSimpleType(type)) {
      return SimpleAtomicTypeModel;
    }
    if (schemaTypes.isComplexType(type)) {
      return ComplexAtomicTypeModel;
    }
    throw new Error("unexpected item type");
  }

  function createItemTypeModel(type) {
    var m = getItemTypeModel(type);
    return m.createFromObject(type);
  }

  return Model.clone({

    attributes: {
      itemName: { default: 'item' },
      itemType: { default: null },
      maxLength: { default: function () { return IntegerValueModel.create() } },
      minLength: { default: function () { return IntegerValueModel.create() } }
    },

    _extract: function (type) {
      var itemType = createItemTypeModel(type.element.type);
      var maxLength = type.maxLength ?
        IntegerValueModel.createFromObject(type.maxLength) :
        IntegerValueModel.create();
      var minLength = IntegerValueModel.createFromObject(
        type.minLength ? type.minLength : IntegerValue.create());
      return {
        name: type.element.name,
        itemType: itemType,
        maxLength: maxLength,
        minLength: minLength
      };
    },

    createWithItemTypeModel: function (itemTypeModel) {
      return this.create({ itemType: itemTypeModel });
    }

  }).augment({

    get primitive() { return ListType },

    _validate: function (errors) {
      Model.prototype._validate.call(this, errors);

      var itemName = this.get('itemName');
      if (itemName) {
        Element.isValidName(itemName) || (errors.itemName = "must be a NCName");
      } else {
        errors.itemName = "must not be empty";
      }

      var itemType = this.get('itemType');
      itemType || (errors.itemType = true);

      var maxLength = this.get('maxLength');
      var minLength = this.get('minLength');
      maxLength && (maxLength = maxLength.object);
      minLength && (minLength = minLength.object);

      if (maxLength && maxLength.isNegative) {
        this.get('maxLength').updateExternalErrors({ value: "must be non-negative" });
        return;
      }

      if (minLength && minLength.isNegative) {
        this.get('minLength').updateExternalErrors({ value: "must be non-negative" });
        return;
      }

      if (maxLength && minLength) {
        if (maxLength.lt(minLength)) {
          this.get('maxLength').updateExternalErrors({ value: "must be less than or equal minimum length" });
          this.get('minLength').updateExternalErrors({ value: "must be greater than or equal maximum length" });
        } else {
          this.get('maxLength').updateExternalErrors({ value: false });
          this.get('minLength').updateExternalErrors({ value: false });
        }
      }
    },

    _construct: function () {
      var itemType = this.get('itemType');
      if (itemType) {
        var element = Element.create(this.get('itemName'), itemType.object);
        var maxLength = this.get('maxLength');
        var minLength = this.get('minLength');
        return ListType.create(element, {
          maxLength: maxLength && (maxLength = maxLength.object),
          minLength: minLength && (minLength = minLength.object)
        });
      }
    }

  });

});
