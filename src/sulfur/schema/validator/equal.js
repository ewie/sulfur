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
     * @option options {string} errorPrefix (optional)
     */
    initialize: function (value, options) {
      this._value = value;
      this._errorPrefix = options && options.errorPrefix || "must be equal to";
    },

    /**
     * @return {string} the error message prefix
     */
    get errorPrefix() { return this._errorPrefix },

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
      isValid || errors && errors.push(this.errorPrefix + " \u201C" + this._value + "\u201D");
      return isValid;
    }

  });

});
