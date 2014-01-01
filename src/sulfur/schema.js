/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/util/factory',
  'sulfur/schema/validator/all',
  'sulfur/schema/validator/existence',
  'sulfur/schema/validator/property'
], function (Factory, AllValidator, ExistenceValidator, PropertyValidator) {

  'use strict';

  return Factory.derive({

    initialize: function (qname, elements) {
      this._qname = qname;
      this._elements = elements;
    },

    get qname() { return this._qname },

    get elements() { return this._elements },

    createValidator: function () {
      var elementValidators = this.elements.toArray().map(function (e) {
        var v = e.type.createValidator();

        // Ensure a mandatory element using an existence validator.
        if (!e.isOptional) {
          v = AllValidator.create([ ExistenceValidator.create(), v ]);
        }

        return PropertyValidator.create('value', v, [ e.name ]);
      });

      return AllValidator.create(elementValidators);
    }

  });

});
