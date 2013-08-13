/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/object'
], function ($object) {

  'use strict';

  var CLASSES = {
    CHAR: 'CHAR',
    DIGIT: 'DIGIT',
    INITIAL: 'INITIAL',
    SPACE: 'SPACE',
    WORD: 'WORD'
  };

  /**
   * A multi character escape using a character class.
   */

  var $class = $object.derive({
    /**
     * @param [string] name of the character class
     * @param [boolean] whether to match codepoints of that class or the inverse
     */
    initialize: function (name, positive) {
      if (!CLASSES.hasOwnProperty(name)) {
        throw new Error("unknown character class " + name);
      }
      this.name = name;
      this.positive = typeof positive === 'undefined' ? true : positive;
    }
  });

  $class.extend(CLASSES);

  return $class;

});
