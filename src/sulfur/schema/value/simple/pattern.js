/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/schema/regex',
  'sulfur/schema/value/simple'
], function (Regex, SimpleValue) {

  'use strict';

  /**
   * A pattern encapsulates a compiled regular expression and its source.
   * Provides a simple interface to match a string against the pattern.
   */

  return SimpleValue.clone({

    parse: function (s) { return this.create(s) }

  }).augment({

    /**
     * Initialize the pattern by compiling the given source.
     *
     * @param {string} source the pattern's source
     *
     * @throw {Error} if sulfur/schema/regex.compile throws
     */
    initialize: function (source) {
      var compiledPattern;
      try {
        compiledPattern = Regex.compile(source);
      } catch (e) {
        throw new Error('invalid pattern "' + source + '" (error: ' + e.message + ')');
      }
      this._source = source;
      this._compiledPattern = compiledPattern;
    },

    /**
     * @return {string} the source
     */
    get source() { return this._source },

    /**
     * @return {true} when equal
     * @return {false} when not equal
     */
    eq: function (other) {
      return this.source === other.source;
    },

    /**
     * Get the source from which the patterns was compiled.
     *
     * @return {string} the pattern's source
     */
    toString: function () {
      return this._source;
    },

    /**
     * Check if a string matches the pattern.
     *
     * @param {string} s the string to test
     *
     * @return {boolean} whether `s` matches the pattern
     */
    test: function (s) {
      return this._compiledPattern.test(s);
    }

  });

});
