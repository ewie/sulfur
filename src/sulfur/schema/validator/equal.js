/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define(['sulfur/util/factory'], function (Factory) {

  'use strict';

  return Factory.derive({

    /**
     * @param {any} value
     * @param {object} options (optional)
     *
     * @option options {string} message (optional)
     */
    initialize: function (value, options) {
      this._value = value;
      this._message = options && options.message || "must be equal to ???";
    },

    /**
     * @return {string} the error message
     */
    get message() { return this._message },

    /**
     * Check if a value is strictly equal to the expected value.
     *
     * @param {any} value
     * @param {array} errors (optional)
     *
     * @return {boolean} whether `value` is strictly equal to the expected value
     */
    validate: function (value, errors) {
      var isValid = value === this._value;
      isValid || errors && errors.push(this.message.replace(/\?{3}/g, this._value));
      return isValid;
    }

  });

});
