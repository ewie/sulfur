/*
 * Copyright (c) 2013, 2014, Erik Wienhold
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

    // XXX we cannot derive from sulfur/schema/value/simple so just copy the
    //   desired method
    isValidLiteral: SimpleValue.isValidLiteral,

    parse: function (s) {
      var itemValueType = this.itemValueType;
      var ns = normalize(s);
      var values;
      if (ns.length) {
        values = ns.split(' ').map(itemValueType.parse.bind(itemValueType));
      } else {
        // Handle an empty string separately because String.prototype.split()
        // returns an array containing a single empty string when the original
        // string is empty.
        values = [];
      }
      return this.create(values);
    }

  }).augment({

    toString: function () {
      var s = this._values.map(util.method('toString')).join(' ');
      return normalize(s);
    }

  });

});
