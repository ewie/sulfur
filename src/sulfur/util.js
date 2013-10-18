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
     * Bind an object to one of its methods.
     *
     * @param [object] obj
     * @param [string] name
     * @param [any...] args
     *
     * @return [function] a function calling `name` on `obj` with prepended
     *   arguments `args`
     */
    bind: function () {
      var args = Array.prototype.slice.call(arguments);
      var obj = args.shift();
      var name = args.shift();
      var fn = obj[name];
      return fn.bind.apply(fn, [obj].concat(args));
    },

    bipart: function (ary, fn) {
      return ary.reduce(function (part, item, i) {
        var p = part[fn(item, i) ? 'true' : 'false'];
        p.push(item);
        return part;
      }, { true: [], false: [] });
    },

    first: function (ary, fn) {
      for (var i = 0; i < ary.length; i += 1) {
        var x = ary[i];
        if (fn(x, i)) {
          return x;
        }
      }
    },

    /**
     * Check if a value is not undefined.
     *
     * @param [any] x
     *
     * @return [boolean] whether `x` is not undefined or not
     */
    isDefined: function (x) {
      return !this.isUndefined(x);
    },

    /**
     * Check if a value is undefined.
     *
     * @param [any] x
     *
     * @return [boolean] whether `x` is undefined or not
     */
    isUndefined: function (x) {
      return typeof x === 'undefined';
    },

    /**
     * Check if a number represents an 53-bit integer, which are the only
     * integer values that can be represented with a double.
     *
     * @param [any] x
     *
     * @return [boolean] whether `x` is a number representing a 53-bit integer
     */
    isInteger: (function () {

      var MAX = Math.pow(2, 53);
      var MIN = -MAX;

      return function (x) {
        return typeof x === 'number' && ~~x === x && MIN < x && x < MAX;
      };

    }()),

    /**
     * Create a function that calls a method on an object given as first
     * argument.
     *
     * @param [string] name
     *
     * @return [function] a function calling `name` on any object given as
     *   first argument
     */
    method: function (name) {
      return function (obj) {
        return obj[name]();
      };
    },

    once: function (fn) {
      var called;
      var result;
      return function () {
        if (!called) {
          called = true;
          result = fn.apply(this, arguments);
        }
        return result;
      };
    },

    /**
     * Create a function returning a given value.
     *
     * @param [any] x a value to be returned by the function
     *
     * @return [function] a function returning the given value
     */
    returns: function (x) {
      return function () {
        return x;
      };
    },

    /**
     * Sort an array without modifying the original array.
     *
     * @param [array] ary the array to sort
     * @param [function] fn (optional) a custom comparison function
     *
     * @return [array] a new sorted array
     */
    sort: function (ary, fn) {
      return [].concat(ary).sort(fn);
    },

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
