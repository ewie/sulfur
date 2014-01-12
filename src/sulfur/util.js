/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define(['sulfur/util/orderedStringMap'], function (OrderedStringMap) {

  'use strict';

  return {

    /**
     * Bind an object to one of its methods.
     *
     * @param {object} obj
     * @param {string} name
     * @param {any...} args
     *
     * @return {function} a function calling `name` on `obj` with prepended
     *   arguments `args`
     */
    bind: function () {
      var args = Array.prototype.slice.call(arguments);
      var obj = args.shift();
      var name = args.shift();
      var fn = obj[name];
      return fn.bind.apply(fn, [obj].concat(args));
    },

    /**
     * Partition an array into two arrays. One containing all items for which
     * the predicate is true and one containing all items for which the
     * predicate is false.
     *
     * @param {array} ary the array to partition
     * @param {function} fn the predicate function
     * @param {string} t (default "true") the property name for all items
     *   satisfying the predicate
     * @param {string} f (default "false") the property name for all items not
     *   satisfying the predicate
     *
     * @return {object} an object containing the two arrays under property `t`
     *   and `f` respectively
     *
     * @throw {Error} when `t` and `f` are equal
     */
    bipart: function (ary, fn, t, f) {
      t || (t = 'true');
      f || (f = 'false');
      if (t === f) {
        throw new Error("expecting different property names");
      }
      var p = {};
      p[t] = [];
      p[f] = [];
      return ary.reduce(function (part, item, i) {
        var p = part[fn(item, i) ? t : f];
        p.push(item);
        return part;
      }, p);
    },

    /**
     * Get the first array item satisfying the predicate.
     *
     * @param {array} ary
     * @param {function} fn the predicate function
     *
     * @return {any} the first matching item
     * @return {undefined} when no item matches
     */
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
     * @param {any} x
     *
     * @return {boolean} whether `x` is not undefined or not
     */
    isDefined: function (x) {
      return !this.isUndefined(x);
    },

    /**
     * Check if a value is undefined.
     *
     * @param {any} x
     *
     * @return {boolean} whether `x` is undefined or not
     */
    isUndefined: function (x) {
      return typeof x === 'undefined';
    },

    /**
     * Check if a number represents an 53-bit integer, which are the only
     * integer values that can be represented with a double.
     *
     * @param {any} x
     *
     * @return {boolean} whether `x` is a number representing a 53-bit integer
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
     * @param {string} name
     *
     * @return {function} a function calling `name` on any object given as
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

    property: function (name) {
      return function (obj) {
        return obj[name];
      };
    },

    /**
     * Create a function returning a given value.
     *
     * @param {any} x a value to be returned by the function
     *
     * @return {function} a function returning the given value
     */
    returns: function (x) {
      return function () {
        return x;
      };
    },

    /**
     * Sort an array without modifying the original array.
     *
     * @param {array} ary the array to sort
     * @param {function} fn (optional) a custom comparison function
     *
     * @return {array} a new sorted array
     */
    sort: function (ary, fn) {
      return [].concat(ary).sort(fn);
    },

    /**
     * Remove duplicate values from an array by using a string key.
     *
     * @param {array} values
     * @param {function} key (optional) a function returning a value's string key
     *
     * @return {array} an array without duplicate values based on each value's key
     */
    uniq: function (values, key) {
      key || (key = this.method('toString'));
      var index = values.reduce(function (index, value) {
        var k = key(value);
        if (!index.contains(k)) {
          index.set(k, value);
        }
        return index;
      }, OrderedStringMap.create());
      return index.values;
    }

  };

});
