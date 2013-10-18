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
   * A group of codepoints matching a single codepoint that's a member of the
   * group.
   */

  return Factory.derive({
    /**
     * Initialize a group with an array of items (any of codepoint, codeunit,
     * range, class, block or category).
     *
     * @param [array] items (optional) an array of group items
     * @param [object] options (optional)
     *
     * @option options [boolean] positive (default true) whether to match the
     *   codepoints given by `items` or the inverse
     * @option options [group] subtrahend (optional) a group to subtract,
     *   effectively removing all the subtrahend's items from `items`
     */
    initialize: function (items, options) {
      options || (options = {});
      this.items = items || [];
      this.positive = typeof options.positive === 'undefined' ? true : options.positive;
      this.subtrahend = options.subtract;
    },

    /**
     * Check if the group is empty, i.e. it has no items.
     *
     * @return [true] if empty
     * @return [false] otherwise
     */
    isEmpty: function () {
      return this.items.length === 0;
    },

    /**
     * Check if the groups contains any surrogate codepoints.
     *
     * @return [true] if there are surrogate codepoints
     * @return [false] otherwise
     */
    containsSurrogateCodepoints: function () {
      return this.items.some(function (item) {
        if (item.start && item.end) {
          return 0xD800 <= item.start.value && item.start.value <= 0xDFFF ||
            0xD800 <= item.end.value && item.end.value <= 0xDFFF;
        } else {
          return 0xD800 <= item.value && item.value <= 0xDFFF;
        }
      });
    }
  });

});
