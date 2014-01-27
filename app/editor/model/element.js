/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'app/editor/model/type/complex/atomic',
  'app/editor/model/type/complex/list',
  'app/editor/model/type/simple/atomic',
  'app/editor/model/type/simple/list',
  'sulfur/schema/element',
  'sulfur/schema/type/complex/list',
  'sulfur/schema/type/complex/primitive',
  'sulfur/schema/type/complex/restricted',
  'sulfur/schema/type/simple/derived',
  'sulfur/schema/type/simple/list',
  'sulfur/schema/type/simple/primitive',
  'sulfur/schema/type/simple/restricted',
  'sulfur/ui/model'
], function (
    ComplexAtomicTypeModel,
    ComplexListTypeModel,
    SimpleAtomicTypeModel,
    SimpleListTypeModel,
    Element,
    ComplexListType,
    ComplexPrimitiveType,
    ComplexRestrictedType,
    SimpleDerivedType,
    SimpleListType,
    SimplePrimitiveType,
    SimpleRestrictedType,
    Model
) {

  'use strict';

  function isFactoryOf(f, x) { return f.prototype.isPrototypeOf(x) }

  var isSimplePrimitive = isFactoryOf.bind(null, SimplePrimitiveType);
  var isSimpleRestricted = isFactoryOf.bind(null, SimpleRestrictedType);
  var isComplexPrimitive = isFactoryOf.bind(null, ComplexPrimitiveType);
  var isComplexRestricted = isFactoryOf.bind(null, ComplexRestrictedType);
  var isSimpleDerived = isFactoryOf.bind(null, SimpleDerivedType);
  var isComplexList = isFactoryOf.bind(null, ComplexListType);

  function isSimpleAtomic(type) {
    if (isSimplePrimitive(type)) {
      return true;
    } else if (isSimpleRestricted(type)) {
      var primitive = type.primitive;
      return isSimplePrimitive(primitive) || isSimpleDerived(primitive);
    }
    return false;
  }

  function isSimpleList(type) {
    if (isFactoryOf(SimpleListType, type)) {
      return true;
    } else if (isSimpleRestricted(type)) {
      return isFactoryOf(SimpleListType, type.primitive);
    }
    return false;
  }

  function isComplexAtomic(type) {
    return isComplexPrimitive(type) || isComplexRestricted(type);
  }

  function getTypeModel(type) {
    switch (true) {
    case isSimpleAtomic(type):
      return SimpleAtomicTypeModel;
    case isSimpleList(type):
      return SimpleListTypeModel;
    case isComplexAtomic(type):
      return ComplexAtomicTypeModel;
    case isComplexList(type):
      return ComplexListTypeModel;
    default:
      throw new Error("unexpected type");
    }
  }

  function createTypeModel(type) {
    var m = getTypeModel(type);
    return m.createFromObject(type);
  }

  function createDefaultValueModel(valueType, value) {
    var m = SimpleAtomicTypeModel.getValueModel(valueType) ||
      SimpleListTypeModel.getValueModel(valueType);
    if (m) {
      if (value) {
        return m.createFromObject(value);
      }
      return m.create();
    }
    return null;
  }

  return Model.clone({

    attributes: {
      name: { default: '' },
      default: { default: null },
      type: { default: null },
      optional: { default: false }
    },

    _extract: function (element) {
      return {
        name: element.name,
        type: createTypeModel(element.type),
        default: createDefaultValueModel(element.type.valueType, element.defaultValue),
        optional: element.isOptional
      };
    },

    getTypeModel: getTypeModel

  }).augment({

    _validate: function (errors) {
      Model.prototype._validate.call(this, errors);
      var name = this.get('name');
      if (name) {
        Element.isValidName(name) || (errors.name = "must be a valid NCName");
      } else {
        errors.name = "must not be empty";
      }
      var typeModel = this.get('type');
      if (typeModel) {
        var type = typeModel.object;
        if (type) {
          var defaultModel = this.get('default');
          defaultModel && defaultModel.validateWithType(type);
        }
      } else {
        errors.type = true;
      }
    },

    _construct: function () {
      var name = this.get('name');
      var type = this.get('type') && this.get('type').object;
      if (name && type) {
        var e = Element.create(name, type, {
          optional: this.get('optional'),
          default: this.get('default') && this.get('default').object
        });
        return e;
      }
    }

  });

});
