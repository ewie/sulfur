/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/util/factory',
  'sulfur/schema/regex'
], function (Factory, Regex) {

  'use strict';

  /**
   * A pattern encapsulates a compiled regular expression and its source.
   * Provides a simple interface to match a string against the pattern.
   */

  var $ = Factory.clone({

    /**
     * Check if a string represents a valid XSD pattern.
     *
     * @param {string} s the string representation
     *
     * @return {boolean} whether the string representation is a valid pattern
     */
    isValidLiteral: function (s) {
      try {
        Regex.parse(s);
      } catch (e) {
        return false;
      }
      return true;
    }

  });

  $.augment({

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

  return $;

});
