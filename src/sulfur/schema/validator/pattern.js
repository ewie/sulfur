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
     * Initialize the validator with an object responding to .test(). This
     * allows the use of a {RegExp} or {sulfur/schema/value/simple/pattern}.
     *
     * @param {.test()} pattern
     * @param {object} options (optional)
     *
     * @option options {string} message (optional)
     */
    initialize: function (pattern, options) {
      this._pattern = pattern;
      this._message = options && options.message || "must match pattern ???";
    },

    /**
     * @return {string} the error message
     */
    get message() { return this._message },

    /**
     * Check if a value's string representation satisfies the pattern.
     *
     * @param {.toString()} value
     * @param {array} errors (optional)
     *
     * @return {boolean} whether the string representation of `value` satisfies
     *   the pattern
     */
    validate: function (value, errors) {
      var isValid = this._pattern.test(value);
      isValid || errors && errors.push(this.message.replace(/\?{3}/g, this._pattern.source));
      return isValid;
    }

  });

});
