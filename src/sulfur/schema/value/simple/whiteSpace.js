/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define(['sulfur/schema/value/simple'], function (SimpleValue) {

  'use strict';

  return SimpleValue.clone({

    parse: function (s) { return this.create(s) }

  }).augment({

    initialize: function (value) {
      if (value !== 'collapse' && value !== 'preserve' && value !== 'replace') {
        throw new Error('expecting either "collapse", "preserve" or "replace"');
      }
      this._value = value;
    },

    get value() { return this._value },

    eq: function (other) {
      return this.value === other.value;
    },

    toString: function () { return this._value },

    isEqualOrStricter: function (other) {
      switch (this._value) {
      case 'collapse':
        return true;
      case 'replace':
        return other._value === 'preserve' || other._value === 'replace';
      case 'preserve':
        return other._value === 'preserve';
      }
    }

  });

});
