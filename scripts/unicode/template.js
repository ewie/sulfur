/*
 * Copyright (c) 2013, 2014, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define(['sulfur/util'], function (util) {

  'use strict';

  var LEAD_SURROGATE_MIN = 0xD800;
  var LEAD_SURROGATE_MAX = 0xDBFF;
  var TRAIL_SURROGATE_MIN = 0xDC00;
  var TRAIL_SURROGATE_MAX = 0xDFFF;

  function isLeadSurrogate(value) {
    return LEAD_SURROGATE_MIN <= value && value <= LEAD_SURROGATE_MAX;
  }

  function isTrailSurrogate(value) {
    return TRAIL_SURROGATE_MIN <= value && value <= TRAIL_SURROGATE_MAX;
  }

  function isValidCodepoint(value) {
    return 0 <= value && value <= 0x10FFFF;
  }

  var unicode = {
    /**
     * Decode a character represented by a string into its UCS codepoint value.
     *
     * @param {string} s
     *   a string of length 1 containing a single BMP character, or
     *   a string of length 2 containing a surrogate pair
     *
     * @throw {Error} if `s` is empty
     * @throw {Error} if `s` is missing a lead or trail surrogate
     *
     * @return {array} a pair of the character's codepoint value and the number
     *   of consumed code units
     */
    decodeCharacterFromUtf16: function (s) {
      if (s.length === 0) {
        throw new Error("cannot decode empty string");
      }
      var lead = s.charCodeAt(0);
      if (isLeadSurrogate(lead)) {
        if (s.length === 1) {
          throw new Error(
            "expecting a trail surrogate after a lead surrogate, " +
            "but there is no more input");
        }
        var trail = s.charCodeAt(1);
        if (!isTrailSurrogate(trail)) {
          throw new Error("expecting a trail surrogate after a lead surrogate");
        }
        var hi = lead - LEAD_SURROGATE_MIN;
        var lo = trail - TRAIL_SURROGATE_MIN;
        var value = 0x10000 + ((hi << 10) | lo);
        return [ value, 2 ];
      } else if (isTrailSurrogate(lead)) {
        throw new Error("unexpected trail surrogate");
      } else {
        return [ lead, 1 ];
      }
    },

    /**
     * Encode a UCS codepoint value as UTF-16.
     *
     * @param {number} value the codepoint value to encode
     *
     * @return {string} a string containing either a single BMP character or a
     *   surrogate pair
     */
    encodeCharacterAsUtf16: function (value) {
      var pair = this.encodeToSurrogatePair(value);
      if (pair) {
        return String.fromCharCode(pair[0]) + String.fromCharCode(pair[1]);
      }
      return String.fromCharCode(value);
    },

    /**
     * Encode a UCS codepoint as a surrogate pair.
     *
     * @param {number} value the codepoint value to encode
     *
     * @return {array} an array containing the lead and trail surrogate
     * @return {undefined} when the codepoint cannot be encoded with a
     *   surrogate pair
     */
    encodeToSurrogatePair: function (value) {
      if (!isValidCodepoint(value)) {
        throw new Error("cannot encode a codepoint outside the valid range");
      }
      if (isLeadSurrogate(value) || isTrailSurrogate(value)) {
        throw new Error("cannot encode a surrogate codepoint");
      }
      if (value >= 0x10000) {
        value -= 0x10000;
        var lead = (value >> 10) + LEAD_SURROGATE_MIN;
        var trail = (value & 0x3ff) + TRAIL_SURROGATE_MIN;
        return [ lead, trail ];
      }
    },

    /**
     * Check if a string represents a valid Block name.
     *
     * @param {string} name
     *
     * @return {true} if valid
     * @return {false} otherwise
     */
    isValidBlock: function (name) {
      return BLOCKS.hasOwnProperty(name);
    },

    /**
     * Check if a string represents a valid General Category name.
     *
     * @param {string} name
     *
     * @return {true} if valid
     * @return {false} otherwise
     */
    isValidCategory: function (name) {
      return CATEGORIES.hasOwnProperty(name);
    },

    /**
     * Check if a string represents a valid General Category Group name.
     *
     * @param {string} name
     *
     * @return {true} if valid
     * @return {false} otherwise
     */
    isValidCategoryGroup: function (name) {
      return CATEGORY_GROUPS.hasOwnProperty(name);
    },

    /**
     * Get the codepoint range of the Block with the given name.
     *
     * @param {string} name
     *
     * @return {array} an array containing the block's start and end
     * @return {undefined} if `name` does not denote a valid Block
     */
    getBlockRange: function (name) {
      if (this.isValidBlock(name)) {
        // return a copy
        var range = BLOCKS[name];
        return [ range[0], range[1] ];
      }
    },

    /**
     * Get the codepoint ranges of the General Category with the given name.
     *
     * @param {string} name
     *
     * @return {array} an array of sorted and disjoint ranges
     * @return {undefined} if `name` does not denote a valid General Category
     */
    getCategoryRanges: function (name) {
      if (this.isValidCategory(name)) {
        return copy(CATEGORIES[name]);
      }
    },

    /**
     * Get the codepoint ranges the General Category Group with the given name.
     *
     * @param {string} name
     *
     * @return {array} an array of sorted and disjoint ranges
     * @return {undefined} if `name` does not denote a valid General Category Group
     */
    getCategoryGroupRanges: function (name) {
      if (this.isValidCategoryGroup(name)) {
        if (typeof CATEGORY_GROUPS[name] === 'string') {
          CATEGORY_GROUPS[name] = resolveCategoryGroup(name);
        }
        return copy(CATEGORY_GROUPS[name]);
      }
    },

    /**
     * Get the names of all valid General Categories.
     *
     * @return {array} an array of General Category names in no particular order
     */
    getCategoryNames: function () {
      return Object.keys(CATEGORIES);
    },

    /**
     * Get the names of all valid General Category Groups.
     *
     * @return {array} an array of valid General Category Group names in no
     *   particular order
     */
    getCategoryGroupNames: function () {
      return Object.keys(CATEGORY_GROUPS);
    },

    /**
     * Get the names of all valid Blocks.
     *
     * @return {array} an array of valid Block names in no particular order
     */
    getBlockNames: function () {
      return Object.keys(BLOCKS);
    },

    /**
     * Get the codepoint ranges for all valid start characters of an XML Name.
     *
     * @return {array} an array of sorted and disjoint ranges
     */
    getXmlNameStartCharRanges: function () {
      return copy(XML_NAME_START_CHARACTERS);
    },

    /**
     * Get the codepoint ranges for all characters that make up a valid XML Name.
     *
     * @return {array} an array of sorted and disjoint ranges
     */
    getXmlNameCharRanges: function () {
      return copy(XML_NAME_CHARACTERS);
    }
  };

  /**
   * Resolve a category group of a certain name.
   *
   * @param {strng} name a valid category group name
   *
   * @return {array} an array of sorted and disjoin ranges
   */
  function resolveCategoryGroup(name) {
    var p = CATEGORY_GROUPS[name];

    var ranges = p.split('').reduce(function (ranges, p) {
      CATEGORIES[name + p].reduce(function (ranges, range) {
        ranges.push([ range[0], range[1] ]);
        return ranges;
      }, ranges);
      return ranges;
    }, []);

    ranges = sort(ranges);
    ranges = disjoin(ranges);

    return ranges;
  }

  /**
   * Create a deep copy of an array of ranges.
   *
   * @param {array} ranges an array of ranges
   *
   * @return {array} a deep copy of the given ranges
   */
  function copy(ranges) {
    return ranges.map(function (range) {
      return [ range[0], range[1] ];
    });
  }

  /**
   * Sort an array of ranges in lexicographical order.
   *
   * @param {array} ranges an array of ranges
   *
   * @return {array} a new sorted array
   */
  function sort(ranges) {
    return util.sort(ranges, function (left, right) {
      var d0 = left[0] - right[0];
      if (d0 !== 0) {
        return d0;
      }
      return left[1] - right[1];
    });
  }

  /**
   * Form disjoint ranges by combining two ranges if the gap in between is
   * less than or equal zero
   *
   * @param {array} ranges an array of sorted ranges
   *
   * @return {array} a new array of disjoint ranges
   */
  function disjoin(ranges) {
    return ranges.reduce(function (ranges, range) {
      var last = ranges.length - 1;
      if (last >= 0 && ranges[last][1] === (range[0] - 1)) {
        ranges[last] = [ ranges[last][0], range[1] ];
      } else {
        ranges.push([ range[0], range[1] ]);
      }
      return ranges;
    }, []);
  }

  var CATEGORY_GROUPS = {
    'C': 'cfos',
    'L': 'lmotu',
    'M': 'cen',
    'N': 'dlo',
    'P': 'cdefios',
    'S': 'cmok',
    'Z': 'lps'
  };

  var BLOCKS = %BLOCKS%;

  var CATEGORIES = %CATEGORIES%;

  var XML_NAME_START_CHARACTERS = %XML_NAME_START_CHARACTERS%;

  var XML_NAME_CHARACTERS = disjoin(sort(XML_NAME_START_CHARACTERS.concat(%XML_NAME_CHARACTERS%)));

  return unicode;

});
