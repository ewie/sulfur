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
     * @param {any} maximum
     * @param {object} options (optional)
     *
     * @option options {boolean} exclusive (default false) whether to match exclusively or not
     * @option options {string} errorPrefix (optional) the error message prefix
     */
    initialize: function (maximum, options) {
      options || (options = {});
      this._maximum = maximum;
      this._exclusive = options.exclusive || false;
      this._errorPrefix = options.errorPrefix ||
        ("must be less than" + (this._exclusive ? '' : " or equal to"));
    },

    /**
     * @return {true} when matching exclusively
     * @return {false} when matching inclusively
     */
    get exclusive() { return this._exclusive },

    /**
     * @return {string} the error message prefix
     */
    get errorPrefix() { return this._errorPrefix },

    /**
     * Check if a value satisfies the maximum. If minimum responds to .cmp(),
     * it will be called with `value` as argument, otherwise uses the regular
     * comparison operator.
     *
     * @param {any} value
     * @param {array} errors (optional)
     *
     * @return {boolean} whether `value` is less than maximum or equal when
     *   matched inclusively
     */
    validate: function (value, errors) {
      var x, y;
      if (typeof this._maximum.cmp === 'function') {
        x = 0;
        y = this._maximum.cmp(value);
      } else {
        x = value;
        y = this._maximum;
      }
      var isValid = x < y || y === x && !this._exclusive;
      isValid || errors && errors.push(this.errorPrefix + " \u201C" + this._maximum + "\u201D");
      return isValid;
    }

  });

});
