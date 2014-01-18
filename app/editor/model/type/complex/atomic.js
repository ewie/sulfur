/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'require',
  'sulfur/schema/elements',
  'sulfur/schema/type/complex/primitive',
  'sulfur/schema/type/complex/restricted',
  'sulfur/ui/collection',
  'sulfur/ui/model'
], function (
    require,
    Elements,
    PrimitiveType,
    ComplexRestrictedType,
    Collection,
    Model
) {

  'use strict';

  function requireElementModel() {
    return require('app/editor/model/element');
  }

  function isFactoryOf(f, x) {
    return f.prototype.isPrototypeOf(x);
  }

  var isPrimitive = isFactoryOf.bind(null, PrimitiveType);

  return Model.clone({

    attributes: {
      primitive: { default: null },
      elements: { default: function () { return Collection.create() } }
    },

    _extract: function (type) {
      var primitive;
      var elements;
      if (isPrimitive(type)) {
        primitive = type;
        elements = type.allowedElements;
      } else {
        primitive = type.primitive;
        elements = type.elements;
      }
      var ElementModel = requireElementModel();
      elements = elements.toArray().map(function (e) {
        var tm = ElementModel.getTypeModel(e.type);
        return ElementModel.create({
          name: e.name,
          optional: e.isOptional,
          type: tm.createFromBaseType(e.type),
          default: null
        });
      });
      return {
        primitive: primitive,
        elements: Collection.create(elements)
      };
    }

  }).augment({

    get primitive() { return this.get('primitive') },

    _construct: function () {
      var elements = this.get('elements').items.map(function (e) {
        return e.object;
      });
      return ComplexRestrictedType.create(this.get('primitive'),
        Elements.create(elements));
    }

  });

});
