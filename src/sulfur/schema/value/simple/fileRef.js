/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define(['sulfur/util/factory'], function (Factory) {

  'use strict';

  return Factory.clone({

    parse: function (s) {
      return this.create(s);
    }

  }).augment({

    /**
     * @param {string} value
     */
    initialize: function (value) {
      this._value = value;
    },

    /**
     * @return {string} the reference's identifier
     */
    get value() { return this._value },

    /**
     * @return {true} when equal
     * @return {false} when not equal
     */
    eq: function (other) {
      return this.value === other.value;
    },

    /**
     * @return {string} the reference's identifier
     */
    toString: function () {
      return this.value;
    }

  });

});
