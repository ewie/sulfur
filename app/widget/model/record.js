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
  'app/widget/model/field',
  'app/widget/model/value/file',
  'app/widget/model/value/geolocation',
  'app/widget/model/value/sequence',
  'sulfur/record',
  'sulfur/schema/value/complex/geolocation',
  'sulfur/schema/value/list',
  'sulfur/schema/value/simple/boolean',
  'sulfur/schema/value/simple/date',
  'sulfur/schema/value/simple/dateTime',
  'sulfur/schema/value/simple/decimal',
  'sulfur/schema/value/simple/double',
  'sulfur/schema/value/simple/fileRef',
  'sulfur/schema/value/simple/float',
  'sulfur/schema/value/simple/integer',
  'sulfur/schema/value/simple/list',
  'sulfur/schema/value/simple/string',
  'sulfur/schema/value/simple/uri',
  'sulfur/ui/collection',
  'sulfur/ui/model'
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
    FieldModel,
    FileValueModel,
    GeolocationValueModel,
    SequenceValueModel,
    Record,
    GeolocationValue,
    ListValue,
    BooleanValue,
    DateValue,
    DateTimeValue,
    DecimalValue,
    DoubleValue,
    FileRefValue,
    FloatValue,
    IntegerValue,
    SimpleListValue,
    StringValue,
    UriValue,
    Collection,
    Model
 ) {

  'use strict';

  function getValueModel(value) {
    switch (value) {
    case BooleanValue:
      return BooleanValueModel;
    case DateValue:
      return DateValueModel;
    case DateTimeValue:
      return DateTimeValueModel;
    case DecimalValue:
      return DecimalValueModel;
    case DoubleValue:
      return DoubleValueModel;
    case FileRefValue:
      return FileValueModel;
    case FloatValue:
      return FloatValueModel;
    case GeolocationValue:
      return GeolocationValueModel;
    case IntegerValue:
      return IntegerValueModel;
    case StringValue:
      return StringValueModel;
    case UriValue:
      return UriValueModel;
    default:
      var itemValueType = value.itemValueType;
      var itemValueModel = getValueModel(itemValueType);
      if (SimpleListValue.isPrototypeOf(value)) {
        return ListValueModel.withItemValueModel(itemValueModel);
      } else if (ListValue.isPrototypeOf(value)) {
        return SequenceValueModel.withItemValueModel(itemValueModel);
      }
      throw new Error("unexpected value type");
    }
  }

  return Model.clone({

    attributes: {
      id: { default: null },
      fields: { default: function () { return Collection.create() } },
      // indicates whether the record is loaded, i.e. can be displayed
      loaded: { default: false },
      opened: { default: false }
    },

    _extract: function (record) {
      var fields = record.names.map(function (name) {
        return FieldModel.createFromObject({
          name: name,
          value: record.value(name)
        });
      });
      return {
        original: record,
        id: record.id,
        fields: Collection.create(fields)
      };
    },

    createFromSchema: function (schema, record) {
      var model = this.create({ original: record });
      var fields = model.get('fields');

      schema.elements.toArray().forEach(function (element) {
        var name = element.name;

        var valueModel = getValueModel(element.type.valueType);

        var value = record && record.value(name);
        if (value) {
          value = valueModel.createFromObject(value);
        } else {
          value = valueModel.create();
        }

        var field = FieldModel.create({
          name: name,
          value: value,
          required: !element.isOptional
        });

        fields.add(field);
      });

      return model;
    }

  }).augment({

    _construct: function () {
      var id = this.get('id');
      var values = this.get('fields').items.map(function (field) {
        var f = field.object;
        return [ f.name, f.value ];
      });
      return Record.create(values, id);
    }

  });

});
