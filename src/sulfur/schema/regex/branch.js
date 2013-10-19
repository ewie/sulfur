/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/factory'
], function (Factory) {

  'use strict';

  /**
   * A branch of an alternation "|".
   */

  return Factory.derive({
    /**
     * @param {array} pieces (optional) an array of pieces under this branch
     */
    initialize: function (pieces) {
      this.pieces = pieces || [];
    },

    /**
     * Check whether the branch contains an empty group.
     *
     * @return {true} if any piece contains an empty group
     * @return {false} otherwise
     */
    containsEmptyGroup: function () {
      return this.pieces.some(function (piece) {
        return piece.containsEmptyGroup();
      });
    },

    /**
     * Check whether the branch contains a group containing surrogate codepoints.
     *
     * @return {true} if any piece contains a containing a surrogate pair
     *   branch
     * @return {false} otherwise
     */
    containsGroupWithSurrogateCodepoints: function () {
      return this.pieces.some(function (piece) {
        return piece.containsGroupWithSurrogateCodepoints();
      });
    }
  });

});
