/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define(['sulfur/util/orderedMap'], function ($orderedMap) {

  'use strict';

  return {

    /**
     * Check if a value is not undefined.
     *
     * @param [any] x
     *
     * @return [boolean] whether x is not undefined or not
     */
    isDefined: function (x) {
      return typeof x !== 'undefined';
    },

    /**
     * Check if a value is not undefined.
     *
     * @param [any] x
     *
     * @return [boolean] whether x is not undefined or not
     */
    isInteger: (function () {

      var MAX = Math.pow(2, 53);
      var MIN = -MAX;

      return function (x) {
        return typeof x === 'number' && ~~x === x && MIN < x && x < MAX;
      };

    }()),

    /**
     * Remove duplicate elements from an array by using a string key.
     *
     * @param [array] elements
     * @param [function] key (optional) a function returning a string key for
     *   each element
     *
     * @return [array] an array without duplicate elements based on each
     *   element's key
     */
    uniq: function (elements, key) {
      var map = $orderedMap.create(key);
      elements.forEach(function (element) {
        if (map.canBeInserted(element)) {
          map.insert(element);
        }
      });
      return map.toArray();
    }

  };

});
