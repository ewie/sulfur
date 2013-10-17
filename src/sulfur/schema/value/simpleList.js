/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/value/list',
  'sulfur/util'
], function ($listValue, $util) {

  'use strict';

  function normalize(s) {
    return s.replace(/[\x09\x0A\x0D\x20]+/g, ' ').replace(/^\x20|\x20$/g, '');
  }

  /**
   * @abstract
   *
   * @implement .getItemValueType()
   */
  var $ = $listValue.clone({

    typed: function (itemValueType) {
      return this.clone({
        getItemValueType: $util.returns(itemValueType)
      });
    },

    parse: function (s) {
      var itemValueType = this.getItemValueType();
      var values = normalize(s).split(' ').map(function (s) {
        return itemValueType.parse(s);
      });
      return this.create(values);
    }

  });

  $.augment({

    toString: function () {
      var s = this._values.map($util.method('toString')).join(' ');
      return normalize(s);
    }

  });

  return $;

});
