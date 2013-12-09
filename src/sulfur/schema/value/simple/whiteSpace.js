/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define(['sulfur/util/factory'], function (Factory) {

  'use strict';

  return Factory.clone({

    parse: function (s) { return this.create(s) }

  }).augment({

    initialize: function (value) {
      if (value !== 'collapse' && value !== 'preserve' && value !== 'replace') {
        throw new Error('expecting either "collapse", "preserve" or "replace"');
      }
      this._value = value;
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
