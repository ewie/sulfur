/* Copyright (c) 2013, Erik Wienhold
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
   * A collection of ranges to easily invert the collection or to add and
   * subtract other ranges.
   */

  /**
   * Sort an array of ranges in lexicographical order.
   *
   *   [a b] < [c d]  iff  a < c OR (a = c AND b < d)
   *
   * @param {array} ranges an array of ranges to sort
   *
   * @return {array} a new sorted array
   */
  function sort(ranges) {
    return [].concat(ranges).sort(function (left, right) {
      var d0 = left[0] - right[0];
      if (d0 !== 0) {
        return d0;
      }
      return left[1] - right[1];
    });
  }

  /**
   * Form disjoint ranges by merging
   *   (1) adjacent ranges (i.e. ranges with no gap in between)
   *   (2) overlapping ranges (i.e. part of a range partly lies within
   *       another range)
   *
   * @param {array} ranges an array of ranges
   *
   * @return {array} a new array of ranges
   */
  function disjoin(ranges) {
    ranges = sort(ranges);
    return ranges.reduce(function (ranges, range) {
      var len = ranges.length;
      var k = len - 1;
      // check if minimum of `range` lies within the most recent range
      if (len && (range[0] - 1) <= ranges[k][1]) {
        // extend the most recent range if the new maximum is greater than
        // the current maximum
        if (range[1] > ranges[k][1]) {
          ranges[k][1] = range[1];
        }
      } else {
        // cannot join with most recent range, so add a new range
        ranges.push([ range[0], range[1] ]);
      }
      return ranges;
    }, []);
  }

  /**
   * Get all ranges within a minimum and maximum which are not part of a set of
   * ranges.
   *
   *  min/max    <---------------------------->
   *  ranges         <--->   <---->    <--->
   *  results    <-->     <->      <-->     <->
   *  consumed    1        2        3        4
   *
   *
   *  min/max    <---------------------------->
   *  ranges   ---->     <---->   <-->     <-----
   *  results       <--->      <->    <--->
   *  consumed        1         2       3
   *
   * @param {number} min the inclusive start of the range
   * @param {number} max the inclusive end of the range
   * @param {array} ranges an array of sorted disjoint ranges
   * @param {number} offset
   *   the index of the first range in `ranges` to consider
   * @param {array} results an array receiving resulting ranges
   *
   * @throw {Error} if the range at `offset` is less than `min`
   *
   * @return {number}
   *   the number of consumed ranges (starting at `offset`),
   *   which are less than `max`
   */
  function subranges(min, max, ranges, offset, results) {
    var len = ranges.length;
    var index = offset;

    // assert that the first range is not less than `min`
    if (ranges[index][1] < min) {
      throw new Error("first range must not be less than the minimum");
    }

    // the subrange between `min` and the start of the first range, if
    // the first range is greater than `min`
    if (min < ranges[index][0]) {
      results.push([ min, ranges[index][0] - 1 ]);
    }

    var last = ranges[index];

    for (index += 1; index < len; index += 1) {
      var range = ranges[index];

      if (max < range[0]) {
        // stop if `range` is greater than `max`, since no more range
        // will affect the result
        break;
      } else {
        // subrange between the end of `last` and the start if `range`
        results.push([ last[1] + 1, range[0] - 1 ]);
      }

      last = range;
    }

    // the handling of the last range depends on its relation to `max`
    // (if `last` is less than `max` or includes `max`)
    if (last[1] < max) {
      // `last` is less than `max` so there is another subrange from
      // the end of `last` to `max`
      results.push([ last[1] + 1, max ]);
    } else if (max < last[1]) {
      // `last` includes `max` and may therefore affect following
      // ranges so can not count `last` as consumed
      index -= 1;
    }

    return index - offset;
  }

  var $ = Factory.derive({
    /**
     * Initialize the range collection with an array of ranges that will be
     * sorted and disjoined and be made available as #array.
     *
     * @param {array} an array of pairs each specifying a range with start and
     *   end value
     */
    initialize: function (ranges) {
      this.array = disjoin(ranges);
    },

    /**
     * Invert the ranges within the range U+0000..U+FFFF (the BMP).
     *
     * @return {ranges} a new range collection
     */
    invert: function () {
      var ranges = [];

      // the range between zero and the first range if not empty
      if (this.array[0][0] > 0) {
        ranges.push([ 0, this.array[0][0] - 1 ]);
      }

      // the range between a range's end and the following range's start
      for (var i = 1; i < this.array.length; i += 1) {
        ranges.push([ this.array[i - 1][1] + 1, this.array[i][0] - 1 ]);
      }

      // the range between the last range and U+FFFF if not empty
      if (this.array[this.array.length - 1][1] < 0xFFFF) {
        ranges.push([ this.array[this.array.length - 1][1] + 1, 0xFFFF ]);
      }

      return $.create(ranges);
    },

    /**
     * Subtract ranges on the RHS from ranges on the LHS.
     *
     *   R = LHS - RHS
     *
     * @param {ranges} other the RHS
     *
     * @return {ranges} the result of subtracting the RHS from the LHS
     */
    subtract: function (other) {
      var results = [];

      var llen = this.array.length;
      var rlen = other.array.length;

      for (var li = 0, ri = 0; li < llen; li += 1) {
        var range = this.array[li];

        // skip RHS ranges that are less than `range`, since those do not
        // affect the result
        for (; ri < rlen && other.array[ri][1] < range[0]; ri += 1) {}

        if (ri < rlen) {
          if (range[1] < other.array[ri][0]) {
            results.push([ range[0], range[1] ]);
          } else {
            ri += subranges(range[0], range[1], other.array, ri, results);
          }
        } else {
          // no more RHS ranges to affect the result
          results.push([ range[0], range[1] ]);
        }
      }

      return $.create(results);
    },

    /**
     * Add the ranges of another range collection.
     *
     * @return {ranges} a new range collection containing the ranges of this
     *   and the other collection.
     */
    add: function (other) {
      return $.create(this.array.concat(other.array));
    }
  });

  return $;

});
