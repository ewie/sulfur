/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/type/_faceted',
  'sulfur/schema/validator/all',
  'sulfur/schema/validator/prototype'
], function ($_facetedType, $allValidator, $prototypeValidator) {

  'use strict';

  /**
   * @abstract
   *
   * @implement .getValueType() a type representing the value space of this type
   *
   * @api private
   */
  return $_facetedType.derive({

    initialize: function (facets, base) {
      // Check `base` and test for identical prototypes, i.e. require the exact
      // type and not just a derived type.
      if (base && Object.getPrototypeOf(base) !== Object.getPrototypeOf(this)) {
        throw new Error("expecting base of same type");
      }
      $_facetedType.prototype.initialize.call(this, facets);
      this._base = base;
    },

    getBase: function () {
      return this._base;
    },

    getValueType: function () {
      return this.factory.getValueType();
    },

    createValidator: function () {
      var facetsValidator = $_facetedType.prototype.createValidator.call(this);
      var validators;
      if (this._base) {
        validators = [
          this._base.createValidator(),
          facetsValidator
        ];
      } else {
        validators = [
          $prototypeValidator.create(this.getValueType().prototype),
          facetsValidator
        ];
      }
      return $allValidator.create(validators);
    }

  });

});
