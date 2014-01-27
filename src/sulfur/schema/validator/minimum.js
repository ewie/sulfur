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
     * @param {any} minimum
     * @param {object} options (optional)
     *
     * @option options {boolean} exclusive (default false) whether to match exclusively or not
     * @option options {string} message (optional) the error message
     */
    initialize: function (minimum, options) {
      options || (options = {});
      this._minimum = minimum;
      this._exclusive = options.exclusive || false;
      this._message = options.message ||
        ("must be greater than" + (this._exclusive ? '' : " or equal to") + ' ???');
    },

    /**
     * @return {true} when matching exclusively
     * @return {false} when matching inclusively
     */
    get exclusive() { return this._exclusive },

    /**
     * @return {string} the error message
     */
    get message() { return this._message },

    /**
     * Check if a value satisfies the minimum. If the minimum responds to .cmp(),
     * it will be called with `value` as argument, otherwise uses the regular
     * comparison operator.
     *
     * @param {any} value
     * @param {array} errors (optional)
     *
     * @return {boolean} whether `value` is greater than minimum or equal when
     *   matched inclusively
     */
    validate: function (value, errors) {
      var x, y;
      if (typeof this._minimum.cmp === 'function') {
        x = 0;
        y = this._minimum.cmp(value);
      } else {
        x = value;
        y = this._minimum;
      }
      var isValid = x > y || y === x && !this._exclusive;
      isValid || errors && errors.push(this.message.replace(/\?{3}/g, this._minimum));
      return isValid;
    }

  });

});
