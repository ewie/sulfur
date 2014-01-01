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
