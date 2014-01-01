/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/util/factory'
], function (Factory) {

  'use strict';

  /**
   * A pattern holds one or more branches (i.e. alternations).
   */

  return Factory.derive({
    /**
     * @param {array} an array of one or more branches
     *
     * @throw {Error} if `branches` is empty
     */
    initialize: function (branches) {
      if (!branches.length) {
        throw new Error("pattern must contain at least one branch");
      }
      this.branches = branches;
    },

   /**
    * Check if any branch contains an empty group.
    *
    * @return {true} if any branch contains an empty group
    * @return {false} otherwise
    */
    containsEmptyGroup: function () {
      return this.branches.some(function (branch) {
        return branch.containsEmptyGroup();
      });
    },

    /**
     * Check if any branch contains a group containing surrogate codepoints.
     *
     * @return {true} if any branch contains a group containing a surrogate pair
     * @return {false} otherwise
     */
    containsGroupWithSurrogateCodepoints: function () {
      return this.branches.some(function (branch) {
        return branch.containsGroupWithSurrogateCodepoints();
      });
    }
  });

});
