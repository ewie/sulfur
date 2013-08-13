/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/object',
  'sulfur/schema/regex/quant'
], function ($object, $quant) {

  'use strict';

  /**
   * A piece is an atom (codepoint, codeunit, class, group, pattern, block or
   * category) with a quantifier.
   */

  return $object.derive({
    /**
     * @param [codepoint|codeunit|class|group|pattern|block|category] atom
     * @param [quant] quant (default quantifier of exactly 1)
     */
    initialize: function (atom, quant) {
      this.atom = atom;
      this.quant = quant || $quant.create(1);
    },

    /**
     * Check if the piece contains an empty group. Which is possible if the
     * atom is either a group or a pattern.
     *
     * @return [true] if the piece contains an empty group
     * @return [false] otherwise
     */
    containsEmptyGroup: function () {
      if (this.atom.items) {
        return this.atom.isEmpty();
      } else if (this.atom.branches) {
        return this.atom.containsEmptyGroup();
      } else {
        return false;
      }
    },

    /**
     * Check if the piece contains a group containing surrogate pairs. Which is
     * possible if the atom is either a group or a pattern.
     *
     * @return [true] if the piece contains a group containing a surrogate pair
     * @return [false] otherwise
     */
    containsGroupWithSurrogateCodepoints: function () {
      if (this.atom.items) {
        return this.atom.containsSurrogateCodepoints();
      } else if (this.atom.branches) {
        return this.atom.containsGroupWithSurrogateCodepoints();
      } else {
        return false;
      }
    }
  });

});
