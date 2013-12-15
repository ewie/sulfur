/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/value/list',
  'sulfur/schema/value/simple',
  'sulfur/util'
], function (ListValue, SimpleValue, util) {

  'use strict';

  function normalize(s) {
    return s.replace(/[\x09\x0A\x0D\x20]+/g, ' ').replace(/^\x20|\x20$/g, '');
  }

  /**
   * @abstract
   *
   * @implement .itemValueType
   */
  return ListValue.clone({

    withItemValueType: function (itemValueType) {
      return this.clone({
        get itemValueType() { return itemValueType; }
      });
    },

    // XXX we cannot derive from sulfur/schema/value/simple so just copy the
    //   desired method
    isValidLiteral: SimpleValue.isValidLiteral,

    parse: function (s) {
      var itemValueType = this.itemValueType;
      var values = normalize(s).split(' ').map(function (s) {
        return itemValueType.parse(s);
      });
      return this.create(values);
    }

  }).augment({

    toString: function () {
      var s = this._values.map(util.method('toString')).join(' ');
      return normalize(s);
    }

  });

});
