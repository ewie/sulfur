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
     * @option options {string} errorPrefix (optional)
     */
    initialize: function (pattern, options) {
      this._pattern = pattern;
      this._errorPrefix = options && options.errorPrefix || "must match pattern";
    },

    /**
     * @return {string} the error message prefix
     */
    get errorPrefix() { return this._errorPrefix },

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
      isValid || errors && errors.push(this.errorPrefix + " \u201C" + this._pattern.source + "\u201D");
      return isValid;
    }

  });

});
