/* Copyright (c) 2013, Erik Wienhold
 * All rights reserved.
 *
 * Licensed under the BSD 3-Clause License.
 */

/* global define */

define([
  'sulfur/object',
  'sulfur/schema/regex/codeunit',
  'sulfur/schema/regex/group',
  'sulfur/schema/regex/range'
], function ($object, $codeunit, $group, $range) {

  'use strict';

  /**
   * The compiler is used to generate a JavaScript RegExp from a parsed regular
   * expression tree.
   */

  function compilePattern(pattern) {
    var s = pattern.branches.reduce(function (s, branch, index) {
      if (index > 0) {
        s += '|';
      }
      return s + compileBranch(branch);
    }, '');
    return pattern.branches.length > 1 ? '(?:' + s + ')' : s;
  }

  function compileBranch(branch) {
    return branch.pieces.reduce(function (s, piece) {
      return s + compilePiece(piece);
    }, '');
  }

  function compilePiece(piece) {
    var atom;
    if ($codeunit.prototype.isPrototypeOf(piece.atom)) {
      atom = compileCodeunit(piece.atom);
    } else if ($group.prototype.isPrototypeOf(piece.atom)) {
      atom = compileGroup(piece.atom);
    } else {
      throw new Error("not implemented");
    }
    return atom + compileQuantifier(piece.quant);
  }

  function compileQuantifier(quant) {
    var min = quant.min;
    var max = quant.max;
    if (min === 0) {
      if (max === 1) {
        return '?';
      } else if (max === Number.POSITIVE_INFINITY) {
        return '*';
      }
    } else if (min === 1) {
      if (max === 1) {
        return '';
      } else if (max === Number.POSITIVE_INFINITY) {
        return '+';
      }
    } else if (min === max) {
      return '{' + min + '}';
    } else if (max === Number.POSITIVE_INFINITY) {
      return '{' + min + ',}';
    }
    return '{' + min + ',' + max + '}';
  }

  function compileCodeunit(codeunit) {
    var value = codeunit.value;
    if (isMetaCharacter(value)) {
      return '\\' + String.fromCharCode(value);
    } else if (value === 0x9) {
      return '\\t';
    } else if (value === 0xA) {
      return '\\n';
    } else if (value === 0xD) {
      return '\\r';
    } else if (value <= 0x7E) {
      return String.fromCharCode(value);
    } else if (value <= 0xFF) {
      return '\\x' + value.toString(16).toUpperCase();
    }
    var hex = value.toString(16).toUpperCase();
    if (hex.length < 4) {
      hex = '0' + hex;
    }
    return '\\u' + hex;
  }

  var isMetaCharacter = (function () {
    var META_CHARACTERS = '\\()[]{}*+?.'.split('').map(function (chr) {
      return chr.charCodeAt(0);
    });

    return function isMetaCharacter(value) {
      return META_CHARACTERS.indexOf(value) !== -1;
    };
  }());

  function compileGroup(group) {
    var s = group.items.reduce(function (s, item) {
      if ($codeunit.prototype.isPrototypeOf(item)) {
        s += compileCodeunit(item);
      } else if ($range.prototype.isPrototypeOf(item)) {
        s += compileCodeunit(item.start);
        s += '-';
        s += compileCodeunit(item.end);
      }
      return s;
    }, '');
    var neg = group.positive ? '' : '^';
    return '[' + neg + s + ']';
  }

  return $object.derive({
    /**
     * Compile a tree given by its root pattern.
     *
     * @param [pattern] pattern the pattern (root of a tree) to compile
     *
     * @return [RegExp] the compiled executable regular expression
     */
    compile: function (pattern) {
      return new RegExp('^' + compilePattern(pattern) + '$');
    }
  });

});
