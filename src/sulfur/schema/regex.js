/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/util/factory',
  'sulfur/schema/regex/compiler',
  'sulfur/schema/regex/parser',
  'sulfur/schema/regex/translator'
], function (Factory, Compiler, Parser, Translator) {

  'use strict';

  /**
   * Implementation of regular expressions as defined by XML Schema 1.0
   *
   * The implementation deviates from the current recommendation to accomodate
   * the lacking of standard compliance presented by the .NET XML Schema
   * validator used by the DataGridService.
   *
   * The .NET version behaves differently in the following ways:
   *
   * - it it based on the W3C Working Draft 22 September 2000
   *     (http://www.w3.org/TR/2000/WD-xmlschema-2-20000922/)
   *   causing the following issues
   *
   *   - uses Unicode 3.0.0 (the current recommendation requires at least
   *     Unicode 3.1.0)
   *
   *   - does accept the General Category "Cs", denoting surrogate codepoints,
   *     which are not valid XML characters
   *
   * - does not support the General Category "Cn", denoting non-characters
   *   (probably because such codepoints are not explicitely listed in the
   *   Unicode Character Database)
   *
   * - the General Category Group "C" does not include "Cn"
   *
   * - does not treat strings as proper UTF-16 (handling of surrogate pairs),
   *   this affects the following 2 issues
   *
   *   - reports the wrong length of strings (counts the number of UTF-16 code
   *     units, whereby the standard requires the length of a string to be the
   *     number of codepoints)
   *
   *   - handles non-BMP codepoints (everything beyond U+FFFF) as literal
   *     surrogate pairs, e.g. the regular expression [&#x10000;] does not match
   *     the single codepoint U+10000, but rather matches either U+D800 or
   *     U+DC00 (the surrogate pairs to encode U+10000 in UTF-16) so the stated
   *     regular expression is interpreted as [&#xD800;&#xDC00;] which does not
   *     match U+10000 (and which, by the way, would be illegal because the
   *     literal use of surrogate codepoints U+D800..U+DFFF is forbidden because
   *     these do not represent valid characters)
   */

  var $ = Factory.clone({
    /**
     * Parse a regular expression as defined by XML Schema 1.0
     *
     * @param {string} source the text of the regular expression to parse
     *
     * @throw {Error} errors thrown by a {sulfur/schema/regex/parser}
     *
     * @return {sulfur/schema/regex} a syntax tree representing the parsed
     *  regular expression
     */
    parse: function (source) {
      var parser = Parser.create();
      var pattern = parser.parse(source);
      return this.create(pattern);
    },

    /**
     * Compile a regular expression as defined by XML Schema 1.0
     *
     * @param {string} source the text of the regular expression to compile
     *
     * @throw {Error} errors thrown by a {sulfur/schema/regex/parser}
     * @throw {Error} errors thrown by a {sulfur/schema/regex/compiler}
     *
     * @return {RegExp} an executable JavaScript regular expression
     */
    compile: function (source) {
      return this.parse(source).translate().compile();
    }
  });

  $.augment({

    /**
     * Initialize the regular expression with the given pattern.
     *
     * @param {sulfur/schema/regex/pattern} pattern
     */
    initialize: function (pattern) {
      this.pattern = pattern;
    },

    /**
     * Translate the regular expression tree to a tree which can be compiled
     * to a JavaScript regular expression.
     *
     * @return {sulfur/schema/regex/regex} the translated regular expression tree
     */
    translate: function () {
      var translator = Translator.create();
      var pattern = translator.translate(this.pattern);
      return this.factory.create(pattern);
    },

    /**
     * Check if the translated regular expression contains a group with
     * surrogate codepoints. Such a group causes the regular expression to
     * not behave as indented and may therefor give false results.
     *
     * @return {true} if the regular expression contains a group with
     *   surrogate codepoints
     * @return {false} otherwise
     */
    containsGroupWithSurrogateCodepoints: function () {
      return this.pattern.containsGroupWithSurrogateCodepoints();
    },

    /**
     * Check if the translated regular expression contains an empty group.
     * Such a group causes the regular expression to fail on every input.
     * Because a group matches a single codepoint which is a member of the
     * group's set of valid codepoints, an empty group cannot match any
     * codepoint because any codepoint cannot be member of the empty set.
     * An empty group results from a group subtraction when the LHS group is
     * a subset of the RHS group.
     *
     * @return {true} if the regular expression contains an empty group
     * @return {false} otherwise
     */
    containsEmptyGroup: function () {
      return this.pattern.containsEmptyGroup();
    },

    /**
     * Compile the regular expression to an executable JavaScript regular
     * expression.
     *
     * @return {RegExp} an executable JavaScript regular expression
     */
    compile: function () {
      var compiler = Compiler.create();
      return compiler.compile(this.pattern);
    }

  });

  return $;

});
