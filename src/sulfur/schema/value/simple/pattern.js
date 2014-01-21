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

    /**
     * Parse a pattern.
     *
     * @see .create()
     */
    parse: function (s) { return this.create(s) }

  }).augment({

    /**
     * Initialize the pattern by compiling the given source.
     *
     * @param {string} source the pattern's source
     *
     * @throw {Error} when the regex parser throws an exception
     */
    initialize: function (source) {
      var parsed = Regex.parse(source);
      this._source = source;
      this._parsed = parsed;
      var translated = this._tranlated = parsed.translate();
      this._compiled = translated.compile();
    },

    /**
     * @return {string} the source
     */
    get source() { return this._source },

    /**
     * @return {RegExp} the compiled pattern
     */
    get re() { return this._compiled },

    /**
     * @return {true} when equal
     * @return {false} when not equal
     */
    eq: function (other) { return this.source === other.source },

    /**
     * Get the source from which the patterns was compiled.
     *
     * @return {string} the pattern's source
     */
    toString: function () { return this.source },

    /**
     * Check if a string matches the pattern.
     *
     * @param {string} s the string to test
     *
     * @return {boolean} whether `s` matches the pattern
     */
    test: function (s) { return this.re.test(s) },

    /**
     * @see sulfur/schema/regex#containsGroupWithSurrogateCodepoints()
     */
    containsGroupWithSurrogateCodepoints: function () {
      return this._tranlated.containsGroupWithSurrogateCodepoints();
    },

    /**
     * @see sulfur/schema/regex#containsEmptyGroup()
     */
    containsEmptyGroup: function () {
      return this._tranlated.containsEmptyGroup();
    }

  });

});
